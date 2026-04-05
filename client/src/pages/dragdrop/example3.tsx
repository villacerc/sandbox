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
  const [overlap, setOverlap] = useState<number | null>(null);

  // refs
  const isDragging = useRef<boolean>(false);
  const draggedRef = useRef<HTMLDivElement | null>(null);
  const draggedRefDefaultPos = useRef({ x: 0, y: 0 });
  const draggedRefCurrentPos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const currentMousePos = useRef({ x: 0, y: 0 });
  const rafID = useRef<number | null>(null);

  // on mousedown: store starting positions
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    draggedRef.current = e.currentTarget;
    const rect = draggedRef.current.getBoundingClientRect();

    lastMousePos.current = { x: e.clientX, y: e.clientY };

    draggedRefDefaultPos.current = { x: rect.left, y: rect.top };
    draggedRefCurrentPos.current = { x: rect.left, y: rect.top };

    draggedRef.current.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
    draggedRef.current.style.zIndex = "99";

    rafID.current = requestAnimationFrame(rafLoop);
  };

  const rafLoop = () => {
    if (!draggedRef.current) {
      rafID.current = requestAnimationFrame(rafLoop);
      return;
    }
    // calculate delta for smooth movement
    const deltaX = currentMousePos.current.x - lastMousePos.current.x;
    const deltaY = currentMousePos.current.y - lastMousePos.current.y;
    lastMousePos.current = {
      x: currentMousePos.current.x,
      y: currentMousePos.current.y,
    };

    draggedRefCurrentPos.current.x += deltaX;
    draggedRefCurrentPos.current.y += deltaY;
    draggedRef.current.style.left = `${draggedRefCurrentPos.current.x}px`;
    draggedRef.current.style.top = `${draggedRefCurrentPos.current.y}px`;

    rafID.current = requestAnimationFrame(rafLoop);
  };

  const onMouseMove = (e: MouseEvent) => {
    currentMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseUp = () => {
    if (rafID.current) cancelAnimationFrame(rafID.current);
    if (!draggedRef.current) return;
    if (!overlap) {
      draggedRef.current.style.top = `${draggedRefDefaultPos.current.y}px`;
      draggedRef.current.style.left = `${draggedRefDefaultPos.current.x}px`;
    }
    draggedRef.current.style.cursor = "grab";
    draggedRef.current.style.zIndex = "";
    draggedRef.current.style.boxShadow = "";

    draggedRef.current = null;
  };

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      if (rafID.current) cancelAnimationFrame(rafID.current);
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
