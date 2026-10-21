export function Arrow({ className = "arrow" }: { className?: string }) {
  return (
    <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className={className}>
      <path d="M3 7h8M8 4l3 3-3 3" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
