#!/usr/bin/env python3
"""Grade a with_skill eval output against the 14 assertions. Writes grading.json."""
import json, re, sys, os

def grade(run_dir):
    pf = os.path.join(run_dir, "outputs", "project-files")
    def read(rel):
        p = os.path.join(pf, rel)
        return open(p, encoding="utf-8").read() if os.path.isfile(p) else None
    def exists(rel):
        return os.path.isfile(os.path.join(pf, rel))

    # locate migration sql
    mig = None
    for root, _, files in os.walk(pf):
        for f in files:
            if f.endswith(".sql") and "affiliate" in f.lower():
                mig = open(os.path.join(root, f), encoding="utf-8").read()
    build = read("../BUILD-RESULT.txt") or (open(os.path.join(run_dir,"outputs","BUILD-RESULT.txt"),encoding="utf-8").read() if os.path.isfile(os.path.join(run_dir,"outputs","BUILD-RESULT.txt")) else "")

    libaff = read("src/lib/affiliate.ts") or ""
    tracker = read("src/components/AffiliateTracker.tsx") or ""
    register = read("src/app/api/register/route.ts") or ""
    webhook = read("src/app/api/sepay-webhook/route.ts") or ""
    layout = read("src/app/layout.tsx") or ""
    leads = read("src/lib/leads-supabase.ts") or ""
    portal = read("src/app/affiliate/page.tsx") or ""

    checks = []
    def add(text, passed, evidence):
        checks.append({"text": text, "passed": bool(passed), "evidence": evidence})

    add("A Supabase migration .sql file was created containing CREATE TABLE for affiliates, affiliate_clicks, and affiliate_commissions",
        mig and all(f"affiliate" in mig for _ in [0]) and "affiliates" in mig and "affiliate_clicks" in mig and "affiliate_commissions" in mig,
        "migration found, all 3 tables present" if mig and "affiliate_commissions" in mig else "missing migration or tables")

    add("The migration adds an aff_code column to the existing leads table via ALTER TABLE",
        mig and re.search(r"ALTER TABLE\s+leads\s+ADD COLUMN.*aff_code", mig, re.I|re.S),
        "ALTER TABLE leads ... aff_code found" if mig and re.search(r"ALTER TABLE\s+leads.*aff_code", mig, re.I|re.S) else "not found")

    add("The affiliate_commissions table declares order_id as UNIQUE so a retried payment webhook cannot create a duplicate commission",
        mig and re.search(r"order_id\s+TEXT\s+NOT NULL\s+UNIQUE", mig, re.I),
        "order_id ... UNIQUE found in affiliate_commissions" if mig and re.search(r"order_id\s+TEXT\s+NOT NULL\s+UNIQUE", mig, re.I) else "not found")

    add("A store module lib/affiliate.ts (or src/lib/affiliate.ts) was created",
        exists("src/lib/affiliate.ts"), "src/lib/affiliate.ts present" if exists("src/lib/affiliate.ts") else "missing")

    add("The commission tier rates are Pro = 30 percent and Elite = 40 percent",
        re.search(r"pro:\s*30", libaff) and re.search(r"elite:\s*40", libaff),
        "TIER_RATES pro:30 elite:40 found" if re.search(r"pro:\s*30", libaff) else "not found")

    add("Commission amount is computed as a percentage of the order value (order_amount times rate divided by 100)",
        re.search(r"orderAmount\s*\*\s*rate\s*\)?\s*/\s*100", libaff) or re.search(r"\*\s*rate\s*/\s*100", libaff),
        "commission = orderAmount * rate / 100 found" if re.search(r"rate\s*\)?\s*/\s*100", libaff) else "not found")

    add("An AffiliateTracker client component was created that captures the ?aff= URL parameter into a cookie",
        tracker and '"use client"' in tracker and 'aff' in tracker and "document.cookie" in tracker,
        "AffiliateTracker reads ?aff= and writes document.cookie" if tracker and "document.cookie" in tracker else "missing/incomplete")

    add("Three API routes were created: a public click-tracking endpoint, an affiliate portal data endpoint, and an admin affiliates endpoint",
        exists("src/app/api/affiliate/click/route.ts") and exists("src/app/api/affiliate/route.ts") and exists("src/app/api/admin/affiliates/route.ts"),
        "click + portal + admin routes all present" if exists("src/app/api/admin/affiliates/route.ts") else "missing one or more routes")

    add("An admin management page at /admin/affiliates and an affiliate portal page at /affiliate were created",
        exists("src/app/admin/affiliates/page.tsx") and exists("src/app/affiliate/page.tsx"),
        "both pages present" if exists("src/app/affiliate/page.tsx") else "missing a page")

    add("The register API route was patched to attribute the affiliate code onto the newly created lead",
        register and "affCode" in register and "aff_ref" in register,
        "register reads aff_ref cookie + passes affCode" if "aff_ref" in register else "not patched")

    add("The sepay-webhook API route was patched to create a commission record after a payment is confirmed",
        webhook and "recordCommissionForOrder" in webhook,
        "recordCommissionForOrder called in webhook" if "recordCommissionForOrder" in webhook else "not patched")

    add("The root layout.tsx was patched to mount the AffiliateTracker component",
        layout and "AffiliateTracker" in layout and "<AffiliateTracker" in layout,
        "<AffiliateTracker /> mounted in layout" if "<AffiliateTracker" in layout else "not patched")

    build_line1 = build.strip().splitlines()[0].strip() if build.strip() else ""
    build_ok = build_line1 == "0"
    add("The project builds successfully with npm run build (exit code 0)",
        build_ok,
        f"BUILD-RESULT.txt line 1 = '{build_line1}' (exit code 0 = pass)" if build_ok
        else f"build did not pass (line 1 = '{build_line1}')")

    add("Customer-facing pages use natural Vietnamese with anh/chi addressing",
        portal and "anh/ch" in portal,
        "affiliate portal page uses 'anh/chị'" if portal and "anh/ch" in portal else "no anh/chị found")

    passed = sum(1 for c in checks if c["passed"])
    result = {
        "expectations": checks,
        "summary": {"passed": passed, "failed": len(checks)-passed, "total": len(checks),
                     "pass_rate": round(passed/len(checks), 3)},
    }
    out = os.path.join(run_dir, "grading.json")
    json.dump(result, open(out, "w"), ensure_ascii=False, indent=2)
    print(f"{run_dir}: {passed}/{len(checks)} passed -> {out}")
    for c in checks:
        if not c["passed"]:
            print("   FAIL:", c["text"][:70], "::", c["evidence"])

if __name__ == "__main__":
    for d in sys.argv[1:]:
        grade(d)
