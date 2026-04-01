import Link from "next/link";

interface Props {
  title: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function AdminPageHeader({ title, ctaHref, ctaLabel }: Props) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-100"
        >
          <i className="ri-add-line" />
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
