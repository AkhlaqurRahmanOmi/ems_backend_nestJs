import { User } from '@prisma/client'; // Import the User type from Prisma Client

declare module '@nestjs/common' {
  export interface Request {
    user: User; // Add the `user` property to the Request object
  }
}