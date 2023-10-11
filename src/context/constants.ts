export interface itemI {
  title: string;
  text: string;
  key: string;
  display: string;
  showInTree: boolean;
}

export interface textPieceI {
  content: string;
  type: string;
}

export interface referenceI extends textPieceI {
  key: string;
  visible: boolean;
  id: string;
}

export interface dataI {
  [key: string]: itemI;
}

export interface tipI {
  tip: string;
  className: string;
}

export interface leafI {
  index: number;
  key: string;
  children: number[];
  position: number[];
}

export const tutorial: dataI = {
  RootPage: {
    title: "Main page",
    key: "RootPage",
    display: "",
    text: "Welcome to the Game Master Notebook companion!\n\n    If you are no itch.io, please switch to full-screen mode :)\n\n    This is the starting page of your notebook, use it as base for the rest of your notes.\n\n    This is a note:note. Notes appear in the right column and show you some information about themselfs.\n\n    You can note:modPage of any page by enabling edit-mode. Use the toggle button on top of the right column\n\n    In order to note:createNote, just write note:<keyword>, and the note will appear to the right.\n\n    Use the note:rightBottomButtons to reset (top), upload (middle) or download (bottom) your current notebook.\n\n    What else can I do?\n    - Add note:images\n    - Add note:titlesSubtitles",
    showInTree: false,
  },
  note: {
    title: "I am a note!",
    text: "This is some useful information about me, if you click on my book icon you will visit my page.",
    display: "note",
    key: "note",
    showInTree: false,
  },
  modPage: {
    title: "Modify Page Information",
    text: "Enable the edit-mode by clicking on the toggle button on top of this column",
    display: "modify page information",
    key: "modPage",
    showInTree: false,
  },
  rightBottomButtons: {
    title: "Action buttons",
    text: "On the bottom-right corner you can find and reset, upload and download button (from top to bottom).\nDownload your current notebook to save progress and upload it later.\nIf you feel lost, just click the reset button to come back here to this tutorial, but keep in mind that you will erase the current notebook!",
    display: "actions",
    key: "rightBottomButtons",
    showInTree: false,
  },
  createNote: {
    title: "Create a note",
    text: "Just write note:<keyword> to generate a new note, that will appear in the right column. < and > symbols are not necessary, just write note: and the keyword you want to use for that note. If that note already exists, it will link to the existent note.",
    display: "create a note",
    key: "createNote",
    showInTree: false,
  },
  images: {
    title: "Images",
    text: "Add images\nUse the img: keyword and an url to add and image, just like this:\nimg:https://media.istockphoto.com/id/1481658464/es/foto/imagen-en-primer-plano-de-un-d-20-rojo-sobre-una-superficie-reflectante.jpg?s=2048x2048&w=is&k=20&c=vgROQZ",
    display: "images",
    key: "images",
    showInTree: false,
  },
  titlesSubtitles: {
    title: "Titles and subtitles",
    text: "title:This is a title\nsubtitle:This is a subtitle\n\n",
    display: "titles and subtitles",
    key: "titlesSubtitles",
    showInTree: false,
  },
};
