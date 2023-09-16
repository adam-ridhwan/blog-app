import { MongoDocument, ObjectId, WithId } from 'mongodb';

type Account = WithId<MongoDocument> & {
  _id: ObjectId | string;
  userId: ObjectId | string;
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

type Category = WithId<MongoDocument> & {
  _id?: string;
  slug: string;
  title: string;
  posts: [];
};

type Comment = WithId<MongoDocument> & {
  _id: string;
  createdAt: Date;
  desc: string;
  userEmail: string;
  user: User;
  postSlug: string;
  post: Post;
};

type Post = WithId<MongoDocument> & {
  _id?: string;
  createdAt: Date;
  postSlug: string;
  title: string;
  content: string;
  img?: string;
  views: number;
  categorySlug: string;
  category: string;
  author: string;
  comments: string[];
  likes: number;
};

type Session = WithId<MongoDocument> & {
  _id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
  user: User;
};

type User = WithId<MongoDocument> & {
  _id: string;
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
  _id: string;
  token: string;
  expires: Date;
};
