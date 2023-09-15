import { createUserAndAccount } from '@/actions/createUserAndAccount';
import { getAccount } from '@/actions/getAccount';
import { getUser } from '@/actions/getUser';
import { updateProviders } from '@/actions/updateProviders';
import { type User } from '@/types';
import env from '@/util/env';
import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

const { GOOGLE_ID, GOOGLE_SECRET, FACEBOOK_ID, FACEBOOK_SECRET, GITHUB_ID, GITHUB_SECRET } = env;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_ID,
      clientSecret: GOOGLE_SECRET,
    }),
    FacebookProvider({
      clientId: FACEBOOK_ID,
      clientSecret: FACEBOOK_SECRET,
    }),
    GitHubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      /**
       * 1) Check if user exists in user collection
       * 2) If user DOES NOT exist, create new user and account
       * 3) If user DOES exits, check if account provider exists in account collection
       * 4) If account provider DOES NOT, push the provider to accounts[] in user collection
       * */

      // 1) Check if user exists in user collection
      const existingUser: User | null = await getUser(user.email || undefined);

      // 2) If user DOES NOT exist, create new user and account
      if (!existingUser) {
        await createUserAndAccount(account, user);
        return true;
      }

      // 3) If user DOES exits, check if account provider exists in account collection
      const existingAccount = await getAccount(existingUser._id, account?.provider);

      // 4) If account provider DOES NOT, update account by pushing the provider to accounts[] in user collection
      if (!existingAccount) await updateProviders(account, existingUser);

      return true;
    },
  },
});

export { handler as GET, handler as POST };
