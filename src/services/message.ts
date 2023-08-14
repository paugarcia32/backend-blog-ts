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

// const getAllMessagesService = async (): Promise<IMessage[]> => {
//   try {
//     const messages = await Message.find();
//     return messages;
//   } catch (error) {
//     console.error(error);
//     throw new Error("Error fetching messages");
//   }
// };

const getAllMessagesService = async (): Promise<IMessage[]> => {
  try {
    const messages = await Message.find(); // Obtén todos los mensajes de la base de datos

    // Ordenar los mensajes de más nuevo a más antiguo basado en la propiedad 'date'
    messages.sort((a, b) => b.date.getTime() - a.date.getTime());

    return messages;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching messages");
  }
};

const deleteMessageService = async (
  messageId: string
): Promise<IMessage | null> => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    return deletedMessage;
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting message");
  }
};

export { createMessageService, getAllMessagesService, deleteMessageService };
