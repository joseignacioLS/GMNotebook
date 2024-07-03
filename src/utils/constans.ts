
export const specialMatchesRegex = new RegExp("(note:|img:)", "g");

export enum EMatchKeys {
  note = "note:",
  image = "img:"
}

export const regex: { [key: string]: RegExp } = {
  insertions: new RegExp("(note:|img:)", "g"),
  noteInsertion: new RegExp("note:[A-Záéíóúüïñ0-9]+"),
  imageInsertion: new RegExp("img:[^\n ]+"),
  title: new RegExp(/^\# /),
  subtitle: new RegExp(/^\#\# /)
}