"use server"

import bcrypt from "bcryptjs"

import { db } from "@/lib/db" 
import * as z from "zod"

import { RegisterSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields =  RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invaild fields!" };
    };

    const { email, password, name } = validatedFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await getUserByEmail(email)

    if (existingUser) return { error : "This email is already register!. Please try another email"}

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        }
    })
    
    return { success : "Complete create an account and welcome"}
}