import { ProviderType } from '@auth/core/providers';
import { ObjectId } from 'mongodb';
import { z } from 'zod';

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

export const mongoIdSchema = z.union([z.instanceof(ObjectId).optional(), z.string().optional()]);

const commentSchema = z.object({
  _id: mongoIdSchema,
  createdAt: z.date(),
  response: z.string(),
  userId: z.instanceof(ObjectId),
  postId: z.instanceof(ObjectId),
  likes: z.array(z.instanceof(ObjectId)),
});

export type Comment = z.infer<typeof commentSchema>;

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
  likes: MongoId[];
};

export type CommentWithUserInfo = Comment & Pick<User, 'name' | 'username' | 'image' | 'posts' | 'followers'>;

export type Session = {
  _id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
};

export type User = {
  _id?: MongoId;
  name: string;
  email: string;
  username: string;
  emailVerified?: Date;
  image?: string;
  accounts: Account[];
  sessions: Session[];
  posts: MongoId[];
  comments: MongoId[];
  followers: MongoId[];
};

export type AuthorDetails = Pick<User, '_id' | 'name' | 'username' | 'image'> & {
  followerCount?: number;
};

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
