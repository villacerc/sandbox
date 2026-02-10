import { useEffect, useRef } from "react";
import { drawGrid } from "./utils"

export default function InfiniteCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camera = useRef({ x: 0, y: 0, zoom: 1 });
  const isPanning = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current!;

    // get canvas 2D context API for drawingS
    const ctx = canvas.getContext("2d")!;

    canvas.addEventListener("wheel", e => {
      const zoomDelta: number = e.deltaY * -0.0005;
      if(camera.current.zoom + zoomDelta < 0.20 || camera.current.zoom + zoomDelta > 5) return;
      camera.current.zoom += parseFloat(zoomDelta.toFixed(2))
    })

    canvas.addEventListener("mousedown", e => {
      isPanning.current = true;
      last.current = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener("mousemove", e => {
      if (!isPanning.current) return;

      // calculate how much the mouse moved in screen space
      const dx = (e.clientX - last.current.x) 
      const dy = (e.clientY - last.current.y)

      // convert screen space movement to world space movement
      // screen = world * zoom  =>  world = screen / zoom
      const worldDX = dx / camera.current.zoom
      const worldDY = dy / camera.current.zoom

      // update camera position inversely to mouse movement
      camera.current.x -= worldDX;
      camera.current.y -= worldDY;

      last.current = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener("mouseup", () => {
      isPanning.current = false;
    });

    const resize = () => {
      // match canvas size to window size
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      // reset canvas transform before clearing since previous transforms stack
      ctx.resetTransform(); 

      // canvas does not auto-clear on every frame
      // if you redraw without clearing, you will paint over old pixels.
      ctx.clearRect(0, 0, canvas.width, canvas.height); 

      // get current camera values (world space)
      const { x, y, zoom } = camera.current;
      // convert camera to screen space
      const screenX = x * zoom;
      const screenY = y * zoom;
      // define origin point as middle of screen. Canvas size is same as window size
      const screenMiddleX = canvas.width / 2;
      const screenMiddleY = canvas.height / 2;

      // transform world to camera (screen) space for drawing
      // affin matrix: [scaleX, skewX, skewY, scaleY, translateX, translateY]
      ctx.setTransform(zoom, 0, 0, zoom, screenMiddleX - screenX, screenMiddleY - screenY);
      
      drawGrid(ctx);
      
      requestAnimationFrame(draw);
    };

    draw();
    return () => window.removeEventListener("resize", resize);
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}
