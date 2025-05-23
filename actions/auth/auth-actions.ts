"use server";

import {z} from "zod";
import { auth } from "@/lib/auth";
import {validateRequest} from "@/actions/auth-session";
import {cookies} from "next/headers";
import { headers } from "next/headers";
import {eq} from "drizzle-orm";
import {redirect} from "next/navigation";
import {createId} from "@paralleldrive/cuid2";
import {userTable} from "@/db/schema/user-table";
import {db} from "@/db/drizzle";
import {LoginFormSchema, SignUpFormSchema} from "@/lib/types/form-schema/auth-form-schema";
import {employeeTable} from "@/db/schema/employee-table";
import slugify from "slugify";
import * as argon2 from '@node-rs/argon2';


/**
 * Signs up a user with an email and password.
 *
 * @param {object} data - The user data.
 * @param {string} data.email - The user's email.
 * @param {string} data.password - The user's password.
 * @returns {Promise} - A Promise that resolves to a JSON string containing the result of the sign up process.
 */


export async function signUpWithEmailAndPassword(
    {
        email,
        password,
        firstName,
        lastName
    }: z.infer<typeof SignUpFormSchema>,
): Promise<any> {

    //check if user already exists
    const [existingUser] = await db.select().from(userTable).where(
        eq(userTable.email, email)
    ).limit(1)

    if (existingUser) {
        return {
            error: {
                message: 'User already exists'
            }
        }
    }

    const hashedPassword = await argon2.hash(password);

    let userId
    let username = createId()

    try {
        const [result] = await db.insert(userTable).values({
            id: createId(),
            email: email,
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: hashedPassword
        }).returning({
            id: userTable.id
        })

        let slug = slugify(`${firstName} ${lastName}`, {
            lower: true,
            strict: true
        })

        if (result) {
            //check if employee already exists by email
            const [existingEmployee] = await db.select().from(employeeTable).where(
                eq(employeeTable.email, email)
            ).limit(1)

            if (existingEmployee) {
                if (existingEmployee.slug === slug) {
                    slug = `${slug}-${createId()}`
                }
            }

            //create Employee profile
            const [employee] = await db.insert(employeeTable).values({
                id: createId(),
                slug: slug,
                firstName: firstName,
                title: 'Property Consultant',
                lastName: lastName,
                userId: result.id
            }).returning();
        }

        userId = result.id

    } catch (error: any) {
        return error?.message
    }
    
    try {
        // Use Better Auth to sign in the user and create a session
        const response = await auth.api.signInEmail({
            body: {
                email: email,
                password: password
            },
            asResponse: true
        });
        
        if (!response.ok) {
            throw new Error('Failed to create session for new user');
        }
        
        // Next.js automatically handles cookies from the response
        // The cookies will be automatically applied when the response is returned
        
    } catch (error: any) {
        console.error("Error creating session:", error);
        // Continue anyway since the user was created
    }

    return {
        success: true,
        message: 'User created successfully',
        data: {
            userId: userId,
            username: username,
        }
    }
}


/**
 * Signs in the user with the provided email and password.
 *
 * @param {Object} credentials - The user's email and password.
 * @param {string} credentials.email - The user's email.
 * @param {string} credentials.password - The user's password.
 *
 * @return {Promise} A promise that resolves with an object representing the user's authentication state.
 */

export async function signInWithEmailAndPassword(
    {email, password}: z.infer<typeof LoginFormSchema>
): Promise<any> {

    const [existingUser] = await db.select().from(userTable).where(
        eq(userTable.email, email)
    ).limit(1)

    if (!existingUser?.password) {
        return {
            error: {
                message: 'Email or password is incorrect'
            }
        }
    }

    const isValidPassword = await argon2.verify(
        existingUser.password,
        password
    )
    if (!isValidPassword) {
        return {
            error: {
                message: 'Email or password is incorrect'
            }
        }
    }

    try {
        // Use Better Auth to sign in and create a session
        const response = await auth.api.signInEmail({
            body: {
                email: email,
                password: password
            },
            asResponse: true
        });

        if (!response.ok) {
            return {
                error: {
                    message: 'Failed to create session'
                }
            }
        }

        // Next.js automatically handles cookies from the response
        // The cookies will be automatically applied when the response is returned
        
    } catch (error: any) {
        return {
            error: {
                message: error.message || 'An error occurred during sign in'
            }
        }
    }

    return {
        success: true,
        message: 'User signed in successfully',
        data: {
            userId: existingUser.id,
            username: existingUser.username
        }
    }
}

/**
 * Signs out the current user.
 *
 * @returns {Promise} A promise that resolves once the user has been signed out.
 */

export async function signOut() {
    const {session} = await validateRequest()
    if (!session) {
        return redirect('/login')
    }

    try {
        // Use the correct server-side signOut method from Better Auth
        // For server-side signOut, we need to use a POST request to the signOut endpoint
        const response = await auth.api.signOut({
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        // Return the result (no need to manually handle cookies)
        return { 
            success: true 
        }
    } catch (error: any) {
        console.error("Error signing out:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
    }
}