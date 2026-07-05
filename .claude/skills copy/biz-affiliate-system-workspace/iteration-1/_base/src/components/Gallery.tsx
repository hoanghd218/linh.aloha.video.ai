"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ScrollReveal from "./ScrollReveal";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

const campVenueImages: GalleryImage[] = [
  "z7831732562252_bbdf3073473386a444d0a25ad3810709.jpg",
  "z7831732565329_51b5c40daf896ca8c88958cceb75706d.jpg",
  "z7831732569389_df8d1843388f8144a7eb13ebc5d501bf.jpg",
  "z7831732574920_d8c753f97ada8ca35583ce698728fa45.jpg",
  "z7831732578576_921e1d20a5ed6bff0d95be46732b73cb.jpg",
  "z7831732583782_4d16a6f98dc644e585b4153a10035831.jpg",
  "z7831732587710_a07864227553d848d278ac71a6d691cf.jpg",
  "z7831732592341_ba961483611e3843398cbad88b717fc4.jpg",
  "z7831732595190_cc75ec55c4c782ff80679360ac53b236.jpg",
  "z7831732600847_e8b2f6ebc05158f769ff245574c4c5b5.jpg",
  "z7831732604810_ec65843b7da5d99412ae651b93b96da8.jpg",
  "z7831732609766_ad7974630017c84612e4001927a350ca.jpg",
  "z7831732614080_e6af68d07b0811a762dde4943bb5bef5.jpg",
  "z7831732617673_5a415be4b9e47460bac2e34e3e624867.jpg",
  "z7831732622368_16cbb5c80de657e1745def046abdff73.jpg",
  "z7831732627188_6b31d678db5f0c4591a02098af4f3cf4.jpg",
  "z7831732630838_91f064197b3fa7dad9353ddbb98a1b40.jpg",
  "z7831732636579_517162a27201a266a0377cfcddea6337.jpg",
  "z7831732639654_e9de75e78161a52452e68435191918d7.jpg",
  "z7831732644284_4ab3048bde35b9f9820abd50a694004c.jpg",
  "z7831732647645_02b9a68d6ac5711568608818a0b527aa.jpg",
  "z7831732652046_14c72ec5815d03935edc9cf9e176d1fe.jpg",
  "z7831732656179_d5a78d80108f308e0aed1d2fcd8c1160.jpg",
  "z7831732661422_6b578f6c96ba21f26756a96ce2e88e51.jpg",
  "z7831732665283_6fb3f619b3c7a4b7ffd53e4b5fbbeff9.jpg",
  "z7831732668933_3eea513e60dfeb1e179592b4e3c04419.jpg",
  "z7831732673235_102b331141bc28f4c478eb4f9ec16655.jpg",
  "z7831732678722_a4f94627c147ee77edcd362a1c47fc8b.jpg",
  "z7831732682497_b85a84e11252a5d96d3d9f20c8de9eea.jpg",
  "z7831732687872_31e6ec512791d6af090c86cbf8d167c7.jpg",
  "z7831732689569_55db759a0f5952803df48b1b87f65e0d.jpg",
  "z7831732694208_d4183ded9b754067e3f392e9b79bd7e2.jpg",
  "z7831732700236_cf330af5508cbe6bad9f46d3d40c53a8.jpg",
  "z7831732705358_5ee27e538e90ec42ca57e7176a243ba0.jpg",
  "z7831732707835_aecce16dfb5eb9a3210c14a4ea1ba6cc.jpg",
  "z7831732713867_7697cd35a8a3e846af70c368a72481c6.jpg",
  "z7831732716630_92e4ad73061cb0fbbb9809c5db4d2c15.jpg",
  "z7831732720609_4ca7e3314921e118de8d4ef3108ca03a.jpg",
  "z7831732725949_4ddb7164cdf3372a258e289921a3549d.jpg",
  "z7831732730891_45f62d5e6b2f0361e45aae0c341d0c89.jpg",
  "z7831732734569_638dbbfe9f463b3cdb78d22d0ead293e.jpg",
].map((file, i) => ({
  src: `/images/camps/${file}`,
  alt: `Không gian Camp Ba Vì #${i + 1}`,
  caption: `Camp Ba Vì — Không gian thực tế #${i + 1}`,
}));

