import fs from 'fs';
import * as R from 'ramda';
import weighted from 'weighted';
import build from './utils/build';
import layersSetup from './utils/layers';
import { getDna } from './utils/dna';
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
  } as ImageLayer;
});

const dnaList: Set<String> = new Set();
const reList: Set<number> = new Set();;

const create = (config, layers) => edition => {

  const imageLayers = getImageLayers(layers);
  const dna = getDna(imageLayers);

  // 验证DNA是唯一的
  if (R.includes(dna, Array.from(dnaList))) {
    reList.add(edition);
  } else {
    dnaList.add(dna);
    // 生成图片
    imageSetup({
      outPath: `${config.buildDir}/images/${edition}.png`,
      width: config.width,
      height: config.height,
      smoothing: config.smoothing,
      background: config.background,
      layers: imageLayers,
    });
  }

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
}

export default async (config: LayerConfig) => {

  // 构建build目录
  build(config.buildDir);

  // 获取组件
  const layers = layersSetup(config.layersOrder, config.layersDir);

  let metadatas = getIndexs(config.growEditionSizeTo, false)
    .map(create(config, layers));

  while (reList.size > 0) {
    const edition = reList.values().next().value;
    reList.delete(edition);

    const metadata = create(config, layers)(edition);
    metadatas = R.update(R.findIndex(md => md.edition === edition, metadatas), metadata, metadatas);

    console.log(edition, reList, dnaList);
  }

  fs.writeFileSync(`${config.buildDir}/json/_metadata.json`, JSON.stringify(metadatas, null, 2));
};
