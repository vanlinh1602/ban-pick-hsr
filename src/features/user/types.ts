export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
};

export type UserState = {
  data?: User;
  handling: boolean;
};
