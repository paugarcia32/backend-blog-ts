// src/services/messageService.ts

import Message from "../models/Message";
import IMessage from "../interfaces/message.interface";

const createMessageService = async (
  author: string,
  email: string,
  message: string
): Promise<IMessage> => {
  try {
    const newMessage = new Message({
      author,
      email,
      message,
      date: new Date(),
    });

    return await newMessage.save();
  } catch (error) {
    console.error(error);
    throw new Error("Error creating message");
  }
};

const getAllMessagesService = async (): Promise<IMessage[]> => {
  try {
    const messages = await Message.find(); // Obtén todos los mensajes de la base de datos
    return messages;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching messages");
  }
};

export { createMessageService, getAllMessagesService };
