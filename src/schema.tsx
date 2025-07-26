import { z } from "zod";

export const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    age: z.number().min(0, "Age must be positive"),
  })
  .superRefine((data, ctx) => {
    if (data.name.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Name is quite short",
        path: ["name"],
      });
    }

    if (data.age < 18) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "User is under 18",
        path: ["age"],
      });
    }
  });
