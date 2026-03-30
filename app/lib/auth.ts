import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins"

import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";

import { Resend } from "resend";


const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    trustedOrigins: ["http://localhost:3000", "https://bendita.vercel.app"
    ],
    emailAndPassword: {
        enabled: true,
        //alterar minimo da senha
        minPasswordLength: 6,
        maxPasswordLength: 128,
        requireEmailVerification: true,
    },
    emailVerification: {
        autoSignInAfterVerification: true,
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "email-verification") {
                    // Send the OTP for email verification
                    await resend.emails.send({
                        from: "Bendita Auth <onboarding@onlinemuller.codes>",
                        to: email,
                        subject: "Seu código de verificação",
                        html: `<h1>Seu código é: <strong>${otp}</strong></h1>`,
                    });
                } else {
                    // Send the OTP for password reset
                    await resend.emails.send({
                        from: "Bendita Auth <onboarding@resend.dev>",
                        to: email,
                        subject: "Seu código para resetar senha",
                        html: `<h1>Seu código é: <strong>${otp}</strong></h1>`,
                    });
                }
            },
        })
    ]
});