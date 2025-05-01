import React from "react";
import Link from "next/link";
import Image from "next/image";

const Articles: React.FC = () => {
  const articles = [
    {
      id: 1,
      title: "The Art of Storytelling Through Photography",
      excerpt:
        "Discover how to capture compelling narratives through the lens of your camera.",
      image: "/image/TEST1.jpeg",
      date: "May 15, 2023",
      category: "Photography",
    },
    {
      id: 2,
      title: "Video Production Trends in 2023",
      excerpt:
        "Explore the latest trends and techniques in video production that are shaping the industry.",
      image: "/image/TEST2.jpeg",
      date: "June 3, 2023",
      category: "Videography",
    },
    {
      id: 3,
      title: "Effective Brand Identity Design",
      excerpt:
        "Learn the principles of creating a strong and memorable brand identity that resonates with your audience.",
      image: "/image/gmbr1.png",
      date: "July 12, 2023",
      category: "Graphic Design",
    },
    {
      id: 4,
      title: "Behind the Scenes: Event Photography",
      excerpt:
        "Take a look behind the curtain at what goes into capturing perfect moments at major events.",
      image: "/image/gmbr2.png",
      date: "August 8, 2023",
      category: "Photography",
    },
    {
      id: 5,
      title: "Color Theory in Digital Design",
      excerpt:
        "Understanding the psychological impact of color choices in your design projects.",
      image: "/image/gmbr3.png",
      date: "September 21, 2023",
      category: "Graphic Design",
    },
    {
      id: 6,
      title: "Cinematic Techniques for Corporate Videos",
      excerpt:
        "Elevate your corporate videos with these professional cinematic approaches.",
      image: "/image/O2.JPG",
      date: "October 9, 2023",
      category: "Videography",
    },
  ];

  return (
    <>
      {/* Header Section */}
      <section className="pt-32 pb-16 bg-ratih-dark relative">
        <div className="absolute inset-0 pattern-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-sans">
              <span className="text-white">Our</span>
              <span className="text-ratih-gold italic font-playfair">
                {" "}
                Articles
              </span>
            </h1>
            <p className="text-xl text-gray-300 mx-auto font-sans">
              Explore our latest insights, tips, and stories from the world of
              creative production.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid Section */}
      <section className="py-20 bg-ratih-dark relative">
        <div className="absolute inset-0 pattern-overlay"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div
                key={article.id}
                className="bg-black rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-amber-300 text-sm font-sans">
                      {article.category}
                    </span>
                    <span className="text-gray-400 text-sm font-sans">
                      {article.date}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white font-sans">
                    {article.title}
                  </h3>
                  <p className="text-gray-400 mb-4 font-sans">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/articles/${article.id}`}
                    className="text-amber-300 hover:text-yellow-500 transition-colors duration-300 font-medium font-sans"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Articles;
