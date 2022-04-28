import fs from 'fs';
import {Layer, LayerOrder } from '../type';

const basePath = process.cwd();
export const layersDir = `${basePath}/layers`;

const rarityDelimiter = "#";

const cleanName = (_str: string) => {
  let nameWithoutExtension = _str.slice(0, -4);
  var nameWithoutWeight = nameWithoutExtension.split(rarityDelimiter).shift();
  return nameWithoutWeight;
};

const getRarityWeight = (_str) => {
  let nameWithoutExtension = _str.slice(0, -4);
  var nameWithoutWeight = Number(
    nameWithoutExtension.split(rarityDelimiter).pop()
  );
  if (isNaN(nameWithoutWeight)) {
    nameWithoutWeight = 1;
  }
  return nameWithoutWeight;
};

const getElements = (path) => {
  return fs
    .readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      if (i.includes("-")) {
        throw new Error(`layer name can not contain dashes, please fix: ${i}`);
      }
      return {
        id: index,
        name: cleanName(i),
        filename: i,
        path: `${path}${i}`,
        weight: getRarityWeight(i),
      };
    });
};

export default (layerOrders: Array<LayerOrder>): Array<Layer> => layerOrders
  .map((layerOrder, index: number) => ({
    id: index,
    elements: getElements(`${layersDir}/${layerOrder.name}/`),
    name:
      layerOrder.options?.["displayName"] != undefined
        ? layerOrder.options?.["displayName"]
        : layerOrder.name,
    blend:
      layerOrder.options?.["blend"] != undefined
        ? layerOrder.options?.["blend"]
        : "source-over",
    opacity:
      layerOrder.options?.["opacity"] != undefined
        ? layerOrder.options?.["opacity"]
        : 1,
    bypassDNA:
      layerOrder.options?.["bypassDNA"] !== undefined
        ? layerOrder.options?.["bypassDNA"]
        : false,
  }));
