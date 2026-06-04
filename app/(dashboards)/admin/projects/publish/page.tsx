import { Check } from "lucide-react";
import { SectionHeader } from "@/components/dashboard/ui";
import { BrandCard } from "@/components/dashboard/ui";

export default function PublishProjectPage() {
  return (
    <div className="flex min-h-full flex-col gap-8">
      <SectionHeader 
        title="Publish Project" 
        subtitle="English" 
        italicSubtitle={true} 
        backHref="/admin/projects/review" 
      />

      <div className="flex flex-1 flex-col items-center justify-center mt-20">
        <div className="relative w-full max-w-lg">
          {/* Checkmark Badge */}
          <div className="absolute -top-12 left-1/2 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full bg-cta shadow-md z-10">
            <Check className="h-12 w-12 text-primary" strokeWidth={3} />
          </div>

          <BrandCard className="relative pt-24 pb-20 text-center">
            <h2 className="text-3xl font-medium text-primary-foreground">
              Project Published
            </h2>
          </BrandCard>
        </div>
      </div>
    </div>
  );
}
