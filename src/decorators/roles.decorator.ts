import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
export const IS_PUBLIC_KEY = 'isPublic'; // Metadata key
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);