/**
 * Recreation of the landing screen's backdrop: a blurred multi-colour mesh
 * (red/orange left, magenta core, cyan/green right, blue top-right) sitting
 * over a dark ridge silhouette, fading to pure black at the bottom.
 *
 * Built from layered radial gradients instead of a bitmap so it stays sharp on
 * every viewport and costs nothing to download.
 */
export function MeshGradient() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(60% 45% at 12% 22%, #ff2d1a 0%, transparent 62%)',
            'radial-gradient(55% 40% at 30% 12%, #ff7a00 0%, transparent 60%)',
            'radial-gradient(50% 38% at 52% 28%, #ff1f6b 0%, transparent 58%)',
            'radial-gradient(58% 42% at 82% 14%, #1b3cff 0%, transparent 60%)',
            'radial-gradient(52% 40% at 92% 40%, #00d2ff 0%, transparent 58%)',
            'radial-gradient(48% 36% at 74% 46%, #00e58a 0%, transparent 56%)',
            'radial-gradient(70% 50% at 50% 34%, #ffd36b 0%, transparent 40%)',
          ].join(','),
          filter: 'blur(38px) saturate(1.15)',
          transform: 'scale(1.15)',
        }}
      />

      {/* The ridge/dune silhouette rising from the lower half. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[62%]"
        style={{
          background:
            'radial-gradient(120% 100% at 50% 100%, rgba(0,0,0,0.94) 38%, rgba(0,0,0,0.55) 58%, transparent 78%)',
        }}
      />

      {/* Bottom fade to solid black so the CTA area matches the app. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[38%]"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, #000 72%)',
        }}
      />
    </div>
  )
}
