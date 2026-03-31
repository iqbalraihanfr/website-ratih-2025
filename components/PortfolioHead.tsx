import { storageUrl } from "@/lib/storage";

const PortfolioHead = () => {
  return (
    <div
      className="bg-no-repeat bg-cover bg-center py-10 px-10 h-[50vh] flex flex-col items-center justify-center text-white"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), url('${storageUrl("bg/bg-4.webp")}')`,
      }}
    >
        <p className="text-sm font-medium uppercase pt-10">
            Kumpulan Portofolio
        </p>
        <h1 className="text-4xl lg:text-5xl font-bold italic">RATIH CREATIVE</h1>
    </div>
  )
}

export default PortfolioHead
