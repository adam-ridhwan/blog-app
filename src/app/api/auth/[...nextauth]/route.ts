import { createUser } from '@/actions/createUser';
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
      console.log('signIn', { user, account, profile });

      const existingUser: User | null = await getUser(user.email || undefined);

      if (existingUser) {
        const existingAccount = await getAccount(existingUser._id, account?.provider);

        if (existingAccount) {
          // IF THE ACCOUNT PROVIDER EXISTS, DO NOTHING
          console.log(`${account?.provider.toUpperCase()} account already exists for ${user.email || undefined}}`);
        } else {
          // IF THE ACCOUNT PROVIDER DOES NOT EXIST, CREATE IT AND UPDATE USER ACCOUNTS LISTS
          await updateProviders(account, existingUser);
        }
      }

      if (!existingUser) {
        await createUser(account, user);
      }

      return true;
    },
    // async session({ session, user, token }) {
    //   // console.log('session', session, user);
    //   return session;
    // },
    // async jwt({ token, account, profile }) {
    //   // console.log('jwt', token, account, profile);
    //   return token;
    // },
  },
});

export { handler as GET, handler as POST };