const speakerImages: GalleryImage[] = [
  { src: "/images/speakers/IMG_1187.jpg", alt: "Speaker thuyết trình về OpenClaw Toolkit", caption: "Giới thiệu The OpenClaw Toolkit — hệ thống AI Agent hoàn chỉnh" },
  { src: "/images/speakers/IMG_1189.jpg", alt: "Speaker demo quy trình AI Agent ra mắt sản phẩm", caption: "Demo: Agent ra mắt sản phẩm Amazon trong vài phút" },
  { src: "/images/speakers/aios.png", alt: "Hệ thống AIOS — AI Operating System", caption: "AIOS — Hệ điều hành AI cho doanh nghiệp" },
  { src: "/images/thuy-ai.jpg", alt: "Ms. Thuy AI — Chuyên gia AI Agent", caption: "Ms. Thuy AI — Mentor AIOS đồng hành cùng học viên" },
  { src: "/images/speakers/hoi truong.jpg", alt: "Hội trường sự kiện AI Agent", caption: "Hội trường — Sự kiện AI Agent thực chiến" },
  { src: "/images/speakers/tony trieu hooi truong.jpg", alt: "Tony Trieu thuyết trình tại hội trường", caption: "Tony Trieu chia sẻ kinh nghiệm KDP & AI Agent" },
  { src: "/images/speakers/Thang Tim Cach.jpg", alt: "Thầy Trương Cảnh Thắng — AI Affiliate Marketing", caption: "Thầy Trương Cảnh Thắng — Chuyên gia AI Affiliate Marketing" },
  { src: "/images/speakers/Thang 1.jpg", alt: "Thầy Trương Cảnh Thắng tại sự kiện AI Content", caption: "Thầy Trương Cảnh Thắng — Sự kiện AI Content thực chiến" },
  { src: "/images/speakers/thang 2.jpg", alt: "Thầy Trương Cảnh Thắng chia sẻ tại workshop", caption: "Thầy Trương Cảnh Thắng — Workshop AI hệ thống nội dung" },
  { src: "/images/speakers/thang 4.jpg", alt: "Thầy Trương Cảnh Thắng đào tạo học viên", caption: "Thầy Trương Cảnh Thắng — Đào tạo học viên AI Marketing" },
];

const coloringBookImages: GalleryImage[] = [
  { src: "/images/coloring-book/book-1.jpg", alt: "Adorable Owls Coloring Book — tạo bởi AI Agent", caption: "Adorable Owls — Bold and Easy Coloring Book" },
  { src: "/images/coloring-book/cover1.png", alt: "4th of July Coloring Book — bán trên Amazon KDP", caption: "4th of July — Kids Coloring Book (Ages 3-7)" },
];

function Lightbox({ image, onClose }: { image: GalleryImage; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
        onClick={onClose}
        aria-label="Đóng"
      >
        <span className="material-symbols-outlined text-3xl">close</span>
      </button>
      <div className="relative max-w-4xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
        <Image
          src={image.src}
          alt={image.alt}
          width={1200}
          height={800}
          className="w-full h-full object-contain rounded-xl"
        />
        {image.caption && (
          <p className="text-center text-white/80 text-sm mt-3">{image.caption}</p>
        )}
      </div>
    </div>
  );
}

