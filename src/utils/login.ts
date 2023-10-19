import { postRequest } from "./api";

export const loginToServer = async (name: string, password: string) => {
  const res = await postRequest(`login`, {
    name,
    password,
  });
  return res.status === 200;
};
