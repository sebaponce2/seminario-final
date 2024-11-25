import { client } from "./client";

export const createNewPost = async (body, token) => {
    return await client.post("createPost", body, {
      headers: {
        token,
      },
    });
  };