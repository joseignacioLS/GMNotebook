import { postRequest } from "./api";

export const loginToServer = async (
  name: string,
  password: string
): Promise<boolean> => {
  const res = await postRequest(`login`, {
    name,
    password,
  });
  return res.status === 200;
};
