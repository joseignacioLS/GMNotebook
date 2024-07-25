export interface IItem {
  title: string;
  text: string;
  key: string;
  display: string;
  showInTree: boolean;
  showInTabs: boolean;
}

export interface ITextPiece {
  content: string;
  type: string;
}

export interface IReference extends ITextPiece {
  key: string;
  visible: boolean;
  id: string;
}

export interface IData {
  [key: string]: IItem;
}

export interface ITip {
  tip: string;
  className: string;
}

export interface ILeaf {
  index: number;
  key: string;
  children: number[];
  position: number[];
}

export const initPage: IItem = { "title": "title", "key": "", "display": "display", "text": "", "showInTree": false, "showInTabs": false }

export const fallBack: IData = { "RootPage": { "title": "Loading", "key": "RootPage", "display": "", "text": "", "showInTree": false, "showInTabs": false } }

export const templates = {
  "character": "# Short Description\nSummary"
}

export const exceptionKeys: string[] = ["temporal share", "RootPage"]