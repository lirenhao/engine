
export type Element = {
  id: number;
  filename: string;
  path: string;
  weight: number;
}

export type Layer = {
  id: number;
  elements: Element[];
  name: string;
  blend: string;
  opacity: number;
  bypassDNA: boolean;
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

export type EthMetadata = {
  name: string;
  description: string;
  image: string;
  dna: string;
  edition: string;
  date: number;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  compiler: string;
}

export type SolMetadata = {
  name: string;
  symbol: string;
  description: string;
  seller_fee_basis_points: number,
  image: string;
  external_url: string;
  edition: string;
  attributes: {
    trait_type: string;
    value: string;
  }[];
  properties: {
    files: {
      uri: string;
      type: string;
    }[];
    category: string;
    creators: {
      address: string;
      share: number;
    }[];
  };
}

export type LayerConfig = {
  growEditionSizeTo: number;
  layersOrder: {
    name: string;
  }[];
}
