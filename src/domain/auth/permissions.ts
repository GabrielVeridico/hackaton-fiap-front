import type { Role } from './auth-user';

export interface ManageableUser {
  role: Role;
  isOwner: boolean;
}

export function canCreateUserWithRole(actorIsOwner: boolean, role: Role): boolean {
  return role === 'GestorONG' ? actorIsOwner : true;
}

export function canManageUser(actorIsOwner: boolean, target: ManageableUser): boolean {
  if (target.isOwner) {
    return false;
  }
  if (target.role === 'GestorONG') {
    return actorIsOwner;
  }
  return true;
}

export function canChangeRole(actorIsOwner: boolean, target: ManageableUser): boolean {
  return actorIsOwner && !target.isOwner;
}
