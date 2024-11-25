import { client } from "./client";

export const createNewPost = async (body, token) => {
  return await client.post("createPost", body, {
    headers: {
      token,
    },
  });
};

export const getPostsUserClient = async (token) => {
  return await client
    .get("getPostsClient", {
      headers: {
        token,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.error(error));
};

export const getPostsUserAdmin = async (token) => {
  return await client
    .get("getPostsAdmin", {
      headers: {
        token,
      },
    })
    .then((response) => response.data)
    .catch((error) => console.error(error));
};
