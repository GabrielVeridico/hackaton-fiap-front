import type { Result } from '@/domain/shared/result';
import type { AuthUser, Role } from '@/domain/auth/auth-user';
import type { AuthGateway } from '../ports/auth-gateway';
import type { SessionStore } from '../ports/session-store';
import type { UsersAdminGateway } from '../ports/users-admin-gateway';
import type { CreateUserInput } from './user-types';
import { runAuthenticated } from '../auth/run-authenticated';

export interface UsersAdminDeps {
  users: UsersAdminGateway;
  auth: AuthGateway;
  store: SessionStore;
}

export function listUsers(deps: UsersAdminDeps): Promise<Result<AuthUser[]>> {
  return runAuthenticated(deps.store, deps.auth, (t) => deps.users.list(t));
}

export function createUser(deps: UsersAdminDeps, input: CreateUserInput): Promise<Result<void>> {
  return runAuthenticated(deps.store, deps.auth, (t) => deps.users.create(input, t));
}

export function updateUserName(deps: UsersAdminDeps, id: string, name: string): Promise<Result<void>> {
  return runAuthenticated(deps.store, deps.auth, (t) => deps.users.updateName(id, name, t));
}

export function changeUserRole(deps: UsersAdminDeps, id: string, role: Role): Promise<Result<void>> {
  return runAuthenticated(deps.store, deps.auth, (t) => deps.users.changeRole(id, role, t));
}

export function deactivateUser(deps: UsersAdminDeps, id: string): Promise<Result<void>> {
  return runAuthenticated(deps.store, deps.auth, (t) => deps.users.deactivate(id, t));
}

export function reactivateUser(deps: UsersAdminDeps, id: string): Promise<Result<void>> {
  return runAuthenticated(deps.store, deps.auth, (t) => deps.users.reactivate(id, t));
}
