import { z } from "zod";

const createPostSchema = z.object({
  title: z.string({
    required_error: "Title is required",
  }),
  summary: z.string({
    required_error: "Summary is required",
  }),
  content: z.string({
    required_error: "Content is required",
  }),
  cover: z.string().optional(),
  author: z.string({
    required_error: "Author is required",
  }).optional(),
  tag: z.array(
    z.string()
    ),
  file: z.unknown(),
});

export { createPostSchema };
