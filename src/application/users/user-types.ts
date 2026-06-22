import type { PersonType, Role } from '@/domain/auth/auth-user';

export interface CreateUserInput {
  personType: PersonType;
  document: string;
  name: string;
  email: string;
  password: string;
  role: Role;
}
