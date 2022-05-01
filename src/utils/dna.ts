import { ImageLayer } from '../type';

const DNA_DELIMITER = "-";

// 生成DNA,通过各个组件的权重随机生成
export const getDna: (layer: ImageLayer[]) => string = (layers) => layers
  .map((layer: ImageLayer) => `${layer.id}:${layer.elementName}${layer.bypassDNA ? "?bypassDNA=true" : ""}`)
  .join(DNA_DELIMITER);

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
export const isDnaExit: (dans: string[], dna: string) => boolean = (dnas = [], dna = "") => {
  return dnas.filter(d => d === filterDNAOptions(dna)).length > 0;
};