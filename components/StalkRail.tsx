import { socialMedia } from "@/constants";

const StalkRail = ({ label = "Temui Kami" }: { label?: string }) => (
  <div className="inline-flex items-center gap-3">
    <span className="text-[11px] font-bold italic uppercase tracking-[0.15em] text-white/65">
      {label}
    </span>
    <span className="h-px w-6 bg-white/40" />
    {socialMedia.map((m) => (
      <a
        key={m.id}
        href={m.href}
        aria-label={m.logo}
        className="inline-flex size-7 items-center justify-center text-white hover:text-yellow-500 transition-colors"
      >
        <i className={`${m.logo} text-[18px]`} />
      </a>
    ))}
  </div>
);

export default StalkRail;
