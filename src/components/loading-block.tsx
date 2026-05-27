type LoadingBlockProps = {
  label: string;
};

export function LoadingBlock({ label }: LoadingBlockProps) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8" role="status">
      <div className="premium-card overflow-hidden rounded-[2px]">
        <div className="h-1 bg-gradient-to-r from-[#4f5d45] via-[#9b5b2e] to-[#d7b48a]" />
        <div className="grid gap-4 p-6">
          <div className="h-4 w-40 animate-pulse rounded-sm bg-[#dfddd4]" />
          <div className="h-8 w-full max-w-xl animate-pulse rounded-sm bg-[#efede6]" />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="h-28 animate-pulse rounded-sm bg-[#efede6]" />
            <div className="h-28 animate-pulse rounded-sm bg-[#efede6]" />
            <div className="h-28 animate-pulse rounded-sm bg-[#efede6]" />
          </div>
          <span className="sr-only">{label}</span>
        </div>
      </div>
    </div>
  );
}
