import bcrypt from "bcrypt";
export { bcrypt };

export function createPasswordHash(password: string) {
  return bcrypt.hash(password, 10);
}
