import * as bcrypt from 'bcrypt';

export const encryptPassword = async (password: string): Promise<string[]> => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  return [passwordHash, salt];
};

export const verifyPassword = async (
  password: string,
  password_hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, password_hash);
};
