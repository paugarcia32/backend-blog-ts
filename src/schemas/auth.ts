import { z } from "zod";

const registerSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, {
      message: "Password must be at least 6 characters",
    }),
});

const loginSchema = z.object({
  username: z.string({
    required_error: "Username is required",
  }),
  password: z.string({
    required_error: "Password is required",
  }),
});

export { registerSchema, loginSchema };
