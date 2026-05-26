import type { ReactNode } from "react";

export interface PhoneFrameProps {
  children: ReactNode;
  tilt?: number;
  className?: string;
}

export function PhoneFrame({ children, tilt = 0, className = "" }: PhoneFrameProps) {
  // Fluid layout box: phones shrink the frame to fit the viewport (max 80vw),
  // tablets+ get the design width. aspect-ratio keeps the 290 x 580 shape so
  // consumers no longer need CSS `scale()` hacks that don't shrink the layout.
  return (
    <div
      className={`phone-frame relative mx-auto shrink-0 ${className}`}
      style={{
        width: "min(290px, 80vw)",
        aspectRatio: "29 / 58",
        transform: tilt ? `perspective(1200px) rotateY(${tilt}deg)` : undefined,
      }}
    >
      <div
        className="absolute inset-0 rounded-[44px] border-[3px] border-[#1a1a24] bg-[#0a0a14] shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
        style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(255,255,255,0.06)" }}
      >
        <div
          className="absolute left-1/2 top-3 h-7 w-[100px] -translate-x-1/2 rounded-full bg-[#0a0a14]"
          aria-hidden
        />
        <div className="absolute inset-[10px] overflow-hidden rounded-[36px] bg-[#f4f6ff]">{children}</div>
        <div
          className="absolute bottom-4 left-1/2 h-1 w-[120px] -translate-x-1/2 rounded-full bg-[#2a2a38]"
          aria-hidden
        />
      </div>
    </div>
  );
}
