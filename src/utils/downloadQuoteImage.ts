import type { Quote } from "@/data/quotes";

export async function downloadQuoteImage(quote: Quote): Promise<void> {
  const width = 1200;
  const height = 630;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const canvas = document.createElement("canvas");
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(dpr, dpr);

  // Background
  ctx.fillStyle = "#f5f3ee";
  ctx.fillRect(0, 0, width, height);

  // Card
  ctx.save();
  ctx.beginPath();
  const cardX = 60;
  const cardY = 60;
  const cardW = width - 120;
  const cardH = height - 120;
  const r = 24;
  ctx.moveTo(cardX + r, cardY);
  ctx.lineTo(cardX + cardW - r, cardY);
  ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + r);
  ctx.lineTo(cardX + cardW, cardY + cardH - r);
  ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - r, cardY + cardH);
  ctx.lineTo(cardX + r, cardY + cardH);
  ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - r);
  ctx.lineTo(cardX, cardY + r);
  ctx.quadraticCurveTo(cardX, cardY, cardX + r, cardY);
  ctx.closePath();
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0,0,0,0.08)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 8;
  ctx.fill();
  ctx.restore();

  // Quotation mark
  ctx.fillStyle = "rgba(0,0,0,0.06)";
  ctx.font = "500 180px serif";
  ctx.textBaseline = "top";
  ctx.fillText("\u201C", cardX + 30, cardY + 10);

  // Quote text (word wrap)
  ctx.fillStyle = "#0d0d0d";
  ctx.font = "500 34px serif";
  ctx.textBaseline = "top";

  const maxLineWidth = cardW - 100;
  const words = quote.text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const test = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = ctx.measureText(test).width;
    if (testWidth > maxLineWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = test;
    }
  }
  if (currentLine) lines.push(currentLine);

  const lineHeight = 52;
  const totalTextHeight = lines.length * lineHeight;
  const startY = cardY + (cardH - totalTextHeight - 60) / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, cardX + 50, startY + i * lineHeight);
  });

  // Author
  ctx.fillStyle = "#8b7355";
  ctx.font = "500 20px sans-serif";
  ctx.fillText(`— ${quote.author}`, cardX + 50, cardY + cardH - 50);

  // Trigger download
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.download = `quote-${quote.author.replace(/\s+/g, "-").toLowerCase()}.png`;
  link.href = dataUrl;
  link.click();
}
