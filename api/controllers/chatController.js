import { Op } from "sequelize";
import admin from "../config/firebase-config.js";
import { Chat, Message, MultimediaStorage, Users } from "../models/models.js";

export const getChatsList = async (req, res) => {
  const token = req.headers.token;
  const user = await admin.auth().verifyIdToken(token);
  const { uid } = user;

  const { chat_id: clientChatId } = req.query; // Obtener el parámetro `chat_id` del cliente
  
  try {
    const findUser = await Users.findOne({ where: { uid } });
    const user = findUser.dataValues;

    // Obtener los chats del usuario
    const chats = await Chat.findAll({
      where: {
        [Op.or]: [
          { first_user_id: user.user_id },
          { second_user_id: user.user_id },
        ],
      },
      include: [
        {
          model: Message,
          required: true,
          attributes: [],
        },
      ],
    });
    
    // Si se proporciona un chat_id desde el cliente
    let newChat = null;
    if (clientChatId) {
      const existingChat = await Chat.findOne({
        where: { chat_id: clientChatId },
      });

      if (existingChat) {
        const userToChat =
          user.user_id === existingChat.first_user_id
            ? existingChat.second_user_id
            : existingChat.first_user_id;

        const userChat = await Users.findOne({
          where: { user_id: userToChat },
        });
        const multimedia = await MultimediaStorage.findOne({
          where: { user_id: userToChat },
        });

        const chatHasMessages = await Message.findAll({
          where: { chat_id: existingChat.chat_id },
        });

        if (chatHasMessages.length <= 0) {
          newChat = {
            chat_id: existingChat.chat_id,
            user_id: userChat.dataValues.user_id,
            name: userChat.dataValues.name,
            last_name: userChat.dataValues.last_name,
            profile_picture: multimedia?.dataValues.value || null,
            lastMessage: null,
            lastMessageDate: null,
          };
        }
      }
    }

    // Procesar la lista de chats existentes
    const response = await Promise.all(
      chats.map(async (chat) => {
        const userToChat =
          user.user_id === chat.first_user_id
            ? chat.second_user_id
            : chat.first_user_id;

        const userChat = await Users.findOne({
          where: { user_id: userToChat },
        });
        const multimedia = await MultimediaStorage.findOne({
          where: { user_id: userToChat },
        });
        const lastMessage = await Message.findOne({
          where: { chat_id: chat.chat_id },
          order: [["send_date", "DESC"]],
        });

        return {
          chat_id: chat.dataValues.chat_id,
          user_id: userChat.dataValues.user_id,
          name: userChat.dataValues.name,
          last_name: userChat.dataValues.last_name,
          profile_picture: multimedia?.dataValues.value || null,
          lastMessage: lastMessage?.dataValues.content,
          lastMessageDate: lastMessage?.dataValues.created_date,
        };
      })
    );

    
    // Ordenar la lista por fecha del último mensaje (nuevo chat sin mensajes permanece al principio)
    response.sort((a, b) => {
      if (!a.lastMessageDate) return -1; // Mantener nuevo chat sin mensajes primero
      if (!b.lastMessageDate) return 1;
      return new Date(b.lastMessageDate) - new Date(a.lastMessageDate);
    });
    
    // Si hay un nuevo chat, agregarlo al principio del array
    if (newChat) {
      response.unshift(newChat);
    }
    
    res.status(200).json(response);
  } catch (error) {
    console.log("error:", error);

    res.status(500).json({ message: "Error al recuperar los chats", error });
  }
};

export const validateChat = async (req, res) => {
  const { first_user_id, second_user_id } = req.query;

  try {
    const chat = await Chat.findOne({
      where: {
        [Op.or]: [
          { first_user_id, second_user_id },
          { first_user_id: second_user_id, second_user_id: first_user_id },
        ],
      },
    });

    if (chat) {
      return res.status(200).json(chat.dataValues);
    } else {
      await createNewChat({ body: { first_user_id, second_user_id } }, res);
      return; 
    }
  } catch (error) {
    console.log("Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Error al validar el chat", error });
    }
  }
};

export const getChatMessages = async (req, res) => {
  const { chat_id } = req.query;

  try {
    if (!chat_id) {
      return res.status(200).json({ message: "[]" });
    }
    const messages = await Message.findAll({
      where: { chat_id },
      order: [["send_date", "ASC"]], // Ordenar por `send_date` de forma ascendente
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log('error:', error);
    
    res.status(500).json({ message: "Error al recuperar los mensajes", error });
  }
};

export const createNewChat = async (req, res) => {
  const { first_user_id, second_user_id } = req.body;

  try {
    const chat = await Chat.create({
      first_user_id,
      second_user_id,
    });

    return res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el chat", error });
  }
};

export const createNewMessage = async (req, res) => {
  const { chat_id, user_id, content } = req.body;

  try {
    const message = await Message.create({
      chat_id,
      user_id,
      content,
      send_date: new Date(),
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el mensaje", error });
  }
};