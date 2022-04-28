import fs from 'fs';
import sha1 from 'sha1';
import { createCanvas, loadImage } from 'canvas';
import * as R from 'ramda';
import config from '../config';
import { HashLipsGiffer } from '../modules/hashLipsGiffer';
import layersSetup from './layers';
import { buildDir } from './build';
import { genDna, isDnaUnique, getDnaByLayer, filterDNAOptions } from './dna';
import { EthMetadata, SolMetadata } from '../type';
import NETWORK from '../constants/network';

// 设置canvas
const canvas = createCanvas(config.format.width, config.format.height);
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = config.format.smoothing;

let metadataList: Array<EthMetadata | SolMetadata> = [];
let attributesList = [];

const dnaList = new Set<string>();

// 生成序列
const genIndexs: (size: number, shuffle: boolean) => number[] = (size, shuffle) => {
  const indexs = R.range(1, size + 1);
  if (shuffle) {
    return R.sort(() => Math.random() - 0.5, indexs);
  }
  return indexs;
}

const loadLayerImg = async (layer) => {
  try {
    return new Promise(async (resolve) => {
      const image = await loadImage(`${layer.selectedElement.path}`);
      resolve({ layer, loadedImage: image });
    });
  } catch (error) {
    console.error("Error loading image:", error);
  }
};

const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, ${config.background.brightness})`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = config.background.static ? config.background.default : genColor();
  ctx.fillRect(0, 0, config.format.width, config.format.height);
};

const addText = (_sig, x, y, size) => {
  ctx.fillStyle = config.text.color;
  ctx.font = `${config.text.weight} ${size}pt ${config.text.family}`;
  ctx.textBaseline = config.text.baseline;
  ctx.textAlign = config.text.align;
  ctx.fillText(_sig, x, y);
};

const drawElement = (_renderObject, _index, _layersLen) => {
  // 透明度
  ctx.globalAlpha = _renderObject.layer.opacity;
  // 合成类型
  ctx.globalCompositeOperation = _renderObject.layer.blend;
  config.text.only
    ? addText(
      `${_renderObject.layer.name}${config.text.spacer}${_renderObject.layer.selectedElement.name}`,
      config.text.xGap,
      config.text.yGap * (_index + 1),
      config.text.size
    )
    : ctx.drawImage(
      _renderObject.loadedImage,
      0,
      0,
      config.format.width,
      config.format.height
    );

  addAttributes(_renderObject);
};

const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `${buildDir}/images/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

const addMetadata = (_dna, _edition) => {
  let dateTime = Date.now();
  let tempMetadata: EthMetadata | SolMetadata = {
    name: `${config.namePrefix} #${_edition}`,
    description: config.description,
    image: `${config.baseUri}/${_edition}.png`,
    dna: sha1(_dna),
    edition: _edition,
    date: dateTime,
    ...config.extraMetadata,
    attributes: attributesList,
    compiler: "HashLips Art Engine",
  };
  if (config.network == NETWORK.sol) {
    tempMetadata = {
      //Added metadata for solana
      name: tempMetadata.name,
      symbol: config.solanaMetadata.symbol,
      description: tempMetadata.description,
      //Added metadata for solana
      seller_fee_basis_points: config.solanaMetadata.seller_fee_basis_points,
      image: `${_edition}.png`,
      //Added metadata for solana
      external_url: config.solanaMetadata.external_url,
      edition: _edition,
      ...config.extraMetadata,
      attributes: tempMetadata.attributes,
      properties: {
        files: [
          {
            uri: `${_edition}.png`,
            type: "image/png",
          },
        ],
        category: "image",
        creators: config.solanaMetadata.creators,
      },
    };
  }
  metadataList.push(tempMetadata);
  attributesList = [];
};

const saveMetaDataSingleFile = (_editionCount) => {
  let metadata = metadataList.find((meta) => meta.edition == _editionCount);
  config.debugLogs ? console.log(`Writing metadata for ${_editionCount}: ${JSON.stringify(metadata)}`) : null;
  fs.writeFileSync(
    `${buildDir}/json/${_editionCount}.json`,
    JSON.stringify(metadata, null, 2)
  );
};

const addAttributes = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  attributesList.push({
    trait_type: _element.layer.name,
    value: selectedElement.name,
  });
};

const writeMetaData = (_data) => {
  fs.writeFileSync(`${buildDir}/json/_metadata.json`, _data);
};

export default async () => {
  // 设置错误的个数
  let failedCount = 0;

  config.layerConfigurations.forEach((layerConfig) => {
    // 设置随机组件
    const layers = layersSetup(layerConfig.layersOrder);

    Promise.all(genIndexs(layerConfig.growEditionSizeTo, config.shuffleLayerConfigurations)
      .map(async (index) => {
        // 生成DNA
        const newDna = genDna(layers);
        // 对比DNA
        if (isDnaUnique(dnaList, newDna)) {
          await Promise.all(getDnaByLayer(newDna, layers).map(loadLayerImg))
            .then((renderObjectArray) => {
              config.debugLogs ? console.log("Clearing canvas") : null;
              ctx.clearRect(0, 0, config.format.width, config.format.height);

              let hashLipsGiffer = null;
              if (config.gif.export) {
                hashLipsGiffer = new HashLipsGiffer(
                  canvas,
                  ctx,
                  `${buildDir}/gifs/${index}.gif`,
                  config.gif.repeat,
                  config.gif.quality,
                  config.gif.delay
                );
                hashLipsGiffer.start();
              }
              if (config.background.generate) {
                drawBackground();
              }
              renderObjectArray.forEach((renderObject, index) => {
                drawElement(
                  renderObject,
                  index,
                  layerConfig.layersOrder.length
                );
                if (config.gif.export) {
                  hashLipsGiffer.add();
                }
              });
              if (config.gif.export) {
                hashLipsGiffer.stop();
              }

              config.debugLogs ? console.log("Editions left to create: ", index) : null;
              saveImage(index);
              addMetadata(newDna, index);
              saveMetaDataSingleFile(index);
              console.log(
                `Created edition: ${index}, with DNA: ${sha1(
                  newDna
                )}`
              );
            });
          dnaList.add(filterDNAOptions(newDna));
        } else {
          console.log("DNA exists!");
          failedCount++;
          if (failedCount >= config.uniqueDnaTorrance) {
            console.log(
              `You need more layers or elements to grow your edition to ${layerConfig.growEditionSizeTo} artworks!`
            );
            process.exit();
          }
        }
      })).then(() => {
        writeMetaData(JSON.stringify(metadataList, null, 2));
      })
  })
};
