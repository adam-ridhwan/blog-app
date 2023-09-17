import { MongoDocument, ObjectId, WithId } from 'mongodb';
import { ProviderType } from 'next-auth/providers';

type Account = {
  _id?: ObjectId | string;
  userId: ObjectId | string;
  type?: string | undefined;
  provider: ProviderType | undefined;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
};

type Category = {
  _id?: ObjectId | string;
  slug: string;
  title: string;
  posts: (ObjectId | string)[];
};

type Comment = {
  _id: string;
  createdAt: Date;
  desc: string;
  userEmail: string;
  user: User;
  postSlug: string;
  post: Post;
};

type Post = {
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

type Session = {
  _id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
};

type User = {
  _id?: ObjectId | string;
  name?: string | null;
  email: string | null | undefined;
  username: string;
  emailVerified?: Date;
  image?: string;
  accounts: Account[];
  sessions: Session[];
  posts: Post[];
  comments: Comment[];
};

type VerificationToken = {
  _id: string;
  token: string;
  expires: Date;
};
