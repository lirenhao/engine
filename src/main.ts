import fs from 'fs';
import * as R from 'ramda';
import weighted from 'weighted';
import build from './utils/build';
import layersSetup from './utils/layers';
import { getDna, isDnaExit } from './utils/dna';
import imageSetup from './utils/image';
import metadataSetup from './utils/metadata';
import { LayerConfig, Layer, ImageLayer } from './type';

// 生成序列
const getIndexs: (size: number, shuffle: boolean) => number[] = (size, shuffle) => {
  const indexs = R.range(1, size + 1);
  if (shuffle) {
    return R.sort(() => Math.random() - 0.5, indexs);
  }
  return indexs;
}

const getImageLayers: (layers: Layer[]) => ImageLayer[] = (layers) => layers.map(layer => {
  const index = weighted(layer.elements.reduce((obj, e, index) => ({ ...obj, [index]: e.weight }), {}))
  const element = layer.elements[index];
  return {
    id: element.id,
    name: layer.name,
    elementName: element.name,
    path: element.path,
    opacity: layer.opacity,
    blend: layer.blend,
    bypassDNA: layer.bypassDNA,
  } as ImageLayer;
});

export default async (config: LayerConfig) => {

  // 构建build目录
  build(config.buildDir);

  // 获取组件
  const layers = layersSetup(config.layersOrder, config.layersDir);

  // TODO 验证DNA是唯一的
  const metadatas = getIndexs(config.growEditionSizeTo, false).map(edition => {

    const imageLayers = getImageLayers(layers);
    const dna = getDna(imageLayers);

    // 生成图片
    imageSetup({
      outPath: `${config.buildDir}/images/${edition}.png`,
      width: config.width,
      height: config.height,
      smoothing: config.smoothing,
      background: config.background,
      layers: imageLayers,
    });

    // 生成元数据
    return metadataSetup({
      outPath: `${config.buildDir}/json/${edition}.json`,
      edition,
      namePrefix: config.namePrefix,
      description: config.description,
      compiler: config.compiler,
      imagePath: `${config.baseUri}/${edition}.png`,
      layers: imageLayers,
      dna,
      extraData: config.extraMetadata
    });
  });
  fs.writeFileSync(`${config.buildDir}/json/_metadata.json`, JSON.stringify(metadatas, null, 2));
};
