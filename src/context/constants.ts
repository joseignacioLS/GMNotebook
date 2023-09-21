export interface itemI {
  title: string;
  text: string;
  key: string;
  display: string;
}

export interface textPieceI {
  content: string;
  type: string;
}

export interface referenceI extends textPieceI {
  key: string;
  visible: boolean;
  color: string;
  id: string;
}

export interface dataI {
  [key: string]: itemI;
}

export interface tipI {
  tip: string;
  className: string;
}

export const tutorial: dataI = {
  RootPage: {
    title: "Main page",
    key: "RootPage",
    display: "",
    text: "Welcome to the Game Master Notebook companion!\n\nThis is the starting page of your notebook, use it as base for the rest of your notes.\n\nThis is a note:note. Notes appear in the right column and show you some information about themselfs.\n\nYou can note:modPage of any page by enabling edit-mode. Just click on the top-right pencil icon!\n\nIn order to note:createNote, just write note:<keyword>, and the note will appear to the right. Visit the note to modify the display name.\n\nUse the note:rightBottomButtons to upload (top), download (middle) or reset (bottom) your current notebook.\n\nWhat note:moreFunctionalities can I do?\n- Add images",
  },
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
    text: "Title: The title of the page.\n\nDisplay: The text that is shown when included in the content of another note.\n\nBody: The content of the note.",
    display: "page attributes",
    key: "pageAttr",
  },
  rightBottomButtons: {
    title: "Action buttons",
    text: "On the bottom-right corner you can find and upload, download and reset button (from top to bottom).\nDownload your current notebook to save progress and upload it later.\nIf you feel lost, just click the reset button to come back here to this tutorial, but keep in mind that you will erase the current notebook!",
    display: "actions",
    key: "rightBottomButtons",
  },
  createNote: {
    title: "Create a note",
    text: "Just write note:<keyword> to generate a new note, that will appear in the right column. < and > symbols are not necessary, just write note: and the keyword you want to use for that note. If that note already exists, it will link to the existent note.",
    display: "create a note",
    key: "createNote",
  },
  moreFunctionalities: {
    title: "More Functionalities",
    text: "Add images\nUse the img: keyword and an url to add and image, just like this:\nimg:https://media.istockphoto.com/id/1481658464/es/foto/imagen-en-primer-plano-de-un-d-20-rojo-sobre-una-superficie-reflectante.jpg?s=2048x2048&w=is&k=20&c=vgROQZvl27LGh9K0mIYJ9sPGbq33SnXYEzbXRDSxEv8=",
    display: "else",
    key: "moreFunctionalities",
  },
};
