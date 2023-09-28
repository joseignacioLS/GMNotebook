export const saveToLocalStorage = (value: any, key: string = "data"): void => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const retrieveLocalStorage = (key: string = "data"): string => {
  return window.localStorage.getItem(key) || "{}";
};
