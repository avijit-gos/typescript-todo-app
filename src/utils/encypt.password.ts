/** @format */

import bcrypt from "bcrypt";

async function encryptPassword(password: string): Promise<string> {
  console.log(password);
  const hash: string = await bcrypt.hash(password, 10);
  return hash;
}
export default encryptPassword;
