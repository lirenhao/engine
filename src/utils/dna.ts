import { Layer } from '../type';

const DNA_DELIMITER = "-";

// 生成DNA,通过各个组件的权重随机生成
export const genDna: (layers: Layer[]) => string = (layers) =>
  layers.map((layer: Layer) => {
    // 元素的总权重
    const totalWeight = layer.elements.reduce((totalWeight, e) => totalWeight + e.weight, 0);
    let random = Math.floor(Math.random() * totalWeight);
    return layer.elements.reduce((item, e) => {
      random -= e.weight;
      return (!item && random < 0) ? `${e.id}:${e.filename}${layer.bypassDNA ? "?bypassDNA=true" : ""}` : item;
    }, undefined);
  }).join(DNA_DELIMITER);

// 清楚字符串?标识后的字段
const removeQueryStrings = (dna) => {
  const query = /(\?.*$)/;
  return dna.replace(query, "");
};

// 清除DNA属性的值，返回属性
export const cleanDna: (str: string) => number = (str) => {
  const withoutOptions = removeQueryStrings(str);
  const dna = Number(withoutOptions.split(":").shift());
  return dna;
};

// 根据组件生成DNA
export const getDnaByLayer: (dna: string, layers: Layer[]) => any[] = (dna = "", layers = []) =>
  layers.map((layer, index) => ({
    name: layer.name,
    blend: layer.blend,
    opacity: layer.opacity,
    selectedElement: layer.elements.find(
      (e) => e.id === cleanDna(dna.split(DNA_DELIMITER)[index])
    ),
  }));

export const filterDNAOptions: (dna: string) => string = (dna) => {
  const dnaItems = dna.split(DNA_DELIMITER);
  // DNA是否有参数
  const filteredDNA = dnaItems.filter(item => {
    const query = /(\?.*$)/;
    const querystring = query.exec(item);
    if (!querystring) {
      return true;
    }
    const options = querystring[1].split("&").reduce((r, setting) => {
      const keyPairs = setting.split("=");
      return { ...r, [keyPairs[0]]: keyPairs[1] };
    }, {});
    return options["bypassDNA"];
  });

  return filteredDNA.join(DNA_DELIMITER);
};

// 验证DNA是不是唯一
export const isDnaUnique: (dans: Set<string>, dna: string) => boolean = (dnas = new Set(), dna = "") => {
  const filteredDNA = filterDNAOptions(dna);
  return !dnas.has(filteredDNA);
};