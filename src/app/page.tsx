"use client";
import React from "react";
import Image from "next/image";
import TrueFocus from "@/components/TrueFocus/TrueFocus";
import GradientText from "@/components/GradientText/GradientText";
import { motion } from "framer-motion";
import TypewriterAnimation from "@/components/TypewriterAnimation";
import { FocusCards } from "@/components/ui/focus-cards";
import { SparklesText } from "@/components/magicui/sparkles-text";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const services = [
  {
    title: "Photography",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
    description:
      "Professional photography services for events, products, portraits, and more.",
  },
  {
    title: "Videography",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
      </svg>
    ),
    description:
      "High-quality video production for commercials, events, documentaries, and social media content.",
  },
  {
    title: "Graphic Design",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 3v18" />
        <rect width="6" height="6" x="15" y="15" rx="1" />
        <rect width="6" height="6" x="3" y="15" rx="1" />
        <rect width="6" height="6" x="3" y="3" rx="1" />
        <rect width="6" height="6" x="15" y="3" rx="1" />
      </svg>
    ),
    description:
      "Creative graphic design solutions for branding, marketing materials, social media, and more.",
  },
];

const gradientColors = ["#FFC727", "#cd9900", "#ffffff", "#cd9900", "#FFC727"];

const HomePage = () => {
  const showcaseCards = [
    {
      title: "Kirab Budaya 2024",
      src: "/image/gmbr1.png",
    },
    {
      title: "Festival Dongkrek 2024",
      src: "/image/gmbr2.png",
    },
    {
      title: "Promosi UMKM 2024",
      src: "/image/gmbr3.png",
    },
    {
      title: "Commercial Videography",
      src: "/image/TEST1.jpeg",
    },
    {
      title: "Portrait Photography",
      src: "/image/O2.JPG",
    },
    {
      title: "Documentary Film",
      src: "/image/TEST2.jpeg",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="w-full min-h-screen px-0 mx-0 relative h-[100vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/bghome.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="relative w-full flex items-center justify-center">
          <div className="w-full px-4 md:px-6 text-center">
            <div className="animate-fade-in-up relative z-20 -mt-16">
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <GradientText
                  colors={gradientColors}
                  showBorder={false}
                  className="relative z-20 font-serif italic"
                >
                  <span className="text-white font-sans not-italic relative">
                    ABOUT
                    <svg
                      viewBox="0 0 301 200"
                      fill="none"
                      className="absolute -left-2 -right-2 -top-2 bottom-0 translate-y-1"
                    >
                      <motion.path
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        transition={{
                          duration: 1.25,
                          ease: "easeInOut",
                        }}
                        d="M149.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 100.2652 180.700 99.7518C280.814 100.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
                        stroke="#FACC15"
                        strokeWidth="3"
                      />
                    </svg>
                  </span>{" "}
                  US
                </GradientText>
              </h1>
              <h1 className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
                <TypewriterAnimation
                  strings={[
                    "RATIH Creative",
                    "Photography Services",
                    "Videography Productions",
                    "Graphic Design Solutions",
                  ]}
                  className="h-10 flex items-center justify-center"
                />
              </h1>
              <div className="transform transition-transform duration-300 hover:scale-105 active:scale-95">
                <a
                  href="#about"
                  className="bg-transparent border-amber-300 border-1 hover:bg-yellow-500 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-ratih-dark relative">
        <div className="w-full px-4 md:px-40 pl-4 relative z-10">
          <div className="flex flex-col md:flex-row items-start gap-10">
            {/* Left side - Logo and Title */}
            <ScrollReveal>
              <div className="md-full animate-fade-in">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 uppercase text-white text-center">
                  <TrueFocus
                    sentence="Sekilas Tentang"
                    manualMode={false}
                    blurAmount={5}
                    borderColor="yellow"
                    animationDuration={2}
                    pauseBetweenAnimations={1.5}
                  />
                </h2>
                <div className="w-full mb-6 justify-center">
                  <Image
                    src="/image/RatihLogo.png"
                    alt="Ratih Creative Logo"
                    width={400}
                    height={400}
                    className="w-md h-auto object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Right side - Description */}
            <ScrollReveal delay={0.4}>
              <div className="animate-fade-in">
                <div className="p-6 rounded-lg shadow-lg bg-black/0 text-lg">
                  <p className="mt-4 text-gray-300 justify-center text-justify">
                    <span className=" font-bold text-ratih-gold italic">
                      RATIH Creative
                    </span>{" "}
                    Merupakan Sebuah Production House dengan tim sederhana yang
                    bergerak di bidang jasa Fotografi, Videografi dan Desain
                    Grafis. Terbentuk sejak{" "}
                    <span className="text-ratih-gold">November 2021.</span>{" "}
                    Perlu diketahui, kami ahli dan handal soal menjepret kamera,
                    disiplin, dan banyak Gerakan tambahan di dalamnya.
                  </p>
                  <p className="mt-4 text-gray-300 text-justify">
                    Berdiri dari kolaborasi kreativitas dan hobi yang sejalan,
                    membentuk suatu TIM yang tak mengenal lelah seperti filosofi
                    nama tim ini yaitu RATIH, dengan wilayah kerja yaitu
                    Surabaya, Malang dan Madiun.
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 bg-black relative">
        <div className="w-full px-4 md:px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h1 className="text-xl md:text-md flex justify-center font-bold mb-2">
                <SparklesText>Sedikit Jepretan</SparklesText>
              </h1>
              <h1 className="text-5xl md:text-xl text-ratih-gold flex justify-center font-bold mx-auto">
                <SparklesText>RATIH</SparklesText>
              </h1>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <FocusCards cards={showcaseCards} />
          </ScrollReveal>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-black relative">
        <div className="w-full px-4 md:px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Our Services
              </h2>
              <p className="text-xl text-gray-300 mx-auto">
                We provide professional services in photography, videography,
                and graphic design.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ScrollReveal key={index} delay={0.2 * (index + 1)}>
                <div className="bg-black p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="text-amber-300 mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {service.title}
                  </h3>
                  <p className="text-gray-400">{service.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-ratih-dark relative">
        <div className="w-full px-4 md:px-6 relative z-10 text-center">
          <ScrollReveal>
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Work With Us?
              </h2>
              <p className="text-xl text-gray-300 mb-8 mx-auto">
                Let collaborate on your next project and bring your creative
                vision to life.
              </p>
              <div className="transform transition-transform duration-300 hover:scale-105 active:scale-95">
                <a
                  href="/contact"
                  className="bg-ratih-gold hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition-colors duration-300"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
};

export default HomePage;
