"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

const faqs = [
  {
    question: "Tôi chưa giỏi công nghệ có tham gia được không?",
    answer:
      "Có. Agent Camp không yêu cầu bạn phải là lập trình viên. Chương trình tập trung vào tư duy ứng dụng AI Agent vào mô hình kinh doanh. Tuy nhiên, bạn cần có tinh thần thực hành và sẵn sàng thay đổi cách làm việc cũ.",
  },
  {
    question: "Tôi chưa có doanh nghiệp lớn, chỉ đang kinh doanh cá nhân thì có phù hợp không?",
    answer:
      "Rất phù hợp. Chương trình hợp với người kinh doanh cá nhân, chuyên gia, coach, nhà đào tạo, affiliate hoặc người đang xây mô hình tinh gọn. Đây là nhóm có lợi thế vì có thể ứng dụng nhanh, thử nghiệm nhanh và thay đổi nhanh.",
  },
  {
    question: "Tôi đang làm Affiliate, KDP, POD hoặc TikTok US thì có phù hợp không?",
    answer:
      "Rất phù hợp. Ngày 3 của camp có các phần showcase và định hướng xây hệ thống Agent cho các mô hình có khả năng nhân bản như AI Affiliate Content Engine, Amazon KDP, POD và kênh bán hàng bằng AI.",
  },
  {
    question: "Đây là khoá học hay mastermind?",
    answer:
      "Agent Camp là sự kết hợp giữa huấn luyện, mastermind, demo hệ thống, thực hành và hỏi đáp chuyên sâu. Bạn không chỉ nghe bài giảng — bạn được định hướng cách áp dụng vào bài toán thật của doanh nghiệp mình.",
  },
  {
    question: "Sau chương trình tôi có xây được hệ thống hoàn chỉnh ngay không?",
    answer:
      "Mục tiêu của 3 ngày là giúp bạn có bản đồ, tư duy, quy trình, framework và định hướng triển khai rõ ràng. Một số phần bạn có thể bắt đầu xây ngay trong hoặc sau chương trình. Để xây AIOS hoàn chỉnh cho doanh nghiệp, bạn sẽ cần tiếp tục triển khai, đo lường và tối ưu — Agent Camp là điểm khởi động mạnh để đi đúng hướng.",
  },
  {
    question: "Vì sao số lượng chỉ giới hạn khoảng 60 người?",
    answer:
      "Vì chương trình cần chất lượng tương tác. Nếu quá đông, việc hỏi đáp, phân tích và cá nhân hoá cho từng nhóm sẽ bị giảm. Agent Camp không phải lớp học đại trà — đây là chương trình dành cho nhóm người nghiêm túc, muốn đi sâu và thực chiến.",
  },
  {
    question: "Thành viên Elite có quyền lợi gì?",
    answer:
      "Thành viên Elite có mức ưu tiên đặc biệt 3.868.000đ. Đây là quyền lợi riêng cho nhóm Elite vì anh chị đang trong lộ trình đồng hành sâu hơn với hệ sinh thái Freedom Builders và chiến lược xây dựng AIOS.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest" id="faq">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-6 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
              <span className="material-symbols-outlined text-base sm:text-lg">help</span>
              CÂU HỎI THƯỜNG GẶP
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-on-surface uppercase tracking-tight">
              Thắc Mắc Trước Khi Đăng Ký?
            </h2>
          </div>
        </ScrollReveal>
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={faq.question} delay={index * 80}>
              <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 sm:p-6 hover:border-primary/30 transition-colors">
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
