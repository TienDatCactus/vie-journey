export class RegistrationToken {
  _id: string;
  userId: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
  confirmedAt?: Date;
}
