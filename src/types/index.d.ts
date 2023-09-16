import { MongoDocument, ObjectId, WithId } from 'mongodb';

type WithoutObjectId<T> = Omit<T, '_id'>;

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

type Category = WithId<MongoDocument> & {
  _id?: ObjectId;
  slug: string;
  title: string;
  posts: [];
};

type CategoryWithStrings = WithoutObjectId<Category> & {
  _id?: string;
  slug: string;
  title: string;
  posts: [];
};

type Comment = WithId<MongoDocument> & {
  _id: ObjectId;
  createdAt: Date;
  desc: string;
  userEmail: string;
  user: User;
  postSlug: string;
  post: Post;
};

type Post = WithId<MongoDocument> & {
  _id?: ObjectId;
  createdAt: Date;
  postSlug: string;
  title: string;
  content: string;
  img?: string;
  views: number;
  categorySlug: string;
  category: ObjectId;
  author: ObjectId;
  comments: [ObjectId];
  likes: number;
};

type PostWithStrings = WithoutObjectId<Post> & {
  _id: string;
  category: string;
  author: string;
  comments: string[];
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

type UserWithStrings = WithoutObjectId<User> & {
  _id: string;
  name: string;
  email: string;
  username: string;
  image?: string;
};

type VerificationToken = {
  _id: ObjectId;
  token: string;
  expires: Date;
};
