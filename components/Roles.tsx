"use client";

import { 
  Mic, Headphones, Trophy, Globe2, Crown, CheckCircle2, 
} from "lucide-react";

const userPerks = [
  { icon: Mic, title: "Record on your terms", desc: "Pick up prompts whenever you have a quiet moment — straight from your browser, no installs." },
  { icon: Globe2, title: "Speak your language", desc: "Contribute in Yoruba, Pidgin, or English and help represent how your people actually sound." },
  { icon: Headphones, title: "Re-record anytime", desc: "Not happy with a take? Listen back and re-record instantly until it feels right." },
  { icon: Trophy, title: "Track your impact", desc: "See your personal progress, approved recordings, and contributions to each project." },
];

export const Roles = () => (
  <section id="roles" className="py-24 bg-black/2 relative px-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-10 items-center mb-14">
        <div>
          <div className="text-sm font-semibold text-[#1089a0] uppercase tracking-wider mb-3">For contributors</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#212932]">
            Built around <span className="text-gradient">your voice.</span>
          </h2>
        </div>
        <p className="text-[#212932]/60 text-lg">
          Voicer AI puts contributors first — Every screen, prompt, and workflow is designed
          to make recording feel <span className="text-[#1089a0] font-bold">effortless.</span>
        </p>
      </div>
{/* cards */}
      <div className="grid sm:grid-cols-2 gap-6 mb-16">
        {userPerks.map((p, i) => (
          <div
            key={p.title}
            className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-3xl p-7 hover:shadow-[0_0_30px_rgba(16,137,160,0.2)] transition-all duration-300 animate-fade-up"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-[#1089a0]/10 group-hover:bg-[#1089a0]/20 transition-colors" />
            <div className="relative flex gap-5">
              <div className="w-14 h-14 shrink-0 rounded-2xl bg-linear-to-br from-[#1089a0] to-[#25707d] flex items-center justify-center shadow-lg shadow-teal-500/20">
                <p.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#212932]">{p.title}</h3>
                <p className="text-sm text-[#212932]/60 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#212932]/10 border border-white/10 rounded-3xl p-7 md:p-8">
        <div className="grid md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="text-md font-bold uppercase tracking-wider text-[#1089a0]">
            Backed by a team
          </div>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Crown className="w-4 h-4 text-[#1089a0] mt-0.5 shrink-0" />
              <span className="text-[#212932]/60">
                <span className="text-[#212932] font-semibold text-lg">Admins</span> set up projects and prompts so you always know what to record.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#1089a0] mt-0.5 shrink-0" />
              <span className="text-[#212932]/60">
                <span className="text-[#212932] font-semibold text-lg">Reviewers</span> check your takes and give feedback to keep quality high.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);