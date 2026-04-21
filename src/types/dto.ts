export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateRoleDto {
  name: string;
}

export interface UpdateRoleDto {
  name?: string;
}

export interface AssignRoleDto {
  userId: string;
  roleId: string;
}
