export interface IItem {
  title: string;
  text: string;
  key: string;
  display: string;
  showInTree: boolean;
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

export const tutorial: IData = { "RootPage": { "title": "Main page", "key": "RootPage", "display": "", "text": "# Welcome\nThis is the GameMaster Notebook companion, a simple web app to assist game masters and world builders.\nThe tool is designed for PC, but the generated notebook can be accessed from a mobile device.\n# How does it work?\nYou just write whatever information you need to have written down, and when you feel that some key concept could be explained in more detail, but do not want your text to feel to overwhelming, drop a note:note.\n## Edit Mode\nYou can enable the note:editMode any time you want, in any page you want, and you will be able to edit the page right-away. Check the note about the note:editMode to see learn more\n## Notes\nNotes are the base concept of the app. Your notes will appear on the right column of the application if they appear on the current page. This way you can have references to other concepts without getting into detail in the text.\nNotes are shared! You can reuse any note in any other text, so you do not have to write it twice.\n## Links\nAdd references to external information using note:links\n# Styling\nIt is important to have some kind of styling when organizing information, for this we have note:specialLines\n# Graphics\nSpice up your notes with some note:visualAssets!\n# Actions\nThere are some note:actions you need to know about, that can be accessed from the bottom-left menu when you hover it.\n# Commands\nUse the !: to access some note:commands to make your life easier", "showInTree": true }, "note": { "title": "I am a note!", "text": "This is the content of a note.\nTo write a note you use the 'note' keyword, then a ':' character, and finally the keyword you want to use for that note. If that note already exists, it will link to the existent note.\nYou can use notes to create a structure for your notebook, and to link notes to each other.\nSwitch to the note:editMode on the right-bottom corner to see the sintaxis at work!\n# More about Notes\nYou can access a note by clicking on it on the text, or in its title on the right column.\nWhen editing a note you will see some fields:\n- Title: the title of the note, it will appear on top of the left column\n- Display: the text that will appear when you reference a note in the text\n- Show in tree?: a toggle, that will include the note in a tree like representation if checked", "display": "note", "key": "note", "showInTree": true }, "editMode": { "title": "Edit mode", "text": "Enable and disable the edit-mode by clicking on the toggle button on the bottom-right corner.", "display": "edit mode", "key": "editMode", "showInTree": true }, "images": { "title": "Images", "text": "# Add images\nUse the img: keyword and an url to add and image, just like this:\nimg:https://i.imgur.com/O2XxZI8.jpg\nWant to see the images with more detail?\nClick them to see an expanded version!", "display": "images", "key": "images", "showInTree": true }, "diagrams": { "title": "Diagrams", "text": "# Add diagrams to ilustrate flows\n'''graph LR; BBE --> Priest; Priest --> Kobolds; Priest --> Bandits '''\nThis is a experimental feature, so it might now work properly sometimes.", "display": "diagrams", "key": "diagrams", "showInTree": true }, "links": { "title": "Link", "text": "# Add Links to external references\nUse the link: keyword with a to-show-text and an url to add a link, just like this:\nlink:Google=https://www.google.com", "display": "links", "key": "links", "showInTree": true }, "actions": { "title": "Actions", "text": "# Share\nGenerate a url with all your info encoded. The players will be able to see (with no edition options and non-clickable spoilers) your notebook\n# App theme\nSwitch between ligth and dark theme and modify the color configuration for your notes.\n# Reset\nCome back to this tutorial anytime you want. But be careful to save your progress before!\n# Tree view\nWhen editing a note, you can toggle a \"show in tree\" property. If checked, a tree of connections will be generated in this view.\n# Save\nDownload the notebook as a json file, so you can keep your progress\n# Upload\nUpload a previously saved notebook, keep working on it. When a file is uploaded, any changes made are automatically saved, so you do not need to download the file anymore!", "display": "actions", "key": "actions", "showInTree": true }, "specialLines": { "title": "Special Lines", "text": "# Titles\n## Subtitles\n- List items\n* Spoilers\n> quotes!\nYou have to know that one special line can contain another one line this:\n# note:note\nor like this:\n> * wow!\nor even deeper\n- # > Here", "display": "special lines", "key": "specialLines", "showInTree": true }, "visualAssets": { "title": "Visual Assets", "text": "# Images\nAdd note:images from urls with the keyword img. See at work in the note\n# Diagrams\nYou can also add note:diagrams using mermaid (markdown)", "display": "visual assets", "key": "visualAssets", "showInTree": true }, "commands": { "title": "Commands", "text": "Commands are here to make some worldbuilding tasks easier. Hit space after each of the following commands to see how they work:\n- Generate a random name for a character with !:name\n- Generate a random place for a location with !:place\n- Get the today date with !:today\nIf you are not confortable with AI, do not worry, this name generation is based on markov chains, not neural networks or the like involved. Check how it works link:here=https://develop--master-naming-wizard.netlify.app/how-it-works\n", "display": "commands", "key": "commands", "showInTree": true } }