import { useEffect, useRef, useState } from "react";
const RANGE = 30;
const INTERVAL = 5;

export default function Home() {
  const [currentTimeInterval, setcurrentTimeInterval] = useState<number>(0);
  const showHighlighter = useRef<boolean>(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const highlighterRef = useRef<HTMLDivElement>(null);
  const yNormalizedInterval = useRef<number>(-1);
  const mouseY = useRef<number>(0);
  const rafID = useRef<number>(null);

  useEffect(() => {
    const loop = () => {
      if (
        showHighlighter.current === false ||
        !timelineRef.current ||
        !highlighterRef.current
      ) {
        rafID.current = requestAnimationFrame(loop);
        return;
      }

      const rect = timelineRef.current.getBoundingClientRect();
      const y = Math.max(0, mouseY.current - rect.top);
      const yNormalizedRange = Math.floor((y / rect.height) * RANGE);
      const nextYNormalizedInterval =
        Math.floor(yNormalizedRange / INTERVAL) * INTERVAL;

      highlighterRef.current!.style.display = "flex";
      highlighterRef.current!.style.top = `${y}px`;
      //   const snappedY = (yNormalizedInterval / RANGE) * rect.height;
      //   const highlighterHeight = rect.height / (RANGE / INTERVAL);
      //   highlighterRef.current!.style.height = `${highlighterHeight}px`;

      if (yNormalizedInterval.current != nextYNormalizedInterval) {
        yNormalizedInterval.current = nextYNormalizedInterval;
        setcurrentTimeInterval(nextYNormalizedInterval);
      }
      rafID.current = requestAnimationFrame(loop);
    };

    rafID.current = requestAnimationFrame(loop);
    return () => {
      if (rafID.current) cancelAnimationFrame(rafID.current);
    };
  }, []);

  return (
    <div>
      <div>1:00</div>
      <div
        ref={timelineRef}
        onMouseEnter={() => (showHighlighter.current = true)}
        onMouseLeave={() => {
          highlighterRef.current!.style.display = "none";
          showHighlighter.current = false;
        }}
        onMouseMove={(e: React.MouseEvent<HTMLDivElement>) =>
          (mouseY.current = e.clientY)
        }
        style={{
          width: "200px",
          height: "200px",
          backgroundColor: "red",
          position: "relative",
        }}
      >
        <div
          ref={highlighterRef}
          style={{
            width: "100%",
            backgroundColor: "blue",
            alignItems: "center",
            position: "absolute",
            height: "2px",
            display: "none",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 0,
              transform: "translate(100%, 0)",
            }}
          >
            {`1:${String(currentTimeInterval).padStart(2, "0")}`}
          </div>
        </div>
      </div>
      <div>1:30</div>
    </div>
  );
}
