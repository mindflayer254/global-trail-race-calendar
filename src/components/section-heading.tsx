type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="fade-up max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#A45A2A]">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-tight text-[#20231E] sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description ? <p className="mt-5 text-base leading-8 text-[#6B675F] sm:text-lg">{description}</p> : null}
    </div>
  );
}
