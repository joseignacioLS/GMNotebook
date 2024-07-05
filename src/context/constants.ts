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
    text: "# Welcome\nThis is the GameMaster Notebook companion, a simple web app to assist game masters or any other world builders.\nThe tools is designed for PC, but the generated notebook can be consumed from a mobile device.\n\n# How does it work?\nYou just write whatever information you need to have written down, and when you feel that some key concept could be explained in more detail, but do not want your text to feel to overwhelming, you just drop a note:note.\n\n## Writing\nYou can enable the note:editMode any time you want, in any page you want, and you will be able to edit the page right-away. Check the note about the note:editMode to see learn more\n\n## Notes\nNotes are the base concept of the app. Your notes will appear on the right column of the application if they appear on the left one. This way you can have references to other concepts without getting into detail in the text.\nNotes are shared! You can reuse any note in any other text, so you do not have to write it twice.\n\n## Styling\nIt is important to have some kind of note:styling when organizing information, for this we have titles, subtitles and lists!\n\n## Images\nAdd note:images from urls with the keyword img. See at work in the note\n\n# Actions\nThere are some note:actions you need to know about, that can be accessed from the bottom-left menu when you hover it.",
    showInTree: true,
  },
  note: {
    title: "I am a note!",
    text: "This is the content of a note.\nTo write a note you use the 'note' keyword, then a ':' character, and finally the keyword you want to use for that note. If that note already exists, it will link to the existent note.\n\nYou can use notes to create a structure for your notebook, and to link notes to each other.\n\nSwitch to the note:editMode on the right-bottom corner to see the sintaxis at work!\n\n# More about Notes\nYou can access a note by clicking on it on the text, or in its title on the right column.\nWhen editing a note you will see some fields:\n- Title: the title of the note, it will appear on top of the left column\n- Display: the text that will appear when you reference a note in the text\n- Show in tree?: a toggle, that will include the note in a tree like representation if checked",
    display: "note",
    key: "note",
    showInTree: true,
  },
  editMode: {
    title: "Edit mode",
    text: "Enable and disable the edit-mode by clicking on the toggle button on the bottom-right corner.",
    display: "edit mode",
    key: "editMode",
    showInTree: true,
  },
  images: {
    title: "Images",
    text: "# Add images\nUse the img: keyword and an url to add and image, just like this:\nimg:https://i.imgur.com/O2XxZI8.jpg\n\nWant to see the images with more detail?\nClick them to see an expanded version!",
    display: "images",
    key: "images",
    showInTree: true,
  },
  actions: {
    title: "Actions",
    text: '# App theme\nSwitch between ligth and dark theme\n# Reset\nCome back to this tutorial anytime you want. But be careful to save your progress before!\n# Tree view\nWhen editing a note, you can toggle a "show in tree" property. If checked, a tree of connections will be generated in this view.\n# Save\nDownload the notebook as a json file, so you can keep your progress\n# Upload\nUpload a previously saved notebook, keep working on it. When a file is uploaded, any changes made are automatically saved, so you do not need to download the file anymore!',
    display: "actions",
    key: "actions",
    showInTree: true,
  },
  styling: {
    title: "Styling",
    text: "# This is a title\n## This is a subtitles\n- This is a list item\n- And this is another list item",
    display: "styling",
    key: "styling",
    showInTree: true,
  },
};
