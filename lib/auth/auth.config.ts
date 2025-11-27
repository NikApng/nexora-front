import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


export const authConfig: NextAuthOptions = {
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
            }
        })
    ]
}