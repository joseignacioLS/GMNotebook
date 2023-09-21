export const saveToLocalStorage = (value: any, key: string = "data") => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const retrieveLocalStorage = (key: string = "data") => {
  return window.localStorage.getItem(key) || "{}";
};
