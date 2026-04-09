import { useEffect, useRef, useState } from "react";

const dimensions = {
  width: 200,
  height: 150,
};

type Item = {
  name: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const itemOverlaps = (item1: Item, item2: Item) => {
  const x1Overlaps = item1.x1 > item2.x1 && item1.x1 < item2.x2;
  const x2Overlaps = item1.x2 > item2.x1 && item1.x2 < item2.x2;
  const x1OverlapSize = item2.x2 - item1.x1;
  const x2OverlapSize = item1.x2 - item2.x1;
  const y1Overlaps = item1.y1 > item2.y1 && item1.y1 < item2.y2;
  const y2Overlaps = item1.y2 > item2.y1 && item1.y2 < item2.y2;
  const y1OverlapSize = item2.y2 - item1.y1;
  const y2OverlapSize = item1.y2 - item2.y1;

  const xOverlaps =
    (x1Overlaps && x1OverlapSize / dimensions.width > 0.35) ||
    (x2Overlaps && x2OverlapSize / dimensions.width > 0.35);
  const yOverlaps =
    (y1Overlaps && y1OverlapSize / dimensions.height > 0.35) ||
    (y2Overlaps && y2OverlapSize / dimensions.height > 0.35);

  return xOverlaps && yOverlaps;
};

const default_items: Item[] = [
  { name: "A", x1: 0, y1: 0, x2: dimensions.width, y2: dimensions.height },
  {
    name: "B",
    x1: dimensions.width,
    y1: 0,
    x2: dimensions.width * 2,
    y2: dimensions.height,
  },
  {
    name: "C",
    x1: 0,
    y1: dimensions.height,
    x2: dimensions.width,
    y2: dimensions.height * 2,
  },
  {
    name: "D",
    x1: dimensions.width,
    y1: dimensions.height,
    x2: dimensions.width * 2,
    y2: dimensions.height * 2,
  },
];

export default function SmoothDragDelta() {
  const [items] = useState<Item[]>(default_items);
  const [overlap, setOverlap] = useState<number | null>(null);

  const draggedItem = useRef<Item | null>(null);
  const draggedRef = useRef<HTMLDivElement | null>(null);
  const draggedRefDefaultPos = useRef({ x: 0, y: 0 });
  const draggedRefCurrentPos = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const currentMousePos = useRef({ x: 0, y: 0 });
  const rafID = useRef<number | null>(null);

  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>, i: number) => {
    draggedItem.current = items[i];
    draggedRef.current = e.currentTarget;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    draggedRefDefaultPos.current = {
      x: default_items[i].x1,
      y: default_items[i].y1,
    };
    draggedRefCurrentPos.current = {
      x: draggedRefDefaultPos.current.x,
      y: draggedRefDefaultPos.current.y - 5,
    };

    draggedRef.current.style.left = `${draggedRefCurrentPos.current.x}px`;
    draggedRef.current.style.top = `${draggedRefCurrentPos.current.y}px`;
    draggedRef.current.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
    draggedRef.current.style.zIndex = "99";

    rafID.current = requestAnimationFrame(rafLoop);
  };

  const rafLoop = () => {
    if (!draggedRef.current) {
      rafID.current = requestAnimationFrame(rafLoop);
      return;
    }
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

    checkItemOverlaps();

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

    draggedItem.current = null;
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

  const checkItemOverlaps = () => {
    if (!draggedItem.current) return;
    const { x, y } = draggedRefCurrentPos.current;
    const item: Item = {
      name: draggedItem.current.name,
      x1: x,
      y1: y,
      x2: x + dimensions.width,
      y2: y + dimensions.height,
    };
    for (const e of default_items) {
      if (e.name === item.name) continue;
      if (itemOverlaps(item, e)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div
      style={{
        position: "relative",
        width: "400px",
        height: "300px",
        border: "1px solid #ccc",
        display: "grid",
      }}
    >
      {items.map((item, i) => (
        <div
          key={item.name}
          onMouseDown={(e) => onMouseDown(e, i)}
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            position: "absolute",
            left: item.x1,
            top: item.y1,
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
