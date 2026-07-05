"use client";

import { useState } from "react";
import ScrollReveal from "../ScrollReveal";

const faqs = [
  {
    question: "Vé miễn phí và vé trả phí khác nhau thế nào?",
    answer:
      "Cả hai vé đều tham gia đủ 2 buổi Zoom live cùng 3 mentor. Vé miễn phí phù hợp nếu bạn muốn hiểu bức tranh tổng quan về AI Agent. Vé trả phí 499K dành cho người muốn nhận thêm 9 bộ Skill AI Agent lắp vào dùng ngay cho business — có quy trình, prompt, template và khung Agent để áp dụng vào công việc thật.",
  },
  {
    question: "Tôi không phải dân kỹ thuật, có theo được không?",
    answer:
      "Hoàn toàn được. Chương trình được thiết kế cho người kinh doanh, không phải dân kỹ thuật. Chủ doanh nghiệp không cần tự code, chỉ cần đủ hiểu để đặt bài toán đúng, giao việc đúng và kiểm soát kết quả đúng. Mentor sẽ hướng dẫn bạn đi từ tư duy hệ thống đến khung Agent đầu tiên.",
  },
  {
    question: "Buổi Zoom diễn ra khi nào? Tôi bỏ lỡ thì sao?",
    answer:
      "Lịch buổi Zoom sẽ được gửi vào nhóm Zalo sau khi đăng ký. Nếu bạn lỡ buổi live, sẽ có recording để xem lại. Tuy nhiên các buổi live là cơ hội để hỏi mentor trực tiếp, nên khuyến khích tham gia đầy đủ.",
  },
  {
    question: "9 bộ Skill AI Agent là gì? Áp dụng được ngay không?",
    answer:
      "Là 9 khung Agent đã được thiết kế cho các đầu việc thực tế: đẻ content, đọc vị nỗi đau khách hàng, kịch bản tư vấn, chăm lead 7 ngày, tái chế 1 ý → 10 nội dung, báo cáo cuối ngày, biến kinh nghiệm thành SOP, soi đối thủ, dựng chiến dịch 7 ngày. Mỗi Skill có quy trình + prompt + template — bạn chỉ việc fill thông tin business và chạy.",
  },
  {
    question: "Tôi đã xem nhiều video AI miễn phí rồi, vé trả phí có khác gì?",
    answer:
      "Khác ở chỗ bạn không cần thêm 1 video lan man nữa. Vé trả phí cho bạn quy trình rõ hơn, khung triển khai cụ thể hơn, cách bắt đầu đơn giản hơn, và bộ tài sản (9 Agent) để lắp vào business nhanh hơn. Mục tiêu là rút ngắn nhiều tháng tự mò.",
  },
  {
    question: "Tôi cần chuẩn bị gì trước khi vào 2 buổi Zoom?",
    answer:
      "Chỉ cần 1 máy tính + Internet ổn định, và sự sẵn sàng nhìn lại business của mình một cách trung thực. Mentor sẽ hướng dẫn bạn cách chọn quy trình nên AI hóa trước, cách bóc tách theo Input → Process → Output. Không cần cài đặt gì phức tạp trước.",
  },
  {
    question: "Sau 2 buổi Zoom có hỗ trợ tiếp không?",
    answer:
      "Có. Bạn sẽ tham gia cộng đồng Zalo riêng để hỏi đáp, chia sẻ kinh nghiệm và được hỗ trợ trong quá trình triển khai 9 bộ Agent vào business.",
  },
];

export default function FAQZoom() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="py-10 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest"
      id="faq"
    >
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-6 sm:mb-12 text-center uppercase">
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
