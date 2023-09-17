export const saveToLocalStorage = (value: any) => {
  window.localStorage.setItem("data", JSON.stringify(value));
};

export const retrieveLocalStorage = () => {
  return window.localStorage.getItem("data") || "{}";
};