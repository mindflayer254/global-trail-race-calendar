type EmptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <div className="premium-card rounded-[2px] border-dashed p-8 text-center sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9b5b2e]">
        No matches
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[#191917]">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#65645d]">{message}</p>
    </div>
  );
}
