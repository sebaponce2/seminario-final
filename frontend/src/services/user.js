import { client } from "./client"

export const createNewUser = async (body, token) => {
    return await client.post("register", body, {
      headers: {
        token,
      }
    })
  }