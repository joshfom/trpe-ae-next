import * as z from "zod";

export const LoginFormSchema = z.object({
    email: z.string().describe('Email').email({message: 'Please enter a valid email'}),
    password: z.string().describe('Password'),
})

const allowedDomains = ['trpe.ae', 'luxetrpe.com'];

export const SignUpFormSchema = z.object({
    email: z.string().email({message: 'Please enter a valid email'}),
    firstName: z.string({message: 'First name is required'}),
    lastName: z.string({message: 'Last name is required'}),
    password: z.string().min(8, {message: 'Password must be at least 8 characters long'}),
    confirmPassword: z.string().min(8, {message: 'Password must be at least 8 characters long'})
}).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
}).refine(data => allowedDomains.some(domain => data.email.endsWith(`@${domain}`)), {
    message: 'Only TRPE Employees are allowed to sign up',
    path: ['email']
});