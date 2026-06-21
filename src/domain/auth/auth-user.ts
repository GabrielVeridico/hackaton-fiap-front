export type PersonType = 'Individual' | 'Company';
export type Role = 'Doador' | 'GestorONG';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  document: string;
  personType: PersonType;
  role: Role;
  isActive: boolean;
  isOwner: boolean;
}
