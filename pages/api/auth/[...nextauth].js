import NextAuth from "next-auth";
import Providers from 'next-auth/providers';

export default NextAuth({
  site: process.env.BASE_URL || 'http://localhost:3000',
  // Configure one or more authentication providers
  providers: [
    Providers.Facebook({
        clientId: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    })
    // ...add more providers here
  ],
  secret: process.env.SECRET,
  callbacks: {
        session: async (session, user) => {
            session.id = user.id;
            return Promise.resolve(session)
        }
    }
})