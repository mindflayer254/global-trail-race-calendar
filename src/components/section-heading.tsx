type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="fade-up max-w-3xl">
      <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9b5b2e]">
        {eyebrow}
      </p>
      <h1 className="mt-4 text-4xl font-semibold leading-[1.02] tracking-tight text-[#191917] sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-5 text-base leading-8 text-[#5f5e57] sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
