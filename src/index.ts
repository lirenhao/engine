import build from './utils/build';
import main from './main';

const background = {
  generate: true,
  brightness: "80%",
  static: false,
  default: "#000000",
};

const extraMetadata = {};

const config = {
  growEditionSizeTo: 10,
  layersOrder: [
    { name: "Background" },
    { name: "Eyeball" },
    { name: "Eye color" },
    { name: "Iris" },
    { name: "Shine" },
    { name: "Bottom lid" },
    { name: "Top lid" },
  ],
  width: 512,
  height: 512,
  smoothing: false,
  background,
  namePrefix: "LrhMeta",
  description: "This is a about LRHMETA contract description",
  baseUri: "ipfs://QmbJA6z5Pv9sVrLMPvWn23cWp23edaW1F6vjambbYaqqGk",
  compiler: "compiler",
  extraMetadata,
}

build();
main(config);