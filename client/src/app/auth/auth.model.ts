class User {
  user_id!: number;
  email!: string;
}

export class Token {
  userInfo!: User;
  accessToken!: string;
}
