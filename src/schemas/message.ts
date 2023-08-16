import { z } from "zod";

const createMessageSchema = z.object({
  author: z.string({
    required_error: "Author is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email(),
  message: z.string({
    required_error: "Message is required",
  }),
});

export { createMessageSchema };
