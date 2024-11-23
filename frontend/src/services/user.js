import { client } from "./client";

export const createNewUser = async (body, token) => {
  return await client.post("register", body, {
    headers: {
      token,
    },
  });
};

export const getUserLogin = async (uid, token) => {
  return await client
    .get("login", {
      params: {
        uid,
      },
      headers: {
        token,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.error(error));
};
