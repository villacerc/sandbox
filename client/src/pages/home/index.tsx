import { useRef, useState } from "react";
const RANGE = 60;
const INTERVAL = 5;

export default function Home() {
  const [currentRange, setCurrentRange] = useState<number>(0);
  const showHighlighter = useRef<boolean>(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const highlighterRef = useRef<HTMLDivElement>(null);

  const mouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    return requestAnimationFrame(() => {
      if (!timelineRef.current || !highlighterRef.current) return;
      if (!showHighlighter.current) return;

      const rect = timelineRef.current.getBoundingClientRect();

      const y = Math.max(0, e.clientY - rect.top);
      const yNormalizedRange = Math.floor((y / rect.height) * RANGE);
      const yNormalizedInterval =
        Math.floor(yNormalizedRange / INTERVAL) * INTERVAL;
      highlighterRef.current!.style.display = "flex";
      highlighterRef.current!.style.top = `${y}px`;
      //   const snappedY = (yNormalizedInterval / RANGE) * rect.height;
      //   const highlighterHeight = rect.height / (RANGE / INTERVAL);
      //   highlighterRef.current!.style.height = `${highlighterHeight}px`;

      setCurrentRange(yNormalizedInterval);
    });
  };

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
        onMouseMove={mouseMove}
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
            {`1:${String(currentRange).padStart(2, "0")}`}
          </div>
        </div>
      </div>
      <div>1:30</div>
    </div>
  );
}
