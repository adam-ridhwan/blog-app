import { ObjectId } from 'mongodb';
import { z } from 'zod';

export type MongoId = string | ObjectId;
export const mongoIdSchema = z.union([z.instanceof(ObjectId), z.string()]);

export const accountSchema = z.object({
  _id: mongoIdSchema.optional(),
  userId: mongoIdSchema,
  type: z.string().optional(),
  provider: z.string().optional(),
  providerAccountId: z.string(),
  refresh_token: z.string().optional(),
  access_token: z.string().optional(),
  expires_at: z.number().optional(),
  token_type: z.string().optional(),
  scope: z.string().optional(),
  id_token: z.string().optional(),
});
export type Account = z.infer<typeof accountSchema>;

export type Category = {
  _id?: MongoId;
  slug: string;
  title: string;
  posts: MongoId[];
};

const commentSchema = z.object({
  _id: mongoIdSchema.optional(),
  createdAt: z.date(),
  response: z.string(),
  userId: z.instanceof(ObjectId),
  postId: z.instanceof(ObjectId),
  likes: z.array(z.instanceof(ObjectId)),
});
export type Comment = z.infer<typeof commentSchema>;

const postSchema = z.object({
  _id: mongoIdSchema.optional(),
  createdAt: z.date(),
  postSlug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  content: z.string(),
  img: z.string().optional(),
  views: z.number(),
  categorySlug: z.string(),
  categoryId: z.instanceof(ObjectId),
  authorId: z.instanceof(ObjectId),
  comments: z.array(z.instanceof(ObjectId)),
  likes: z.array(z.instanceof(ObjectId)),
});
export type Post = z.infer<typeof postSchema>;

export type CommentWithUserInfo = Comment & Pick<User, 'name' | 'username' | 'image' | 'posts' | 'followers'>;

const userSchema = z.object({
  _id: mongoIdSchema.optional(),
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  emailVerified: z.date().optional(),
  image: z.string().optional(),
  accounts: z.array(accountSchema),
  posts: z.array(z.instanceof(ObjectId)),
  comments: z.array(z.instanceof(ObjectId)),
  followers: z.array(z.instanceof(ObjectId)),
});
export type User = z.infer<typeof userSchema>;

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
