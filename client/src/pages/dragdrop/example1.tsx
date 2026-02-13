import { useEffect, useState } from "react";

export default function Example1() {
  const [items, setItems] = useState<string[]>(["A", "B", "C", "D"]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const dropHandler = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    console.log(draggedIndex);
    if (draggedIndex === null) return;
    e.preventDefault();

    const updated = [...items];
    const moved = updated.splice(draggedIndex, 1);
    updated.splice(index, 0, ...moved);
    setItems(updated);

    console.log(updated);
  };

  return (
    <div>
      {items.map((item, i) => {
        return (
          <div
            draggable
            onDragOver={(e) => e.preventDefault()}
            onDragStart={(e) => setDraggedIndex(i)}
            onDrop={(e) => dropHandler(e, i)}
            style={{
              padding: "5px",
              border: "1px solid black",
              marginBottom: "5px",
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
}
