import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../models/roles.model';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
