import { clientPromise } from '@/mongodb';
import env from '@/util/env';

const {
  MONGODB_DATABASE,
  ACCOUNT_COLLECTION,
  CATEGORY_COLLECTION,
  COMMENT_COLLECTION,
  USER_COLLECTION,
  POST_COLLECTION,
  SESSION_COLLECTION,
} = env;

export const connectToDatabase = async () => {
  const client = await clientPromise;
  const db = client.db(MONGODB_DATABASE);

  const accountCollection = db.collection(ACCOUNT_COLLECTION);
  const categoryCollection = db.collection(CATEGORY_COLLECTION);
  const commentCollection = db.collection(COMMENT_COLLECTION);
  const postCollection = db.collection(POST_COLLECTION);
  const sessionCollection = db.collection(SESSION_COLLECTION);
  const userCollection = db.collection(USER_COLLECTION);

  return {
    accountCollection,
    categoryCollection,
    commentCollection,
    postCollection,
    sessionCollection,
    userCollection,
  };
};
