const WordmarkMarquee = ({ repeat = 8, speed = 80 }: { repeat?: number; speed?: number }) => {
  const items = Array.from({ length: repeat }, () => "Ratih Creative Media");
  return (
    <div
      className="relative w-full overflow-hidden border-y border-white/10 py-3"
      style={{
        maskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div
        className="inline-flex whitespace-nowrap"
        style={{ animation: `ratih-marquee ${speed}s linear infinite` }}
      >
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 px-6 text-[22px] font-bold italic uppercase tracking-[0.02em] text-white"
          >
            {t}
            <span className="inline-block size-2.5 rounded-full bg-yellow-500" />
          </span>
        ))}
      </div>
      <style>{`@keyframes ratih-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
};

export default WordmarkMarquee;
