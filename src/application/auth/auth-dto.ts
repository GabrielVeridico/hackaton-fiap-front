// UserAPI = PascalCase (request e response).
export interface AuthResponseDto {
  AccessToken: string;
  RefreshToken: string;
  ExpiresIn: number;
}

export interface UserResponseDto {
  Id: string;
  PersonType: string;
  Document: string;
  Name: string;
  Email: string;
  Role: string;
  IsActive: boolean;
  IsOwner: boolean;
  CreatedAtUtc: string;
  UpdatedAtUtc: string;
}
