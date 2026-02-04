export function drawGrid(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "#ff0000";        // text color
  ctx.font = "20px Arial";           // font size and family
  ctx.textAlign = "center";          // horizontal alignment: start, center, end
  ctx.textBaseline = "middle";       // vertical alignment: top, middle, bottom, alphabetic

  ctx.fillText("Hello World", 100, 100); // x=100, y=100 in canvas coordinates

  const size = 50;
  const limit = 1000;

  ctx.strokeStyle = "rgb(0, 0, 0)";
  ctx.lineWidth = 1;
  ctx.setLineDash([1, 3]); 

  // draw vertical lines
  for (let x = -limit; x <= limit; x += size) {
    ctx.beginPath();
    ctx.moveTo(x, -limit);
    ctx.lineTo(x, limit);
    ctx.stroke();
  }

  // draw horizontal lines
  for (let y = -limit; y <= limit; y += size) {
    ctx.beginPath();
    ctx.moveTo(-limit, y);
    ctx.lineTo(limit, y);
    ctx.stroke();
  }
}
