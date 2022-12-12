export type UserProps = {
  uploads: any;
  role: string;
  name: string;
  email: string;
  token?: string;
  id: string;
};

export type CredentialsProps = {
  name?: string;
  email: string;
  password: string;
  role?: string;
};
