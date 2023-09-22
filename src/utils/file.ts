import { dataI } from "@/context/constants";

export const saveToFile = (filename: string, content: any) => {
  const data = JSON.stringify(content, null, 4);
  let element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(data)
  );
  element.setAttribute("download", filename.replace(/ /g, "-")+".json");
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const loadFile = (inputSelector: string, callback: any) => {
  const fileInput = document.querySelector(inputSelector) as any;
  if (!fileInput) return;
  const file = fileInput.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const fileContents = e.target?.result;
    if (!fileContents) return;
    try {
      const parsed = JSON.parse(fileContents as string) as dataI;
      callback(parsed);
    } catch (err) {
      console.log(err);
    }
  };
  reader.readAsText(file);
};
