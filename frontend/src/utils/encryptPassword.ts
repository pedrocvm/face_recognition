import bcrypt from 'bcryptjs';

const encryptPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

export default encryptPassword;
