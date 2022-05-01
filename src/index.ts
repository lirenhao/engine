import main from './main';

const basePath = process.cwd();
const buildDir = `${basePath}/build/test`;
const layersDir = `${basePath}/layers/test`;

const config = {
  buildDir,
  layersDir,
  growEditionSizeTo: 10,
  layersOrder: [
    // { name: "Background" },
    // { name: "Eyeball" },
    // { name: "Eye color" },
    // { name: "Iris" },
    // { name: "Shine" },
    // { name: "Bottom lid" },
    // { name: "Top lid" },
    { name: "脸" },
    { name: "帽子" },
    { name: "眼睛" },
    { name: "嘴" },
  ],
  width: 512,
  height: 512,
  smoothing: false,
  background: {
    generate: true,
    brightness: "80%",
    static: false,
    default: "#000000",
  },
  namePrefix: "LrhMeta",
  description: "This is a about LRHMETA contract description",
  baseUri: "ipfs://QmbJA6z5Pv9sVrLMPvWn23cWp23edaW1F6vjambbYaqqGk",
  compiler: "compiler",
  extraMetadata: {
  },
}

main(config);