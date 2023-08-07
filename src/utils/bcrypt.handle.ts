import bcrypt from "bcryptjs";

const saltRounds = 10;

const hashPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (password: string, hashedPassword: string): boolean => {
  return bcrypt.compareSync(password, hashedPassword);
};

export { hashPassword, comparePassword };
