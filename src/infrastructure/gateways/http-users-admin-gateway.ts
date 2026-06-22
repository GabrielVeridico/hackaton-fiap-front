import 'server-only';
import { Result } from '@/domain/shared/result';
import type { AuthUser, Role } from '@/domain/auth/auth-user';
import type { UsersAdminGateway } from '@/application/ports/users-admin-gateway';
import type { CreateUserInput } from '@/application/users/user-types';
import type { UserResponseDto } from '@/application/auth/auth-dto';
import { mapUserResponse, personTypeToCode } from '@/application/auth/auth-mapper';
import { userRoleToCode } from '@/application/users/user-role-code';
import { callUpstream } from '../http/upstream-client';
import type { AppConfig } from '../config/env';

export class HttpUsersAdminGateway implements UsersAdminGateway {
  constructor(
    private readonly config: AppConfig,
    private readonly fetchImpl?: typeof fetch,
  ) {}

  private deps() {
    return { config: this.config, fetchImpl: this.fetchImpl };
  }

  async list(accessToken: string): Promise<Result<AuthUser[]>> {
    const r = await callUpstream<UserResponseDto[]>(
      { group: 'users', path: '/api/users', bearer: accessToken },
      this.deps(),
    );
    return r.ok ? Result.ok(r.value.map(mapUserResponse)) : Result.fail<AuthUser[]>(r.error);
  }

  async getById(id: string, accessToken: string): Promise<Result<AuthUser>> {
    const r = await callUpstream<UserResponseDto>(
      { group: 'users', path: `/api/users/${id}`, bearer: accessToken },
      this.deps(),
    );
    return r.ok ? Result.ok(mapUserResponse(r.value)) : Result.fail<AuthUser>(r.error);
  }

  async create(input: CreateUserInput, accessToken: string): Promise<Result<void>> {
    const r = await callUpstream<UserResponseDto>(
      {
        group: 'users',
        path: '/api/users',
        method: 'POST',
        body: {
          PersonType: personTypeToCode(input.personType),
          Document: input.document,
          Name: input.name,
          Email: input.email,
          Password: input.password,
          Role: userRoleToCode(input.role),
        },
        bearer: accessToken,
      },
      this.deps(),
    );
    return r.ok ? Result.ok(undefined) : Result.fail<void>(r.error);
  }

  async updateName(id: string, name: string, accessToken: string): Promise<Result<void>> {
    const r = await callUpstream<UserResponseDto>(
      { group: 'users', path: `/api/users/${id}`, method: 'PUT', body: { Name: name }, bearer: accessToken },
      this.deps(),
    );
    return r.ok ? Result.ok(undefined) : Result.fail<void>(r.error);
  }

  changeRole(id: string, role: Role, accessToken: string): Promise<Result<void>> {
    return callUpstream<void>(
      { group: 'users', path: `/api/users/${id}/role`, method: 'PATCH', body: { Role: userRoleToCode(role) }, bearer: accessToken },
      this.deps(),
    );
  }

  deactivate(id: string, accessToken: string): Promise<Result<void>> {
    return callUpstream<void>(
      { group: 'users', path: `/api/users/${id}/deactivate`, method: 'PATCH', bearer: accessToken },
      this.deps(),
    );
  }

  reactivate(id: string, accessToken: string): Promise<Result<void>> {
    return callUpstream<void>(
      { group: 'users', path: `/api/users/${id}/reactivate`, method: 'PATCH', bearer: accessToken },
      this.deps(),
    );
  }
}
