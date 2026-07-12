import mongoose, { Schema } from 'mongoose';

interface IUser {
  email: string;
  name?: string;
  avatar?: string;
  provider: string;
  providerId: string;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    providerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
