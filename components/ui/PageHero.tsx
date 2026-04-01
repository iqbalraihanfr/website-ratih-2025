import { storageUrl } from "@/lib/storage";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  backgroundPath?: string;
}

export function PageHero({ eyebrow, title, backgroundPath }: PageHeroProps) {
  const style = backgroundPath
    ? {
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), url('${storageUrl(backgroundPath)}')`,
      }
    : undefined;

  return (
    <div
      className={`flex flex-col items-center justify-center px-10 text-white transition-all ${
        backgroundPath
          ? "h-[50vh] bg-cover bg-center bg-no-repeat py-10"
          : "pt-25"
      }`}
      style={style}
    >
      <p className="pt-10 text-sm font-medium uppercase">{eyebrow}</p>
      <h1 className="text-4xl font-bold italic lg:text-5xl">{title}</h1>
    </div>
  );
}
