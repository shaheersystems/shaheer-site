type SectionLabelProps = {
  code: string;
  children: React.ReactNode;
};

/** Wayfinding-style section marker: a sequence code + label. */
export function SectionLabel({ code, children }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-muted-ink">
      <span className="text-brand">{code}</span>
      <span className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </div>
  );
}
