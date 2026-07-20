export function Logo({ className }: { className?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="4" cy="12" r="4" fill="currentColor" />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="19" cy="12" r="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
