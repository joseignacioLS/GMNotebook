import { dataI } from "@/context/constants";

export const saveToFile = (filename: string, content: any): void => {
  const data = JSON.stringify(content, null, 4);
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(data)
  );
  element.setAttribute("download", filename.replace(/ /g, "-") + ".json");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const loadFile = (inputSelector: string, callback: any): void => {
  const fileInput = document.querySelector(inputSelector) as any;
  if (!fileInput) return;
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const fileContents = e.target?.result;
    if (!fileContents) return;
    try {
      const parsed = JSON.parse(fileContents as string);
      Object.keys(parsed).forEach((key: string) => {
        if (parsed[key].showInTree === undefined)
          parsed[key].showInTree = false;
      });
      callback(parsed as dataI);
    } catch (err) {
      console.log(err);
    }
  };
  reader.readAsText(file);
};

export async function getFileHandle(): Promise<FileSystemFileHandle> {
  const [fileHandle]: FileSystemFileHandle[] = await window.showOpenFilePicker({
    types: [
      {
        description: "JSON Files",
        accept: {
          "application/json": [".json"],
        },
      },
    ],
  });
  return fileHandle;
}

export async function saveToFileHandle(
  fileHandle: FileSystemFileHandle,
  content: any
): Promise<void> {
  const writable = await fileHandle?.createWritable();
  await writable?.write(JSON.stringify(content));
  await writable?.close();
}
