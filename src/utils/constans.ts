export enum EMatchKeys {
  note = "note:",
  image = "img:",
}

export const regex: { [key: string]: RegExp } = {
  insertions: new RegExp("(note:|img:)", "g"),
  noteInsertion: new RegExp("note:[A-Záéíóúüïñ0-9]+"),
  imageInsertion: new RegExp("img:[^\n ]+"),
  title: new RegExp(/^\# /),
  subtitle: new RegExp(/^\#\# /),
  list: new RegExp(/^- /),
};

interface ISpecialLineConfig {
  regex: RegExp;
  config: {
    type: string;
    sliceCount: number;
  };
}

export const specialLinesConfig: { [key: string]: ISpecialLineConfig } = {
  title: {
    regex: regex.title,
    config: {
      type: "title",
      sliceCount: 2,
    },
  },
  subtitle: {
    regex: regex.subtitle,
    config: {
      type: "subtitle",
      sliceCount: 3,
    },
  },
  list: {
    regex: regex.list,
    config: {
      type: "list",
      sliceCount: 2,
    },
  },
};
