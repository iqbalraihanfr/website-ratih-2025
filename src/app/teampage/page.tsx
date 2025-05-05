import React from "react";
import Image from "next/image";

const teamMembers = [
  { name: "V. Nathanael", role: "VIDEOGRAPHER" },
  { name: "Andra Ariloka", role: "CONTENT WRITER" },
  { name: "Favian Rifqi", role: "PHOTOGRAPHER" },
  { name: "Iqbal Raihan F.R.", role: "WEB DEVELOPER" },
  { name: "Afrizal Ahmad", role: "GRAPHIC DESIGNER" },
  { name: "Jiersa Hilal", role: "VIDEO EDITOR" },
  { name: "M. Afif Satrio W.", role: "WEB DEVELOPER" },
];

const positions = [
  // Atur posisi manual agar bertingkat seperti di Figma
  "left-[10%] top-[10%] z-20", // V. Nathanael
  "left-[40%] top-[5%] z-30", // Andra Ariloka
  "left-[70%] top-[12%] z-20", // Favian Rifqi
  "left-[80%] top-[35%] z-10", // Iqbal Raihan
  "left-[20%] top-[40%] z-10", // Afrizal Ahmad
  "left-[50%] top-[45%] z-20", // Jiersa Hilal
  "left-[65%] top-[55%] z-10", // M. Afif Satrio
];

const TeamPage = () => {
  return (
    <>
      {/* Header & Background */}
      <section className="relative min-h-[700px] bg-ratih-dark flex flex-col justify-start items-center overflow-hidden">
        {/* Background Image */}
        <Image
          src="/image/bghome.png"
          alt="Background"
          fill
          className="object-cover opacity-60"
          style={{ zIndex: 1 }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 z-10" />
        {/* Ornamen Kuning (PNG Transparan) */}
        <Image
          src="/image/Ornamen.png"
          alt="Ornamen"
          width={60}
          height={60}
          className="absolute left-[5%] top-[20%] z-20"
        />
        <Image
          src="/image/Ornamen.png"
          alt="Ornamen"
          width={60}
          height={60}
          className="absolute right-[5%] top-[30%] z-20"
        />
        <Image
          src="/image/Ornamen.png"
          alt="Ornamen"
          width={40}
          height={40}
          className="absolute left-[15%] bottom-[10%] z-20"
        />
        {/* Judul */}
        <div className="relative z-30 pt-32 pb-10 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-2 font-sans">
            <span className="text-white">OUR </span>
            <span className="text-ratih-gold italic font-playfair">TEAM</span>
          </h1>
          <p className="text-lg text-white/80 font-sans tracking-wide">
            RATIH Creative
          </p>
        </div>
        {/* Team Members Layered */}
        <div className="relative w-full h-[500px] max-w-6xl mx-auto">
          {teamMembers.map((member, idx) => (
            <div
              key={member.name}
              className={`absolute ${positions[idx]} flex flex-col items-center group`}
              style={{ width: 180 }}
            >
              <div className="rounded-xl overflow-hidden border-4 border-ratih-gold shadow-lg group-hover:scale-105 transition-transform duration-300 bg-black/60">
                <Image
                  src="/image/iqbal.png"
                  alt={member.name}
                  width={180}
                  height={220}
                  className="object-cover w-[180px] h-[220px]"
                />
              </div>
              <div className="mt-3 text-center">
                <div className="text-lg font-bold text-white drop-shadow-md leading-tight">
                  {member.name}
                </div>
                <div className="text-ratih-gold font-bold text-xs tracking-widest mt-1">
                  {member.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join Our Team Section (biarkan tetap modern) */}
      <section className="py-16 bg-ratih-gold text-ratih-dark relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sans">
                Join Our Creative Team
              </h2>
              <p className="text-lg mb-0 font-sans">
                We&apos;re always looking for talented individuals who are
                passionate about photography, videography, and design.
              </p>
            </div>
            <div className="md:w-1/3 text-center md:text-right">
              <a
                href="/contact"
                className="inline-block bg-ratih-dark hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-lg transition-colors duration-300"
              >
                Apply Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default TeamPage;
