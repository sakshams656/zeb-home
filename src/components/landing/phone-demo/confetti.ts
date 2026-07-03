export function spawnConfetti(wrap: HTMLElement | null) {
  if (!wrap) return;
  wrap.replaceChildren();
  const cols = ["#fff", "#a8f0c6", "#38f9d7", "rgba(255,255,255,0.7)"];
  for (let i = 0; i < 24; i++) {
    const d = document.createElement("div");
    const sz = Math.random() * 6 + 3;
    d.style.cssText = `position:absolute;width:${sz}px;height:${sz}px;background:${cols[Math.floor(Math.random() * cols.length)]};border-radius:${Math.random() > 0.5 ? "50%" : "2px"};left:${Math.random() * 100}%;top:${Math.random() * 80}%;opacity:0;animation:landing-confettiFall ${0.7 + Math.random() * 0.9}s ${Math.random() * 0.3}s ease-out forwards;`;
    wrap.appendChild(d);
  }
}
