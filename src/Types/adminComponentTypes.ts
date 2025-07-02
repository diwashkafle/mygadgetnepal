export type SpecificationGroup = {
    title: string;
    entries: { key: string; value: string }[];
  };
  
  export type VariantGroup = {
    name: string;
    type: "price" | "color";  
    types: {
      value: string;
      price?: number;
    }[];
  };