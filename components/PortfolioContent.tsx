import { portfolio } from "@/constants"
import Image from "next/legacy/image"

const PortfolioContent = () => {
  return (
    <div className="container mx-auto mt-10 grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 xl:gap-4 lg:gap-8 gap-10 lg:px-20 px-10 transition-all">
        {portfolio.map((items) => (
        <div key={items.id} className="group relative flex flex-col items-center overflow-hidden rounded-md shadow-lg cursor-pointer">
          <Image 
          src={items.imgURL} 
          alt={items.title}
          width={1920}
          height={1080}
          layout="responsive"
          loading="lazy"
          className="rounded-md transition-opacity duration-300 group-hover:opacity-20"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-white md:text-lg text-sm font-bold text-center uppercase italic">
                {items.title}
            </p>
          </div>

        </div>
        ))}
    </div>
  )
}

export default PortfolioContent