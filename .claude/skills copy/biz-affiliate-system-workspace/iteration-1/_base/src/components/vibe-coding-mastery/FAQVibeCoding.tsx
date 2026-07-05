"use client";

import { useState } from "react";
import ScrollReveal from "../ScrollReveal";

const faqs = [
  {
    question: "Tôi không biết code gì cả có theo được không?",
    answer:
      "Hoàn toàn được. Khoá học được thiết kế cho người không có background kỹ thuật. Bạn sẽ dùng Antigravity (GUI) và Claude Code để build — không phải gõ code từ đầu. Buổi 1 hướng dẫn setup từng bước, từ cài app đến deploy website đầu tiên.",
  },
  {
    question: "Vibe Coding khác học lập trình truyền thống như thế nào?",
    answer:
      "Học lập trình truyền thống mất 1-2 năm để build được app thực. Vibe Coding dùng AI (Claude Code, ChatGPT Codex) như người viết code cho bạn — bạn chỉ cần mô tả, AI tạo ra code. Kết quả: từ ý tưởng đến sản phẩm live trong vài giờ thay vì vài tháng.",
  },
  {
    question: "Tôi cần chuẩn bị phần mềm và tài khoản gì?",
    answer:
      "Máy tính (Mac hoặc Windows), kết nối internet, tài khoản Claude Pro ($20/tháng) hoặc ChatGPT Plus ($20/tháng). Antigravity sẽ được hướng dẫn cài trong buổi 1 — miễn phí trong giai đoạn beta. Không cần cài bất cứ thứ gì trước.",
  },
  {
    question: "Sau khoá học tôi có thể build được những gì?",
    answer:
      "Website bán hàng với thanh toán tự động (SePay/Stripe), platform quản lý khoá học, lead generation app, client dashboard, portfolio cá nhân. Tất cả đều production-ready — dùng để kinh doanh thực, không chỉ là demo.",
  },
  {
    question: "Tích hợp SePay có phức tạp không? Cần tài khoản doanh nghiệp không?",
    answer:
      "Không phức tạp. Buổi 4 hướng dẫn từng bước với step-by-step guide. SePay hỗ trợ cả tài khoản cá nhân — không cần đăng ký doanh nghiệp. Bạn sẽ test full flow từ đầu đến cuối trong buổi học.",
  },
  {
    question: "Khoá học có recording không? Tôi bỏ lỡ 1 buổi thì sao?",
    answer:
      "Có. Toàn bộ 5 buổi sẽ được record và gửi vào nhóm học viên ngay sau khi kết thúc buổi đó. Xem lại không giới hạn. Tuy nhiên các buổi live có phần thực hành và Q&A trực tiếp — nên tham gia đầy đủ để tận dụng tối đa.",
  },
  {
    question: "Khoá học này có bán lẻ không?",
    answer:
      "Không. Vibe Coding Mastery không bán lẻ ở bất kỳ đâu — đây là đặc quyền chỉ dành cho thành viên Freedom Builder Pro. Khi vào gói Pro, bạn được tự động cấp quyền truy cập trọn bộ 5 buổi + 6 bonus trị giá 16 triệu.",
  },
];

export default function FAQVibeCoding() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest" id="faq">
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
                  <span className="font-bold text-sm sm:text-base">{faq.question}</span>
                  <span
                    className="material-symbols-outlined text-primary shrink-0 transition-transform duration-300"
                    style={{ transform: openIndex === index ? "rotate(180deg)" : "" }}
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
