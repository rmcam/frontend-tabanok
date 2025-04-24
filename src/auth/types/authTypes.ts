export interface SignupData {
  email: string;
  password: string;
  username: string;
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  avatar?: string;
}

export interface SigninData {
  identifier: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  roles: string[];
  firstName: string;
  secondName: string;
  firstLastName: string;
  secondLastName: string;
  avatar?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  // Puedes agregar más propiedades aquí, como el usuario, etc.
}
