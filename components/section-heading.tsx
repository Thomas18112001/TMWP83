import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  light?: boolean;
  center?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  light = false,
  center = false
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center")}>
      <p
        className={cn(
          "text-xs font-bold uppercase tracking-[0.35em]",
          light ? "text-white/55" : "text-ember"
        )}
      >
        {eyebrow}
      </p>
      <h2
        className={cn(
          "mt-4 text-3xl font-black uppercase tracking-tight sm:text-4xl",
          light ? "text-white" : "text-ink"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mt-4 text-base leading-7",
            light ? "text-white/72" : "text-ink/70"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
