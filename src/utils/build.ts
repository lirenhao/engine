import fs from 'fs';

// 设置路径
const basePath = process.cwd();
export const buildDir = `${basePath}/build`;

export default () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
  fs.mkdirSync(`${buildDir}/json`);
  fs.mkdirSync(`${buildDir}/images`);
};