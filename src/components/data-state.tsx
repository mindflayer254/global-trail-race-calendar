type DataErrorProps = {
  title?: string;
  message: string;
};

export function DataError({ title = "Data unavailable", message }: DataErrorProps) {
  return (
    <div className="premium-card rounded-[4px] p-6 sm:p-7">
      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#A45A2A]">{title}</p>
      <p className="mt-3 text-sm leading-6 text-[#6B675F]">{message}</p>
    </div>
  );
}
