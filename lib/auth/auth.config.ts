import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


const authConfig: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: 'Почта'},
                password: {label: 'Пароль'}
            },
            async authorize (credentials){
                const email = credentials?.email
                const password = credentials?.password

                if (!email || !password) {
                    return null;
                }

                if(email === 'admin@admin.com' && password === 'admin123'){
                    return {
                        id: '1',
                        email,
                        name: 'Admin1',
                    }

                }

                return  null

            }

        })
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
}
export default authConfig