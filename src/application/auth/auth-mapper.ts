import type { AuthUser, PersonType, Role } from '@/domain/auth/auth-user';
import type { UserResponseDto } from './auth-dto';

export function mapUserResponse(dto: UserResponseDto): AuthUser {
  return {
    id: dto.Id,
    name: dto.Name,
    email: dto.Email,
    document: dto.Document,
    personType: dto.PersonType as PersonType,
    role: dto.Role as Role,
    isActive: dto.IsActive,
    isOwner: dto.IsOwner,
  };
}

export function personTypeToCode(personType: PersonType): 0 | 1 {
  return personType === 'Company' ? 1 : 0;
}
