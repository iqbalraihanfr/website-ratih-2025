import PortfolioContent from "@/components/PortfolioContent"
import PortfolioHead from "@/components/PortfolioHead"

const page = () => {
  return (
    <div className="portfolio mx-auto bg-zinc-950 pb-5">
      <PortfolioHead />
      <PortfolioContent />
    </div>
  )
}

export default page