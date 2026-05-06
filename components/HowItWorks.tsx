"use client";

const steps = [
  { n: "01", title: "Create an account", desc: "Sign up in seconds and get instant access to your contributor workspace." },
  { n: "02", title: "View your assigned tasks", desc: "Open a project you've been assigned to and see the prompts waiting for your voice." },
  { n: "03", title: "Record and play back", desc: "Hit record, listen to your take, and re-record as many times as you need until it sounds right." },
  { n: "04", title: "Submit your recording", desc: "Send your final take to reviewers and watch your contribution count climb." },
];

export const HowItWorks = () => (
  <section id="how" className="py-24 px-6 max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="lg:sticky lg:top-32 self-start">
        <div className="text-sm font-semibold text-[#1089a0] uppercase tracking-wider mb-3">How it works</div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 text-[#212932]">
          From idea to dataset in <span className="text-gradient">four steps.</span>
        </h2>
        <p className="text-[#212932]/60 text-lg">
          A simple, repeatable workflow for collecting trustworthy voice data at any scale.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((s, i) => (
          <div
            key={s.n}
            className="bg-white/5 border border-[#25707D]/10 backdrop-blur-md rounded-2xl p-6 flex gap-5 items-start hover:translate-x-1 transition-transform animate-fade-up"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="text-3xl font-extrabold text-gradient leading-none w-14 shrink-0">{s.n}</div>
            <div>
              <h3 className="font-bold text-lg mb-1 text-[#212932]">{s.title}</h3>
              <p className="text-sm text-[#212932]/60">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);