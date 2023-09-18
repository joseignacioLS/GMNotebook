
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

export const tutorial: dataI = { "RootPage": { "title": "Main page", "key": "RootPage", "display": "", "text": "Welcome to the Game Master Notebook companion!<br>\nThis is the starting page of your notebook, use it as base for the rest of your notes.<br><br>This is a note:note. Notes appear in the right column and show you some information about themselfs.<br><br>\nYou can note:modPage of any page by enabling edit-mode. Just click on the top-right pencil icon!<br><br>\nIn order to note:createNote, just write note:<keyword>, and the note will appear to the right. Visit the note to modify the display name.<br><br>\nUse the note:rightBottomButtons to upload (top), download (middle) or reset (bottom) your current notebook.\n" }, "note": { "title": "I am a note!", "text": "This is some useful information about me, if you click on my book icon you will visit my page, and will be able to modify my content.", "display": "note", "key": "note" }, "modPage": { "title": "Modify Page Information", "text": "Enable the edit-mode by clicking on the top-right pencil icon!", "display": "modify page information", "key": "modPage" }, "pageAttr": { "title": "Page attributes", "text": "Title: The title of the page.<br>\nDisplay: The text that is shown when included in the content of another note.<br>\nBody: The content of the note.", "display": "page attributes", "key": "pageAttr" }, "rightBottomButtons": { "title": "Action buttons", "text": "On the bottom-right corner you can find and upload, download and reset button (from top to bottom).<br><br>\nDownload your current notebook to save progress and upload it later.<br><br>\nIf you feel lost, just click the reset button to come back here to this tutorial, but keep in mind that you will erase the current notebook!", "display": "actions", "key": "rightBottomButtons" }, "createNote": { "title": "Create a note", "text": "Just write note:<keyword> to generate a new note, that will appear in the right column. < and > symbols are not necessary, just write note: and the keyword you want to use for that note. If that note already exists, it will link to the existent note.", "display": "create a note", "key": "createNote" } }