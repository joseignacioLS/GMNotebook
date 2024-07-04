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

export interface IReference extends textPieceI {
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
    text: `Welcome to the Game Master Notebook companion!

If you are no itch.io, please switch to full-screen mode :)

This is the starting page of your notebook, use it as base for the rest of your notes.

This is a note:note. Notes appear in the right column and show you some information about themselfs. Double click on the note to visit its page and learn how to use notes!

You can modify the content of any page by enabling note:editMode. Use the toggle button on top of the right column

Change page theme, come back to this tutorial, upload/download the data or visualize a tree of all your selected entries using the note:actions menu.

# What else can I do?
- Add note:images
- Add note:titlesSubtitles`,
    showInTree: false,
  },
  note: {
    title: "I am a note!",
    text: "This is a note, to write a note you use the note keyword, then a ':' character, and finally the keyword you want to use for that note. If that note already exists, it will link to the existent note.\n\nYou can use notes to create a structure for your notebook, and to link notes to each other.\n\nSwitch to the note:editMode on the right-bottom corner to see how notes are used!",
    display: "note",
    key: "note",
    showInTree: false,
  },
  editMode: {
    title: "Edit mode",
    text: "Enable the edit-mode by clicking on the toggle button on the bottom-right cornor",
    display: "edit mode",
    key: "editMode",
    showInTree: false,
  },
  actions: {
    title: "Action Menu",
    text: `On the bottom-left corner you can find the action menu, which will expand as you hover it.
Use it to:
- Change the page them from light to dark!
- Come back to this tutorial! (note that this will erase any progress you have made, so do it wisely)
- Visualize a tree-like structure with all your data
- Download your current notebook, so you can come back to it later
- Upload your notebook, this way you can keep editing your previous progress`,
    display: "actions",
    key: "actions",
    showInTree: false,
  },
  images: {
    title: "Images",
    text: `# Add images
Use the img: keyword and an url to add and image, just like this:
img:https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png`,
    display: "images",
    key: "images",
    showInTree: false,
  },
  titlesSubtitles: {
    title: "Titles and subtitles",
    text: "# This is a title\n## This is a subtitle\n\n",
    display: "titles and subtitles",
    key: "titlesSubtitles",
    showInTree: false,
  },
};
