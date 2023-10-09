import { BSON, ObjectId } from 'mongodb';
import { z, ZodObjectDef, ZodOptionalDef, ZodSchema, ZodTypeDef } from 'zod';

export type MongoId = string | ObjectId;
// export const mongoIdSchema = z.union([z.instanceof(ObjectId), z.string()]);
export const mongoIdSchema = z.string().or(z.instanceof(ObjectId));

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
  createdAt: z.date().or(z.string()),
  comment: z.string(),
  userId: mongoIdSchema,
  postId: mongoIdSchema,
  likes: z.array(mongoIdSchema),
});
export type Comment = z.infer<typeof commentSchema>;

const postSchema = z.object({
  _id: mongoIdSchema.optional(),
  createdAt: z.date().or(z.string()),
  postSlug: z.string(),
  title: z.string(),
  subtitle: z.string(),
  content: z.string(),
  img: z.string().optional(),
  views: z.number(),
  categorySlug: z.string(),
  categoryId: mongoIdSchema,
  authorId: mongoIdSchema,
  comments: z.array(mongoIdSchema),
  likes: z.array(mongoIdSchema),
});
export type Post = z.infer<typeof postSchema>;

const userSchema = z.object({
  _id: mongoIdSchema.optional(),
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  emailVerified: z.date().optional(),
  image: z.string().optional(),
  accounts: z.array(accountSchema),
  posts: z.array(mongoIdSchema),
  savedPosts: z.array(mongoIdSchema),
  comments: z.array(mongoIdSchema),
  followers: z.array(mongoIdSchema),
});
export type User = z.infer<typeof userSchema>;

const partialUserSchema = userSchema.pick({
  name: true,
  username: true,
  image: true,
  posts: true,
  followers: true,
});
export const commentWithUserInfoSchema = commentSchema.merge(partialUserSchema);
export type CommentWithUserInfo = z.infer<typeof commentWithUserInfoSchema>;

export type AuthorDetails = Pick<User, '_id' | 'name' | 'username' | 'image'> & {
  followerCount?: number;
};
