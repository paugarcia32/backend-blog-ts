import { Request, Response } from "express";
import {
  createMessageService,
  deleteMessageService,
  getAllMessagesService,
} from "../services/message";

const createMessageCtrl = async (req: Request, res: Response) => {
  try {
    const { author, email, message } = req.body;
    const newMessage = await createMessageService(author, email, message);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating message" });
  }
};

const getAllMessagesCtrl = async (req: Request, res: Response) => {
  try {
    const messages = await getAllMessagesService(); // Llama al servicio correspondiente
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching messages" });
  }
};

const deleteMessageCtrl = async (req: Request, res: Response) => {
  try {
    const messageId = req.params.id;
    const deletedMessage = await deleteMessageService(messageId);
    res.json({ message: "Message deleted successfully", deletedMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error deleting message" });
  }
};

export { createMessageCtrl, getAllMessagesCtrl, deleteMessageCtrl };
