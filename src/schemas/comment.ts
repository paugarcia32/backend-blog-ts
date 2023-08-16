import { z } from "zod";

const createCommentSchema = z.object({
  autor: z.string({
    required_error: "Author is required",
  }),
  contenido: z.string({
    required_error: "Content is required",
  }),
});

export { createCommentSchema };
