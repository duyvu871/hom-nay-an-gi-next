import { z } from "zod";

export const userSchema = z.object({
    id: z.string(),
    username: z.string(),
    password: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    address: z.string(),
    zipCode: z.string(),
    dob: z.string(),
    phone: z.string(),
    email: z.string(),
    gender: z.string(),
});

export type User = z.infer<typeof userSchema>;