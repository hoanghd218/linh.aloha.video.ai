"use client";

import ScrollReveal from "../ScrollReveal";

export default function GuaranteeMastery() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <ScrollReveal direction="scale">
          <div className="bg-linear-to-br from-primary/5 to-surface-container-high rounded-3xl sm:rounded-4xl p-6 sm:p-10 md:p-14 border-2 border-primary/30 shadow-[0_0_60px_rgba(245,158,11,0.15)]">
            <div className="grid md:grid-cols-[auto_1fr] gap-6 sm:gap-10 items-center">
              {/* Badge */}
              <div className="flex justify-center">
                <div className="relative w-32 h-32 sm:w-44 sm:h-44 flex items-center justify-center">
                  <div className="absolute inset-0 bg-linear-to-br from-primary to-primary-container rounded-full animate-pulse-glow opacity-90" />
                  <div className="absolute inset-2 bg-surface-container-high rounded-full border-2 border-primary" />
                  <div className="relative z-10 text-center">
                    <div className="text-[9px] sm:text-xs font-black text-primary uppercase tracking-wider">
                      Cam kết
                    </div>
                    <div className="text-2xl sm:text-4xl font-black text-on-surface leading-none mt-0.5">
                      100%
                    </div>
                    <div className="text-[9px] sm:text-xs font-black text-primary uppercase tracking-wider mt-0.5">
                      Hoàn tiền
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="text-center md:text-left space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary font-black text-[10px] sm:text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-base sm:text-lg">
                    shield
                  </span>
                  Cam kết chất lượng
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-on-surface tracking-tighter">
                  Hoàn Tiền 100% Nếu Sau Buổi 2
                  <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary">
                    Bạn Không Thấy Giá Trị
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                  Chúng tôi tự tin vào chất lượng khoá học đến mức: nếu sau buổi 2,
                  bạn cảm thấy nội dung không mang lại giá trị như cam kết —{" "}
                  <span className="text-on-surface font-bold">
                    chúng tôi sẽ hoàn lại 100% học phí
                  </span>
                  , không cần giải thích. Bạn vẫn được giữ toàn bộ recording và bonus
                  đã nhận.
                </p>

                <div className="space-y-2 pt-2">
                  {[
                    "Không cần điền form phức tạp — nhắn Zalo là xong",
                    "Hoàn tiền trong vòng 24 giờ làm việc",
                    "Rủi ro 0% — chỉ có bạn được lợi",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex gap-2 items-start text-xs sm:text-sm text-on-surface-variant justify-center md:justify-start"
                    >
                      <span className="material-symbols-outlined text-primary text-base sm:text-lg shrink-0">
                        check_circle
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
