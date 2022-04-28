import { LayerConfig } from './type';
import NETWORK from './constants/network';

const network: string = NETWORK.eth;

const metadata: {
  namePrefix: string;
  description: string;
  baseUri: string;
} = {
  namePrefix: "LrhMeta",
  description: "This is a about LRHMETA contract description",
  baseUri: "ipfs://QmbJA6z5Pv9sVrLMPvWn23cWp23edaW1F6vjambbYaqqGk",
};

const solanaMetadata: {
  symbol: string;
  seller_fee_basis_points: number;
  external_url: string;
  creators: Array<any>;
} = {
  symbol: "LM",
  seller_fee_basis_points: 1000, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: "https://gateway.pinata.cloud/ipfs/QmdudwLVUq39wD2oGYf5QfMqyNiBJjFvAPPWiase2yuFWx/index.html",
  creators: [
    {
      address: "7fXNuer5sbZtaTEPhtJ5g5gNtuyRoKkvxdjEjEnPN4mC",
      share: 100,
    },
  ],
};

const layerConfigurations: LayerConfig[] = [
  {
    growEditionSizeTo: 10000,
    layersOrder: [
      { name: "Background" },
      { name: "Eyeball" },
      { name: "Eye color" },
      { name: "Iris" },
      { name: "Shine" },
      { name: "Bottom lid" },
      { name: "Top lid" },
    ],
  },
];

const format = {
  width: 512,
  height: 512,
  smoothing: false,
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

type Text = {
  only: boolean;
  color: string;
  size: number;
  xGap: number;
  yGap: number;
  align: any,
  baseline: any,
  weight: string,
  family: string,
  spacer: string,
} 

const text: Text = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

const pixelFormat = {
  ratio: 2 / 128,
};

const background = {
  generate: true,
  brightness: "80%",
  static: false,
  default: "#000000",
};

const extraMetadata = {};

// 元素权重分隔符
const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

const preview_gif = {
  numberOfImages: 5,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

export default {
  format,
  baseUri: metadata.baseUri,
  description: metadata.description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations: false,
  debugLogs: false,
  extraMetadata,
  pixelFormat,
  text,
  namePrefix: metadata.namePrefix,
  network,
  solanaMetadata,
  gif,
  preview_gif,
};
