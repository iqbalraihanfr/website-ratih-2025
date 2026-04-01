import { ArrowRight } from "lucide-react"
import Image from "next/image"
import { storageUrl } from "@/lib/storage"
import { listServices } from "@/features/cms/services/queries"

const JasaRatih = async () => {
  const services = await listServices()

  if (!services.length) return null

  return (
    <div className="container mx-auto py-10 px-10 lg:px-20">
      <h2 className="text-4xl font-bold uppercase italic">
        Apa Yang Kami Lakukan?
      </h2>
      {services.map((item, index) => (
        <div className={`flex flex-col gap-10 mt-10 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`} key={item.id}>
          <div className="title flex flex-col mb-3">
            <p className="font-bold opacity-30">{String(index + 1).padStart(2, "0")}</p>
            <h3 className="font-bold text-4xl uppercase italic">{item.title}</h3>
            <p className="opacity-70 text-base">{item.description}</p>
            <a className="bg-white text-black w-fit px-6 py-2.5 rounded-md mt-6 transition-all cursor-pointer hover:bg-zinc-900 hover:text-white/30 font-bold italic uppercase flex flex-row items-center gap-2" href="/portfolio">
              Lihat Lebih Lanjut <ArrowRight />
            </a>
          </div>
          {item.image_path && (
            <Image
              src={storageUrl(item.image_path)}
              alt={item.title}
              width={480}
              height={600}
              className="rounded-md"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

export default JasaRatih
