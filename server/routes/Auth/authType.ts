import { Static, Type } from '@sinclair/typebox'

export const User = Type.Object({
  email: Type.String({ format: 'email' }),
  password: Type.String(),
});
export type UserType = Static<typeof User>;


export const authResponse = Type.Object({
  _id: Type.String(),
  email: Type.String({ format: 'email' }),
  iat: Type.Integer(),
});
export type AuthResponseType = Static<typeof authResponse>;

export const changePassword = Type.Object({
  password: Type.String(),
  newPassword: Type.String(),
});
export type changePasswordType = Static<typeof changePassword>;