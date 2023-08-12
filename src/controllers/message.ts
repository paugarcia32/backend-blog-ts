import { Request, Response } from "express";
import {
  createMessageService,
  getAllMessagesService,
} from "../services/message";

const createMessageCtrl = async (req: Request, res: Response) => {
  try {
    const { author, email, message } = req.body; // Agregado 'email' aquí
    const newMessage = await createMessageService(author, email, message); // Agregado 'email' aquí

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

export { createMessageCtrl, getAllMessagesCtrl };
