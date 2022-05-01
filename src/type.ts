export type Element = {
  id: number;
  name: string;
  filename: string;
  path: string;
  weight: number;
}

export type Layer = {
  id: number;
  name: string;
  blend: string;
  opacity: number;
  bypassDNA: boolean;
  elements: Element[];
};

export type LayerOrder = {
  name: string;
  options?: {
    displayName?: string;
    blend?: string;
    opacity?: number;
    bypassDNA?: boolean;
  };
}

export type LayerConfig = {
  buildDir: string;
  layersDir: string;
  growEditionSizeTo: number;
  layersOrder: {
    name: string;
  }[];
  namePrefix: string;
  description: string;
  baseUri: string;
  compiler: string;
  extraMetadata: {
    [key: string]: any;
  };
  background: ImageBackground;
  width: number;
  height: number;
  smoothing: boolean;
}

export type ImageBackground = {
  generate: boolean;
  static: boolean;
  default: string;
  brightness: string;
}

export type ImageLayer = {
  id: number;
  name: string;
  elementName: string;
  path: string;
  opacity: number;
  blend: "color" | "color-burn" | "color-dodge" | "copy" | "darken" | "destination-atop" | "destination-in" | "destination-out" | "destination-over" | "difference" | "exclusion" | "hard-light" | "hue" | "lighten" | "lighter" | "luminosity" | "multiply" | "overlay" | "saturation" | "screen" | "soft-light" | "source-atop" | "source-in" | "source-out" | "source-over" | "xor";
  bypassDNA: boolean;
}

export type ImageConfig = {
  outPath: string;
  width: number;
  height: number;
  smoothing: boolean;
  background: ImageBackground;
  layers: ImageLayer[];
}

export type MetaConfig = {
  outPath: string;
  edition: number;
  namePrefix: string;
  description: string;
  compiler: string;
  imagePath: string;
  layers: ImageLayer[];
  dna: string,
  extraData: {
    [key: string]: any;
  };
}
