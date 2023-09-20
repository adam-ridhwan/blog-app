import { ProviderType } from '@auth/core/providers';
import { ObjectId } from 'mongodb';

export type Account = {
  _id?: ObjectId | string;
  userId: ObjectId | string;
  type?: ProviderType | undefined;
  provider: string | undefined;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
};

export type Category = {
  _id?: ObjectId | string;
  slug: string;
  title: string;
  posts: (ObjectId | string)[];
};

export type Comment = {
  _id: string;
  createdAt: Date;
  desc: string;
  userEmail: string;
  user: User;
  postSlug: string;
  post: Post;
};

export type Post = {
  _id?: ObjectId | string;
  createdAt: Date;
  postSlug: string;
  title: string;
  content: string;
  img?: string;
  views: number;
  categorySlug: string;
  category: ObjectId | string;
  author: ObjectId | string;
  comments: (ObjectId | string)[];
  likes: number;
};

export type Session = {
  _id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
};

export type User = {
  _id?: ObjectId | string;
  name?: string;
  email: string;
  username: string;
  emailVerified?: Date;
  image?: string;
  accounts: Account[];
  sessions: Session[];
  posts: Post[];
  comments: Comment[];
};

export type VerificationToken = {
  _id: string;
  token: string;
  expires: Date;
};
