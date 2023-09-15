import { MongoDocument, ObjectId, WithId } from 'mongodb';

type Account = WithId<MongoDocument> & {
  _id: ObjectId;
  userId: ObjectId;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string;
  access_token?: string;
  expires_at?: number;
  token_type?: string;
  scope?: string;
  id_token?: string;
};

type Session = WithId<MongoDocument> & {
  _id: ObjectId;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
};

type User = WithId<MongoDocument> & {
  _id: ObjectId;
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

type VerificationToken = {
  _id: ObjectId;
  token: string;
  expires: Date;
};

type Category = WithId<MongoDocument> & {
  _id: ObjectId;
  slug: string;
  title: string;
  posts: Post[];
};

type Post = {
  _id: ObjectId;
  createdAt: Date;
  slug: string;
  title: string;
  desc: string;
  img?: string;
  views: number;
  categorySlug: string;
  category: Category;
  userEmail: string;
  user: User;
  comments: Comment[];
};

type Comment = {
  _id: ObjectId;
  createdAt: Date;
  desc: string;
  userEmail: string;
  user: User;
  postSlug: string;
  post: Post;
};
