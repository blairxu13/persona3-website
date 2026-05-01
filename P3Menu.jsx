import { useState, useEffect } from "react";

const ITEMS = [
  { id: "about",  label: "ABOUT ME",    href: "#about",  fontSize: 130, offsetX: 0,  offsetY: 0  },
  { id: "resume", label: "RESUME",      href: "#resume", fontSize: 108, offsetX: 38, offsetY: -8 },
  { id: "github", label: "GITHUB LINK", href: "https://github.com/judgebreaded", fontSize: 88, offsetX: 14, offsetY: -6 },
];

const CLIP_SHAPES = [
  (w, h) => `polygon(0px ${h*0.06}px, ${w - h*0.55}px 0px, ${w}px ${h*0.42}px, ${w - h*0.18}px ${h}px, 0px ${h*0.94}px)`,
  (w, h) => `polygon(${h*0.12}px 0px, ${w - h*0.3}px ${h*0.04}px, ${w}px ${h*0.5}px, ${w - h*0.08}px ${h}px, 0px ${h*0.88}px)`,
  (w, h) => `polygon(0px ${h*0.1}px, ${w - h*0.4}px 0px, ${w}px ${h*0.45}px, ${w - h*0.25}px ${h}px, ${h*0.05}px ${h*0.9}px)`,
];

export default function P3Menu() {
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowUp")   setActive(i => Math.max(0, i - 1));
      if (e.key === "ArrowDown") setActive(i => Math.min(ITEMS.length - 1, i + 1));
      if (e.key === "Enter")     window.location.href = ITEMS[active].href;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

        .p3-root {
          position: relative;
          width: 100%;
          min-height: 100svh;
          background: #04060f;
          overflow: hidden;
          display: flex;
          align-items: center;
        }
        .p3-video {
          position: absolute;
          inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.4;
          z-index: 0;
          pointer-events: none;
        }
        .p3-circle {
          position: absolute;
          right: -15vw; top: 50%;
          transform: translateY(-50%);
          width: 65vw; height: 65vw;
          max-width: 700px; max-height: 700px;
          border-radius: 50%;
          background: radial-gradient(circle, #0d2560 0%, #060d2a 60%, transparent 100%);
          z-index: 1;
          pointer-events: none;
        }
        .p3-bg-word {
          position: absolute;
          bottom: -2vw; left: -1vw;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(140px, 22vw, 300px);
          color: rgba(255,255,255,0.025);
          letter-spacing: -8px;
          pointer-events: none;
          z-index: 2;
          white-space: nowrap;
          user-select: none;
        }
        .p3-scanlines {
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            0deg, transparent, transparent 3px,
            rgba(0,0,0,0.07) 3px, rgba(0,0,0,0.07) 4px
          );
          z-index: 3;
          pointer-events: none;
        }
        .p3-mask {
          position: absolute; inset: 0;
          background: linear-gradient(to right, rgba(4,6,15,0.85) 0%, rgba(4,6,15,0.4) 50%, transparent 100%);
          z-index: 4;
          pointer-events: none;
        }
        .p3-stripe  { position:absolute; right:0; top:0; bottom:0; width:5px; background:#c4001a; z-index:10; }
        .p3-stripe2 { position:absolute; right:9px; top:0; bottom:0; width:2px; background:rgba(196,0,26,0.22); z-index:10; }

        .p3-menu {
          position: relative;
          z-index: 20;
          padding: 48px 0 48px 48px;
          display: flex;
          flex-direction: column;
        }

        .p3-row {
          position: relative;
          cursor: pointer;
          display: flex;
          align-items: center;
          line-height: 1;
          text-decoration: none;
          opacity: 0;
          transform: translateX(-36px);
          transition: opacity 0.38s ease, transform 0.38s cubic-bezier(0.22,1,0.36,1);
        }
        .p3-row.mounted {
          opacity: 1 !important;
          transform: translateX(0) !important;
        }

        .p3-highlight {
          position: absolute;
          left: -48px; top: 50%;
          transform: translateY(-50%) scaleX(0);
          transform-origin: left center;
          background: #f38493;
          z-index: -1;
          transition: transform 0.22s cubic-bezier(0.22,1,0.36,1);
          pointer-events: none;
        }
        .p3-row.active .p3-highlight {
          transform: translateY(-50%) scaleX(1);
        }

        .p3-label {
          font-family: 'Bebas Neue', sans-serif;
          display: block;
          color: #2a5ca8;
          letter-spacing: 2px;
          line-height: 0.85;
          position: relative;
          z-index: 1;
          transition: color 0.12s ease, opacity 0.12s ease;
        }
        .p3-row.active .p3-label { color: #ffffff; }
        .p3-row:hover:not(.active) .p3-label { color: #4a82c8; }

        .p3-hint {
          position: absolute;
          bottom: 24px; right: 28px;
          z-index: 20;
          display: flex; flex-direction: column;
          align-items: flex-end; gap: 5px;
          font-family: 'Bebas Neue', sans-serif;
          opacity: 0;
          transition: opacity 0.5s ease 0.9s;
        }
        .p3-hint.mounted { opacity: 1; }
        .p3-hint-row {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; letter-spacing: 2px;
          color: rgba(255,255,255,0.28);
        }
        .p3-hint-key {
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 3px;
          padding: 1px 6px; font-size: 11px;
        }
      `}</style>

      <div className="p3-root">
        <video className="p3-video" src="/bg.mp4" autoPlay loop muted playsInline />
        <div className="p3-circle" />
        <div className="p3-bg-word">SYSTEM</div>
        <div className="p3-scanlines" />
        <div className="p3-mask" />
        <div className="p3-stripe" />
        <div className="p3-stripe2" />

        <nav className="p3-menu">
          {ITEMS.map((item, i) => {
            const isActive = active === i;
            const dist = Math.abs(i - active);
            const opacity = isActive ? 1 : Math.max(0.18, 1 - dist * 0.38);
            const estW = item.label.length * item.fontSize * 0.6 + 80;
            const estH = item.fontSize * 0.94;
            const clipFn = CLIP_SHAPES[i] ?? CLIP_SHAPES[0];

            return (
              <a
                key={item.id}
                href={item.href}
                className={`p3-row ${isActive ? "active" : ""} ${mounted ? "mounted" : ""}`}
                style={{
                  marginLeft: item.offsetX,
                  marginTop: item.offsetY,
                  transitionDelay: mounted ? `${i * 80}ms` : "0ms",
                }}
                onMouseEnter={() => setActive(i)}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className="p3-highlight"
                  style={{
                    width: estW,
                    height: estH,
                    clipPath: clipFn(estW, estH),
                  }}
                />
                <span
                  className="p3-label"
                  style={{ fontSize: item.fontSize, opacity }}
                >
                  {item.label}
                </span>
              </a>
            );
          })}
        </nav>

        <div className={`p3-hint ${mounted ? "mounted" : ""}`}>
          <div className="p3-hint-row"><span className="p3-hint-key">↑↓</span><span>NAVIGATE</span></div>
          <div className="p3-hint-row"><span className="p3-hint-key">↵</span><span>CONFIRM</span></div>
        </div>
      </div>
    </>
  );
}
