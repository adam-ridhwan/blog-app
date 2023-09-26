import { ProviderType } from '@auth/core/providers';
import { ObjectId } from 'mongodb';

export type MongoId = string | ObjectId;

export type Account = {
  _id?: MongoId;
  userId: MongoId;
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
  _id?: MongoId;
  slug: string;
  title: string;
  posts: MongoId[];
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
  _id?: MongoId;
  createdAt: Date;
  postSlug: string;
  title: string;
  subtitle: string;
  content: string;
  img?: string;
  views: number;
  categorySlug: string;
  categoryId: MongoId;
  authorId: MongoId;
  comments: MongoId[];
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
  _id?: MongoId;
  name?: string;
  email: string;
  username: string;
  emailVerified?: Date;
  image?: string;
  accounts: Account[];
  sessions: Session[];
  posts: Post[];
  comments: Comment[];
  followers: Follower[];
};

export type AuthorDetails = Pick<User, '_id' | 'name' | 'username' | 'image'>;

export type Follower = {
  _id: MongoId;
  userId: MongoId;
  followerId: MongoId[];
};

export type VerificationToken = {
  _id: string;
  token: string;
  expires: Date;
};
