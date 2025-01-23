import { client } from "./client";

export const getChatsListClient = async (token, chat_id) => {
  try {
    const response = await client.get("getChatsList", {
      params: {
        chat_id: chat_id,
      },
      headers: {
        token,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al obtener listado de chats:", error);
  }
};

export const getChatMessagesClient = async (token, chat_id) => {
  try {
    const response = await client.get("getChatMessages", {
      params: {
        chat_id,
      },
      headers: {
        token,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al obtener mensajes:", error);
  }
};

export const validateChatClient = async (token, first_user_id, second_user_id) => {
  try {
    const response = await client.get("validateChat", {
      params: {
        first_user_id,
        second_user_id,
      },
      headers: {
        token,
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error al validar chat:", error);
  }
}

export const createNewMessageClient = async (token, body) => {
  return await client.post("createNewMessage", body, {
    headers: {
      token,
    },
  });
};