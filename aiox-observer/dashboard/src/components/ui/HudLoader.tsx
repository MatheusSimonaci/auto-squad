export default function HudLoader() {
  return (
    <div className="flex items-center justify-center py-8">
      <svg
        className="w-8 h-8"
        viewBox="0 0 50 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          strokeDasharray="31.4 94.2"
          className="text-hud-cyan animate-spin"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
