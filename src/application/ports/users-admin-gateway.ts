import type { Result } from '@/domain/shared/result';
import type { AuthUser, Role } from '@/domain/auth/auth-user';
import type { CreateUserInput } from '../users/user-types';

export interface UsersAdminGateway {
  list(accessToken: string): Promise<Result<AuthUser[]>>;
  getById(id: string, accessToken: string): Promise<Result<AuthUser>>;
  create(input: CreateUserInput, accessToken: string): Promise<Result<void>>;
  updateName(id: string, name: string, accessToken: string): Promise<Result<void>>;
  changeRole(id: string, role: Role, accessToken: string): Promise<Result<void>>;
  deactivate(id: string, accessToken: string): Promise<Result<void>>;
  reactivate(id: string, accessToken: string): Promise<Result<void>>;
}
