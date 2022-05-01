import { ImageLayer } from '../type';

const DNA_DELIMITER = "-";

const dnaList = new Set<string>();

// 生成DNA,通过随机的各个组件生成
export const getDna: (layer: ImageLayer[]) => string = (layers) => {
  const dna = layers
    .map((layer: ImageLayer) => `${layer.id}:${layer.elementName}`)
    .join(DNA_DELIMITER);
  dnaList.add(dna);
  return dna;
};
