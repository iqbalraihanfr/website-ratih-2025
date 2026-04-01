import { storageUrl } from "@/lib/storage";

const HomeBg = () => {
  return (
    <div
      className="absolute inset-0 bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.0), rgba(0,0,0,0.9)), url('${storageUrl("bg/bg.webp")}')`,
      }}
    />
  );
};

export default HomeBg;