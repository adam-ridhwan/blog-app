import { createUserAndAccount } from '@/actions/createUserAndAccount';
import { getAccount } from '@/actions/getAccount';
import { getUserByEmail } from '@/actions/getUserByEmail';
import { updateProviders } from '@/actions/updateProviders';
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
    async signIn({ user: nextAuthUser, account: nextAuthAccount, profile: nextAuthProfile }) {
      /**
       * 1) Check if user exists in user collection
       * 2) If user DOES NOT exist, create new user and account
       * 3) If user DOES exits, check if account providers exists in account collection
       * 4) If account providers DOES NOT, push the providers to accounts[] in user collection
       * */

      if (!nextAuthUser) return false;
      if (!nextAuthAccount) return false;

      // 1) Check if user exists in user collection
      const existingUser = await getUserByEmail(nextAuthUser.email || undefined);

      // 2) If user DOES NOT exist, create new user and account
      if (!existingUser) {
        await createUserAndAccount(nextAuthAccount, nextAuthUser);
        return true;
      }

      // 3) If user DOES exits, check if account providers exists in account collection
      const existingAccount = await getAccount(existingUser._id, nextAuthAccount.provider);

      // 4) If account providers DOES NOT, update account by pushing the providers to accounts[] in user collection
      if (!existingAccount) await updateProviders(nextAuthAccount, existingUser);

      return true;
    },
  },
});

export { handler as GET, handler as POST };
