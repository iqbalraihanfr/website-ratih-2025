import PortfolioContent from "@/components/PortfolioContent"
import PortfolioHead from "@/components/PortfolioHead"

type PortfolioPageProps = {
  searchParams?: Promise<{
    category?: string;
    page?: string;
  }>;
};

export const revalidate = 0;

const page = async ({ searchParams }: PortfolioPageProps) => {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="portfolio mx-auto bg-zinc-950 pb-5">
      <PortfolioHead />
      <PortfolioContent searchParams={resolvedSearchParams} />
    </div>
  )
}

export default page