export default function Gallery() {
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const [venueExpanded, setVenueExpanded] = useState(false);
  const VENUE_INITIAL = 12;
  const visibleVenue = venueExpanded ? campVenueImages : campVenueImages.slice(0, VENUE_INITIAL);

  return (
    <section className="py-10 sm:py-24 px-4 sm:px-6 bg-surface" id="gallery">
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-24">

        {/* Venue Section — Camp Ba Vì */}
        <div>
          <ScrollReveal>
            <div className="text-center mb-5 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
                <span className="material-symbols-outlined text-base sm:text-lg">location_on</span>
                ĐỊA ĐIỂM TỔ CHỨC
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
                Camp Ba Vì —{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                  Không Gian Thực Tế
                </span>
              </h2>
              <p className="text-sm sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
                Khu nghỉ dưỡng riêng tư giữa núi rừng Ba Vì — không gian làm việc, ăn uống, networking và nghỉ ngơi trong 3 ngày 2 đêm
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
            {visibleVenue.map((img, index) => (
              <ScrollReveal key={img.src} delay={Math.min(index, 8) * 60} direction={index % 2 === 0 ? "left" : "right"}>
                <button
                  className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden border border-primary/15 hover:border-primary/40 transition-all duration-300 group cursor-pointer shadow-[0_0_15px_rgba(0,0,0,0.25)] hover:shadow-[0_0_25px_rgba(245,158,11,0.18)]"
                  onClick={() => setLightbox(img)}
                  aria-label={img.alt}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-2">
                    <span className="material-symbols-outlined text-white text-base sm:text-lg">zoom_in</span>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>

          {campVenueImages.length > VENUE_INITIAL && (
            <div className="mt-6 sm:mt-8 text-center">
              <button
                onClick={() => setVenueExpanded((v) => !v)}
                className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 hover:border-primary/60 text-primary font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300"
              >
                <span className="material-symbols-outlined text-lg">
                  {venueExpanded ? "expand_less" : "expand_more"}
                </span>
                {venueExpanded
                  ? "Thu gọn"
                  : `Xem thêm ${campVenueImages.length - VENUE_INITIAL} ảnh`}
              </button>
            </div>
          )}
        </div>

        {/* Speakers Section */}
        <div>
          <ScrollReveal>
            <div className="text-center mb-5 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-4 sm:mb-6">
                <span className="material-symbols-outlined text-base sm:text-lg">photo_camera</span>
                HÌNH ẢNH THỰC TẾ
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
                Speakers Tại Các{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                  Sự Kiện
                </span>
              </h2>
              <p className="text-sm sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
                Hoàng Trần & Tony Trieu thuyết trình trực tiếp về AI Agent & OpenClaw
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {speakerImages.map((img, index) => (
              <ScrollReveal key={img.src} delay={Math.min(index, 6) * 120} direction={index % 2 === 0 ? "left" : "right"}>
                <button
                  className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden border border-primary/15 hover:border-primary/40 transition-all duration-300 group cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                  onClick={() => setLightbox(img)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 50vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 sm:p-4">
                    <div className="flex items-center gap-2 text-white">
                      <span className="material-symbols-outlined text-sm sm:text-lg">zoom_in</span>
                      <span className="text-[10px] sm:text-sm font-medium line-clamp-1">{img.caption}</span>
                    </div>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Coloring Book Section */}
        <div>
          <ScrollReveal>
            <div className="text-center mb-5 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-on-surface tracking-tighter mb-3 sm:mb-4">
                Sản Phẩm{" "}
                <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-container to-secondary animate-gradient">
                  Coloring Book
                </span>{" "}
                Thực Tế
              </h2>
              <p className="text-sm sm:text-lg text-on-surface-variant max-w-2xl mx-auto">
                Được tạo hoàn toàn bằng AI Agent — đang bán trên Amazon KDP
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {coloringBookImages.map((img, index) => (
              <ScrollReveal key={img.src} delay={index * 150} direction={index === 0 ? "left" : "right"}>
                <button
                  className="relative w-full aspect-[2/1] rounded-xl sm:rounded-2xl overflow-hidden border border-primary/15 hover:border-primary/40 transition-all duration-300 group cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                  onClick={() => setLightbox(img)}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-white">
                      <span className="material-symbols-outlined text-lg">zoom_in</span>
                      <span className="text-xs sm:text-sm font-medium">{img.caption}</span>
                    </div>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>

      </div>

      {lightbox && <Lightbox image={lightbox} onClose={() => setLightbox(null)} />}
    </section>
  );
}
