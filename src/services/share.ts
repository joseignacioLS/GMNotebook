import { IData } from "@/context/constants";

export const createShareRequest = async (email: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}create`, {
    method: "POST",
    body: JSON.stringify({ email }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (data.status !== 200) {
    throw new Error(data.message);
  }
};

export const confirmShareRequest = async (
  email: string,
  code: string,
  data: IData
) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}confirm`, {
    method: "POST",
    body: JSON.stringify({ email, code, data }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const respData = await res.json();
  if (respData.status !== 200) {
    throw new Error(respData.message);
  }
  return respData.data;
};
