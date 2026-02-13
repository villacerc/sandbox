import { useEffect, useRef, useState } from "react";

type Item = {
  name: string;
  x: number;
  y: number;
};

const default_items: Item[] = [
  { name: "A", x: 50, y: 50 },
  { name: "B", x: 200, y: 50 },
  { name: "C", x: 50, y: 150 },
  { name: "D", x: 200, y: 150 },
];

export default function SmoothDragDelta() {
  const [items] = useState<Item[]>(default_items);

  // refs
  const draggedRef = useRef<HTMLDivElement | null>(null);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number | null>(null);

  // on mousedown: store starting positions
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    draggedRef.current = e.currentTarget;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    const rect = e.currentTarget.getBoundingClientRect();
    currentPos.current = { x: rect.left, y: rect.top };

    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!draggedRef.current) return;

    // direct position update (no delta), less smooth
    // relies on mouse coordinates from event
    // draggedRef.current.style.top = `${e.clientY}px`;
    // draggedRef.current.style.left = `${e.clientX}px`;

    // calculate delta for smooth movement
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };

    currentPos.current.x += deltaX;
    currentPos.current.y += deltaY;

    draggedRef.current.style.top = `${currentPos.current.y}px`;
    draggedRef.current.style.left = `${currentPos.current.x}px`;
  };

  const onMouseUp = () => {
    if (!draggedRef.current) return;

    draggedRef.current.style.boxShadow = "";
    draggedRef.current.style.cursor = "grab";

    draggedRef.current = null;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.name}
          onMouseDown={onMouseDown}
          style={{
            width: "100px",
            height: "50px",
            position: "fixed",
            left: item.x,
            top: item.y,
            padding: "5px",
            border: "1px solid black",
            cursor: "grab",
            background: "#fff",
          }}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
