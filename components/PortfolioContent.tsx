import { portfolio } from "@/constants";
import Image from "next/image";

const PortfolioContent = () => {
  return (
    <section className="bg-black px-6 lg:px-20 pt-20 pb-28">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
        {portfolio.map((item, i) => {
          const wide = i % 4 === 0 || i % 4 === 3;
          return (
            <article
              key={item.id}
              className={`group relative overflow-hidden cursor-pointer ${wide ? "lg:col-span-2" : ""}`}
              style={{ aspectRatio: wide ? "16 / 9" : "4 / 5" }}
            >
              <Image
                src={item.imgURL}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-30"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent transition-colors group-hover:from-black/75">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-500">
                  {item.category} · 2025
                </p>
                <h3 className="mt-1.5 text-2xl md:text-3xl font-bold italic uppercase leading-none text-white">
                  {item.title}
                </h3>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default PortfolioContent;
