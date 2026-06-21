import 'server-only';
import { Result } from '@/domain/shared/result';
import type { AuthUser } from '@/domain/auth/auth-user';
import type { AuthGateway } from '@/application/ports/auth-gateway';
import type { AuthResponseDto, UserResponseDto } from '@/application/auth/auth-dto';
import type { AuthTokens, RegisterInput } from '@/application/auth/auth-types';
import { mapUserResponse, personTypeToCode } from '@/application/auth/auth-mapper';
import { callUpstream } from '../http/upstream-client';
import type { AppConfig } from '../config/env';

function toTokens(dto: AuthResponseDto): AuthTokens {
  return { accessToken: dto.AccessToken, refreshToken: dto.RefreshToken, expiresIn: dto.ExpiresIn };
}

export class HttpAuthGateway implements AuthGateway {
  constructor(
    private readonly config: AppConfig,
    private readonly fetchImpl?: typeof fetch,
  ) {}

  private deps() {
    return { config: this.config, fetchImpl: this.fetchImpl };
  }

  async register(input: RegisterInput): Promise<Result<void>> {
    const result = await callUpstream<UserResponseDto>(
      {
        group: 'users',
        path: '/api/auth/register',
        method: 'POST',
        body: {
          PersonType: personTypeToCode(input.personType),
          Document: input.document,
          Name: input.name,
          Email: input.email,
          Password: input.password,
        },
      },
      this.deps(),
    );
    return result.ok ? Result.ok(undefined) : Result.fail<void>(result.error);
  }

  async login(email: string, password: string): Promise<Result<AuthTokens>> {
    const result = await callUpstream<AuthResponseDto>(
      { group: 'users', path: '/api/auth/login', method: 'POST', body: { Email: email, Password: password } },
      this.deps(),
    );
    return result.ok ? Result.ok(toTokens(result.value)) : Result.fail<AuthTokens>(result.error);
  }

  async refresh(refreshToken: string): Promise<Result<AuthTokens>> {
    const result = await callUpstream<AuthResponseDto>(
      { group: 'users', path: '/api/auth/refresh', method: 'POST', body: { RefreshToken: refreshToken } },
      this.deps(),
    );
    return result.ok ? Result.ok(toTokens(result.value)) : Result.fail<AuthTokens>(result.error);
  }

  logout(refreshToken: string, accessToken: string): Promise<Result<void>> {
    return callUpstream<void>(
      { group: 'users', path: '/api/auth/logout', method: 'POST', body: { RefreshToken: refreshToken }, bearer: accessToken },
      this.deps(),
    );
  }

  async getCurrentUser(accessToken: string): Promise<Result<AuthUser>> {
    const result = await callUpstream<UserResponseDto>(
      { group: 'users', path: '/api/users/me', bearer: accessToken },
      this.deps(),
    );
    return result.ok ? Result.ok(mapUserResponse(result.value)) : Result.fail<AuthUser>(result.error);
  }
}
