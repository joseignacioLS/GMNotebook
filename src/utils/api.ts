export const getRequest = (url: string): any => {
  const base_url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:4200/"
      : process.env.NEXT_PUBLIC_SERVER;

  console.log(base_url, process.env.NODE_ENV, process.env.NEXT_PUBLIC_SERVER)
  return fetch(base_url + url)
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
  const base_url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:4200/"
      : process.env.NEXT_PUBLIC_SERVER;
  return fetch(base_url + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });
};
