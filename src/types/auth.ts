export interface RegisterPayload {
  username: string
  password: string
  email:string
}

export type LoginPayload = Pick<RegisterPayload, 'email' | 'password'>;