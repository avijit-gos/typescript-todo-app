/** @format */

import bcrypt from "bcrypt";

async function decryptPassword(
  passowrd: string,
  userPassword: string
): Promise<boolean> {
  const result: boolean = await bcrypt.compare(passowrd, userPassword);
  return result;
}

export default decryptPassword;
