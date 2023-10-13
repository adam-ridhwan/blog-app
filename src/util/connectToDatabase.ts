import { clientPromise } from '@/mongodb/mongodb';
import env from '@/util/env';

import { Account, Category, Comment, Post, Reply, User } from '@/types/types';

const {
  MONGODB_DATABASE,
  ACCOUNT_COLLECTION,
  CATEGORY_COLLECTION,
  COMMENT_COLLECTION,
  REPLY_COLLECTION,
  USER_COLLECTION,
  POST_COLLECTION,
  SESSION_COLLECTION,
} = env;

export const connectToDatabase = async () => {
  const client = await clientPromise;
  const db = client.db(MONGODB_DATABASE);

  const accountCollection = db.collection<Account>(ACCOUNT_COLLECTION);
  const categoryCollection = db.collection<Category>(CATEGORY_COLLECTION);
  const commentCollection = db.collection<Comment>(COMMENT_COLLECTION);
  const replyCollection = db.collection<Reply>(REPLY_COLLECTION);
  const postCollection = db.collection<Post>(POST_COLLECTION);
  const sessionCollection = db.collection(SESSION_COLLECTION);
  const userCollection = db.collection<User>(USER_COLLECTION);

  return {
    accountCollection,
    categoryCollection,
    commentCollection,
    replyCollection,
    postCollection,
    sessionCollection,
    userCollection,
  };
};
