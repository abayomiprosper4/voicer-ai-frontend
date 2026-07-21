import Landing from "@/components/Landing";
import { LogoLoader } from "@/components/ui/logo-loader";

export default function Home() {
  const variants = [
    "pulse-sequential", "bounce", "wave", "squeeze", "swap",
    "converge", "scale-sync", "flip", "breathe", "collide"
  ] as const;

  return (
    <div className="transition-all">
      <div className="bg-background py-16 px-4 border-b border-border">
        <h2 className="text-2xl font-bold text-center mb-8">LogoLoader Variants Preview</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
          {variants.map(v => (
            <div key={v} className="flex flex-col items-center gap-4 p-4 border border-border bg-card rounded-xl">
              <LogoLoader variant={v} className="w-12 h-12 text-[#1089a0]" />
              <span className="text-xs font-mono text-muted-foreground">{v}</span>
            </div>
          ))}
        </div>
      </div>
      <Landing />
    </div>
  );
}
