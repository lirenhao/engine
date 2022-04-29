import fs from 'fs';
import { createCanvas, loadImage } from 'canvas';
import { ImageConfig } from '../type';

const genColor = (brightness: string) => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, ${brightness})`;
  return pastel;
};

export default async (config: ImageConfig) => {

  // 设置canvas
  const canvas = createCanvas(config.width, config.height);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = config.smoothing;

  // 设置背景
  if (config.background.generate) {
    ctx.fillStyle = config.background.static ? config.background.default : genColor(config.background.brightness);
    ctx.fillRect(0, 0, config.width, config.height);
  }

  await Promise.all(config.layers.map(async (layer) => {
    // 透明度
    ctx.globalAlpha = layer.opacity;
    // 合成类型
    ctx.globalCompositeOperation = layer.blend;
    const loadedImage = await loadImage(layer.path);
    ctx.drawImage(loadedImage, 0, 0, config.width, config.height);
  }));

  fs.writeFileSync(config.outPath, canvas.toBuffer("image/png"));
}
