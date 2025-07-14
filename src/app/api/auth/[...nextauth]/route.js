import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "../../../../lib/mongodb";
import Usuario from "../../../../models/Usuario";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../../../../utils/sendEmail";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "tu@email.com" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();
        const { email, password } = credentials;
        const user = await Usuario.findOne({ email });
        if (!user || !user.password) {
          throw new Error("Usuario o contraseña incorrectos");
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
          throw new Error("Usuario o contraseña incorrectos");
        }
        // Retornar solo los datos necesarios
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account?.provider === "google") {
        await dbConnect();
        let existingUser = await Usuario.findOne({ email: user.email });
        if (existingUser) {
          return true;
        } else {
          try {
            await Usuario.create({
              name: user.name,
              email: user.email,
              provider: "google",
            });
            await sendWelcomeEmail({ to: user.email, name: user.name });
          } catch (e) {
            // No bloquear el login si falla la creación o el correo
          }
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.userId = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
