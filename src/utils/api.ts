export const getRequest = (url: string): any => {
  console.log({ url })
  return fetch(url)
    .then((res) => {
      if (!res.ok) throw Error;
      return res.json();
    })
    .then((data) => {
      return data.data;
    })
    .catch((err) => {
      return null;
    });
};

export const postRequest = (url: string, data: {} = {}) => {
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });
};
