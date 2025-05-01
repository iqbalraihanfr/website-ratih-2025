import React from "react";
import Image from "next/image";

const TeamPage = () => {
  const teamMembers = [
    {
      name: "Jane Doe",
      role: "Lead Photographer",
      image: "/image/TEST1.jpeg",
      bio: "Jane has over 10 years of experience capturing moments that tell powerful stories.",
    },
    {
      name: "John Smith",
      role: "Videography Director",
      image: "/image/TEST2.jpeg",
      bio: "John brings stories to life with his creative video direction and production skills.",
    },
    {
      name: "Mark Wilson",
      role: "Graphic Designer",
      image: "/image/gmbr1.png",
      bio: "Mark creates stunning visual designs that capture the essence of each brand.",
    },
    {
      name: "Sarah Johnson",
      role: "Marketing Specialist",
      image: "/image/gmbr2.png",
      bio: "Sarah ensures our creative work reaches the right audience at the right time.",
    },
    {
      name: "Alex Chen",
      role: "Creative Director",
      image: "/image/gmbr3.png",
      bio: "Alex oversees all creative projects, ensuring they meet our high standards.",
    },
    {
      name: "Lisa Brown",
      role: "Production Assistant",
      image: "/image/O2.JPG",
      bio: "Lisa keeps everything running smoothly behind the scenes.",
    },
  ];

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 bg-ratih-dark relative">
        <div className="absolute inset-0 pattern-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-sans">
              <span className="text-white">Our</span>
              <span className="text-ratih-gold italic font-playfair">
                {" "}
                Team
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-sans">
              Meet the talented individuals behind our creative projects.
            </p>
          </div>
        </div>
      </section>

      {/* Team Members Grid */}
      <section className="py-20 bg-ratih-dark relative">
        <div className="absolute inset-0 pattern-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-white font-sans">
                    {member.name}
                  </h3>
                  <p className="text-ratih-gold mb-3 font-sans">
                    {member.role}
                  </p>
                  <p className="text-gray-400 font-sans">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team Section */}
      <section className="py-16 bg-ratih-gold text-ratih-dark relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-2/3">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-sans">
                Join Our Creative Team
              </h2>
              <p className="text-lg mb-0 font-sans">
                Were always looking for talented individuals who are passionate
                about photography, videography, and design.
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
