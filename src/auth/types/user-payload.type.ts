import { User } from '@prisma/client'; // Adjust the import path if needed

export type UserPayload = {
  sub: string; // User ID
  email: string;
  role: string;
};