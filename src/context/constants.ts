
export interface itemI {
  title: string;
  text: string;
  key: string;
  display: string;
  baseEntry?: string;
}

export interface textPieceI {
  content: string;
  key?: string;
  visible?: boolean;
  color?: string;
  id?: string;
}

export const firstItem: itemI = {
  title: "Title",
  key: "RootPage",
  display: "",
  text: "",
};


export interface dataI {
  [key: string]: itemI;
}

export const tutorial: dataI = {
  RootPage: {
    title: "Main page",
    key: "RootPage",
    display: "",
    text: "Welcome to the Game Master Notebook companion!<br><br>\nThis is the starting page of your notebook, use it as base for the rest of your notes.<br><br>This is a [note], notes appear in the right column and show you some information about themselfs.<br><br>\nYou can [modPage] of any page by enabling edit-mode. Just lick on the top-right pencil icon!.<br><br>\nIn order to create a note, just wrap a word between brackets [], and the note will appear the the right.<br><br>Pages have three [pageAttr]: a title (the title of the page), display (the text that will be displayed when used as reference in another note) and body!<br><br>Use the right-bottom buttons to upload (top), download (middle) or reset (bottom) your current notebook.\n",
  },
  nota: { title: "nota", text: "", display: "nota", key: "nota" },
  note: {
    title: "I am a note!",
    text: "This is some useful information about me, if you click on my book icon you will visit my page, and will be able to modify my content.",
    display: "note",
    key: "note",
  },
  modPage: {
    title: "Modify Page Information",
    text: "Enable the edit-mode by clicking on the top-right pencil icon!",
    display: "modify page information",
    key: "modPage",
  },
  pageAttr: {
    title: "Page attributes",
    text: "Title: The title of the page.<br>\nDisplay: The text that is shown when included in the content of another note.<br>\nBody: The content of the note.",
    display: "page attributes",
    key: "pageAttr",
  },
};