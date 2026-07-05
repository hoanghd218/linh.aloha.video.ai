"use client";

import { useState } from "react";
import ScrollReveal from "../ScrollReveal";

const faqs = [
  {
    question: "OpenClaw là gì và khác Claude Code / ChatGPT như thế nào?",
    answer:
      "OpenClaw là harness (bộ cơ thể) cho AI agent — chạy ngay trên máy bạn hoặc VPS, có memory, skill, cron jobs, MCP và kết nối Discord/Telegram. Khác với ChatGPT (chỉ chat) hay Claude Code (dev tool), OpenClaw là \"digital employee\" vận hành 24/7 cho business. Trong khoá học, Tony sẽ dạy cách dùng OpenClaw làm orchestrator điều phối nhiều sub-agent chuyên biệt.",
  },
  {
    question: "Tôi không biết code có theo được khoá học không?",
    answer:
      "Hoàn toàn được. Khoá học dành cho marketer, chủ doanh nghiệp, content creator — không cần background kỹ thuật. Buổi 1 sẽ hướng dẫn cài đặt Homebrew → Node → OpenClaw từng bước, có partner system (Claude Desktop) hỗ trợ debug khi gặp lỗi.",
  },
  {
    question: "Tôi cần chuẩn bị gì trước khi vào khoá học?",
    answer:
      "1 máy tính Mac (hoặc Windows có WSL2) hoặc 1 VPS, kết nối Internet ổn định. Buổi 1 sẽ so sánh VPS vs Mac Mini và giúp bạn chọn hạ tầng phù hợp. Không cần cài đặt gì trước — tất cả sẽ hướng dẫn live trong buổi đầu tiên.",
  },
  {
    question: "5 use case Research → Idea → Content → Sách → Website hoạt động thế nào?",
    answer:
      "Đây là 5 agent build thực chiến trong Buổi 4, mỗi build = 1 sub-agent chuyên biệt: (1) Research Agent scrape đối thủ & thị trường, (2) Idea Generation Agent chạy cron mỗi sáng gợi ý content, (3) Content Production Agent viết script → carousel → caption → lịch đăng, (4) Book Production Agent viết sách với memory graph giữ nhất quán, (5) Website Agent tạo landing page + tự QA + tự fix lỗi. Bạn chọn 1 build để chạy end-to-end cho business thật.",
  },
  {
    question: "Tôi kiếm tiền bằng OpenClaw như thế nào sau khoá học?",
    answer:
      "Buổi 5 là buổi hướng dẫn kiếm tiền bằng OpenClaw. Tony sẽ dạy 5 con đường: (1) In-house — dùng hệ multi-agent thay 1 team marketing, tiết kiệm chi phí vận hành cho chính business bạn; (2) Freelance service — nhận job research / content / sách / website cho client; (3) Productized service — đóng gói 1 trong 5 agent build thành dịch vụ trọn gói; (4) Digital product — bán template, skill, blueprint; (5) Affiliate / Referral. Chuyên gia domain (real estate, F&B, e-commerce...) có lợi thế lớn hơn dev generic vì hiểu bài toán khách hàng.",
  },
  {
    question: "Khoá học có recording không? Tôi bỏ lỡ 1 buổi thì sao?",
    answer:
      "Có. Toàn bộ 5 buổi sẽ được record và gửi vào nhóm học viên, xem lại không giới hạn. Tuy nhiên các buổi thực hành live là cơ hội để mentor review trực tiếp identity files, Discord setup, agent builds và capstone của bạn, nên khuyến khích tham gia đầy đủ.",
  },
  {
    question: "Học phí 5 triệu có bao gồm chi phí model AI không?",
    answer:
      "Không. OpenClaw là harness open-source, còn model là subscription/API riêng. Buổi 1 sẽ hướng dẫn 3 lựa chọn: Subscription (ChatGPT/Codex), API key, hoặc Local Ollama — kèm so sánh chi phí để bạn chọn phương án tiết kiệm nhất cho workload của mình.",
  },
];

export default function FAQOpenClaw() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest"
      id="faq"
    >
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-8 sm:mb-12 text-center uppercase">
            Thắc Mắc Thường Gặp
          </h2>
        </ScrollReveal>
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={faq.question} delay={index * 80}>
              <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 sm:p-6">
                <button
                  className="flex justify-between items-center cursor-pointer w-full text-left gap-3"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="font-bold text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <span
                    className="material-symbols-outlined text-primary shrink-0 transition-transform duration-300"
                    style={{
                      transform: openIndex === index ? "rotate(180deg)" : "",
                    }}
                  >
                    {openIndex === index ? "remove" : "add"}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? "max-h-128 mt-3 sm:mt-4" : "max-h-0"
                  }`}
                >
                  <p className="text-on-surface-variant text-xs sm:text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
