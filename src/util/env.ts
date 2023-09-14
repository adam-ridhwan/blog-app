import { cleanEnv, str } from 'envalid';

const env = cleanEnv(process.env, {
  NEXT_PUBLIC_NODE_ENV: str(),

  MONGODB_URI: str(),
  MONGODB_DATABASE: str(),

  ACCOUNT_COLLECTION: str(),
  CATEGORY_COLLECTION: str(),
  COMMENT_COLLECTION: str(),
  POST_COLLECTION: str(),
  SESSION_COLLECTION: str(),
  USER_COLLECTION: str(),

  NEXTAUTH_SECRET: str(),
  NEXTAUTH_URL: str(),

  GOOGLE_ID: str(),
  GOOGLE_SECRET: str(),

  FACEBOOK_ID: str(),
  FACEBOOK_SECRET: str(),

  GITHUB_ID: str(),
  GITHUB_SECRET: str(),
});

export default env;
