"use client";

import { useState } from "react";
import ScrollReveal from "../ScrollReveal";

const faqs = [
  {
    question: "AI AGENT SUMMIT có phải là một lớp học công cụ AI không?",
    answer:
      "Không. Summit không dạy kỹ thuật quá sâu và không biến thành lớp học tool chi tiết. Mục tiêu của một ngày này là mở nhận thức về AI Agent, tạo WOW bằng showcase thật, cho anh chị thấy khoảng cách hiện tại và giúp anh chị nhìn ra nhu cầu xây hệ thống cho doanh nghiệp của mình.",
  },
  {
    question: "Tôi chưa rành AI, chỉ mới dùng ChatGPT — tham dự có theo kịp không?",
    answer:
      "Hoàn toàn được. Summit được thiết kế để mở bức tranh lớn, không yêu cầu nền tảng kỹ thuật. Anh chị sẽ hiểu AI Agent khác gì so với dùng ChatGPT rời rạc, và quan trọng hơn là biết doanh nghiệp của mình nên ứng dụng AI Agent vào đâu trước.",
  },
  {
    question: "Tôi sẽ mang về được gì cụ thể sau một ngày tham dự?",
    answer:
      "Anh chị ra về với một bản đồ AIOS sơ bộ cho chính mô hình kinh doanh của mình — kết quả trực tiếp từ Workshop Build Your AIOS Map. Cùng với đó là sự hiểu biết rõ ràng về AI Agent, AIOS, các điểm nghẽn trong mô hình hiện tại, và lộ trình ứng dụng tiếp theo.",
  },
  {
    question: "Live Showcase là gì? Có thật sự xem được hệ thống AI Agent hoạt động không?",
    answer:
      "Có. Live AI Agent Showcase là phần demo trực tiếp các hệ thống AI Agent đang vận hành thật: từ một sản phẩm tạo chiến lược marketing, từ chân dung khách hàng tạo sales system, từ một content win tạo content engine, từ ý tưởng kinh doanh tạo workflow AIOS, và từ một niche KDP/POD/Affiliate tạo hệ thống triển khai.",
  },
  {
    question: "Vé có những gói nào? Tôi nên chọn gói nào?",
    answer:
      "Có 3 gói: Vé Thường (499.000đ — vé tham dự trực tiếp kèm full tài liệu chương trình), Vé VIP (999.000đ — được nhiều người chọn nhất: tặng kèm khoá học “Agent / Claude Code” trị giá 8.000.000đ kèm Skill/Template, và tặng thêm 2 vé cho 2 người đi cùng) và Vé Super VIP (1.999.000đ — thêm phần ăn tối cùng diễn giả, 30 phút tư vấn riêng 1:1, và tặng 3 vé cho 3 người đi cùng). Vé VIP là lựa chọn đáng giá nhất vì riêng quà tặng đã trị giá 8 triệu. Anh chị xem chi tiết quyền lợi từng gói ở mục Giá Vé.",
  },
  {
    question: "Global Elite Club có bắt buộc tham gia sau Summit không?",
    answer:
      "Không bắt buộc. Global Elite Club là bước tiếp theo dành cho những anh chị muốn được đồng hành triển khai AIOS và hệ thống AI Agent trong 1 năm. Summit giúp anh chị nhìn thấy cánh cửa — còn quyết định bước qua là tuỳ nhu cầu của doanh nghiệp anh chị.",
  },
  {
    question: "Sự kiện tổ chức khi nào và ở đâu?",
    answer:
      "AI AGENT SUMMIT diễn ra trong một ngày, từ 08:00 đến 18:00. Thông tin ngày tổ chức và địa điểm cụ thể sẽ được cập nhật và gửi tới anh chị qua email/điện thoại sau khi đăng ký. Số lượng giới hạn ~200 người nên anh chị nên giữ chỗ sớm.",
  },
];

export default function FAQSummit() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="py-16 sm:py-24 px-4 sm:px-6 bg-surface-container-lowest"
      id="faq"
    >
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-8 sm:mb-12 text-center uppercase">
            Câu Hỏi Thường Gặp
          </h2>
        </ScrollReveal>
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={faq.question} delay={index * 80}>
              <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 sm:p-6">
                <button
                  className="flex justify-between items-center cursor-pointer w-full text-left gap-3"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  aria-expanded={openIndex === index}
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
