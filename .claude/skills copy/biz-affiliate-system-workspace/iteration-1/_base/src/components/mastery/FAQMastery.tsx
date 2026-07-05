"use client";

import { useState } from "react";
import ScrollReveal from "../ScrollReveal";

const faqs = [
  {
    question: "Tôi không biết code có theo được khoá học không?",
    answer:
      "Hoàn toàn được. Khoá học dành riêng cho marketer, chủ doanh nghiệp, content creator — không cần background kỹ thuật. Buổi 1 sẽ hướng dẫn setup Antigravity (GUI) nên bạn không phải đụng tới Terminal.",
  },
  {
    question: "Tôi cần chuẩn bị gì trước khi vào khoá học?",
    answer:
      "Chỉ cần 1 máy tính (Windows hoặc Mac), kết nối Internet ổn định, và 1 tài khoản Claude (Pro hoặc Max — buổi 1 sẽ hướng dẫn chọn plan phù hợp). Không cần cài đặt gì trước, tất cả sẽ được hướng dẫn live trong buổi đầu tiên.",
  },
  {
    question: "Khoá học có recording không? Tôi bỏ lỡ 1 buổi thì sao?",
    answer:
      "Có. Toàn bộ 5 buổi sẽ được record và gửi vào nhóm học viên. Bạn có thể xem lại không giới hạn. Tuy nhiên các buổi thực hành live là cơ hội để mentor review trực tiếp code / CLAUDE.md / capstone của bạn, nên khuyến khích tham gia đầy đủ.",
  },
  {
    question: "Sau khoá học tôi có được hỗ trợ tiếp không?",
    answer:
      "Có. Học viên sẽ tham gia cộng đồng Zalo riêng để hỏi đáp, chia sẻ kinh nghiệm và được hỗ trợ debug Skills, MCP, Sub-Agents trong quá trình áp dụng vào business thực tế.",
  },
  {
    question: "Capstone project cuối khoá là gì?",
    answer:
      "Mỗi học viên sẽ xây 1 hệ thống hoàn chỉnh: Research thị trường → Ý tưởng sản phẩm → Viết sách/ebook → Website bán hàng — tất cả chạy qua 1 agent team duy nhất. Tony Hoang sẽ review trực tiếp và tư vấn cách tối ưu cho business của bạn.",
  },
  {
    question: "Khoá học này có bán lẻ không? Làm sao để tham gia?",
    answer:
      "Không. Claude AI Mastery không bán lẻ ở bất kỳ đâu — đây là đặc quyền chỉ dành cho thành viên Freedom Builder Pro. Khi bạn tham gia gói Pro, bạn sẽ được tự động cấp quyền truy cập trọn bộ 5 buổi + 6 bonus trị giá 14 triệu kèm theo.",
  },
  {
    question: "Học phí có bao gồm chi phí Claude AI không?",
    answer:
      "Không. Claude Pro/Max là subscription riêng của Anthropic (~$20-100/tháng tuỳ plan). Buổi 1 sẽ hướng dẫn chọn plan tiết kiệm nhất cho marketer và các chiến lược token để giảm chi phí khi làm khối lượng lớn.",
  },
];

export default function FAQMastery() {
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
                    openIndex === index ? "max-h-96 mt-3 sm:mt-4" : "max-h-0"
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
