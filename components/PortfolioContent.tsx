import Image from "next/image"
import { createServerClient } from "@/lib/supabase-server"
import { storageUrl } from "@/lib/storage"
import type { PortfolioItem } from "@/lib/types/database"

const PortfolioContent = async () => {
  const supabase = createServerClient()
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .order("display_order", { ascending: true })

  const items = (data as PortfolioItem[]) ?? []

  if (!items.length) return null

  return (
    <div className="container mx-auto mt-10 grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 xl:gap-4 lg:gap-8 gap-10 lg:px-20 px-10 transition-all">
      {items.map((item) => (
        <div key={item.id} className="group relative flex flex-col items-center overflow-hidden rounded-md shadow-lg cursor-pointer">
          {item.image_path && (
            <Image
              src={storageUrl(item.image_path)}
              alt={item.title}
              width={1920}
              height={1080}
              loading="lazy"
              className="rounded-md transition-opacity duration-300 group-hover:opacity-20"
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-white md:text-lg text-sm font-bold text-center uppercase italic">
              {item.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PortfolioContent
