import fs from 'fs';
import sha1 from 'sha1';
import { MetaConfig } from '../type';

export default (config: MetaConfig) => {
  const dateTime = Date.now();

  const metadata = {
    name: `${config.namePrefix} #${config.edition}`,
    description: config.description,
    image: config.imagePath,
    dna: sha1(config.dna),
    edition: config.edition,
    date: dateTime,
    compiler: config.compiler,
    attributes: config.layers.map(layer => ({
      trait_type: layer.name,
      value: layer.elementName,
    })),
    ...config.extraData,
  }

  fs.writeFileSync(config.outPath, JSON.stringify(metadata, null, 2));

  return metadata;
}