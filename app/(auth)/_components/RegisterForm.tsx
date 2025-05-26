"use client";
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {AlertTriangle} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {SignUpFormSchema} from "@/lib/types/form-schema/auth-form-schema";
import {authClient} from "@/lib/auth-client";

const RegisterForm = memo(() => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>('');
    const router = useRouter();

    // Memoize form default values
    const defaultValues = useMemo(() => ({
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: ""
    }), []);

    const form = useForm<z.infer<typeof SignUpFormSchema>>({
        mode: "onBlur",
        resolver: zodResolver(SignUpFormSchema),
        defaultValues,
    });

    // For debugging purposes - can be removed in production
    useEffect(() => {
        const subscription = form.watch((value) => {
            console.log('Form values changed:', value);
        });
        return () => subscription.unsubscribe();
    }, [form]);


    const onSubmit: SubmitHandler<z.infer<typeof SignUpFormSchema>> = useCallback(async (formData) => {
        try {
            setError(null);

            const { data, error } = await authClient.signUp.email({
                email: formData.email,
                password: formData.password,
                name: formData.firstName + " " + formData.lastName,
                callbackURL: '/crm',
            }, {
                onRequest: () => {
                    console.log("Sign-up request initiated");
                    setIsLoading(true);
                },
                onSuccess: async (result) => {
                    console.log("Sign-up successful:", result);
                    setIsLoading(false);
                    router.push("/feed");
                },
                onError: (ctx) => {
                    console.log("Sign-up error:", {
                        message: ctx.error.message,
                        cause: ctx.error.cause,
                        status: ctx.error.status,
                        code: ctx.error.code,
                    });

                    // Provide more helpful error messages
                    let errorMessage = ctx.error.message;
                    if (ctx.error.code === 'ECONNREFUSED') {
                        errorMessage = "Unable to connect to authentication service. Please try again later.";
                    } else if (ctx.error.message?.includes('duplicate key')) {
                        errorMessage = "This email is already registered. Try signing in instead.";
                    }

                    setError(errorMessage);
                    setIsLoading(false);
                },
            });

            if (error) {
                console.log("Error from auth client:", error);
            }

        } catch (err) {
            console.log("Unexpected error during sign-up:", err);
            setError(err instanceof Error ?
                err.message :
                "Something went wrong during sign up. Please try again.");
            setIsLoading(false);
        }
    }, [router]);

    // Clear error on form change
    const handleFormChange = useCallback(() => {
        if (submitError) setSubmitError('');
    }, [submitError]);

    return (
        <div>
            <div className="my-1">
                <p className="text-sm text-gray-500">
                    Already have an account?{' '}
                    <Link href={'/login'} className="font-semibold underline hover:text-accent-foreground">
                        Login
                    </Link>
                </p>
            </div>

            <div className={cn("grid gap-6 py-4")}>
                <Form {...form}>
                    <form
                        onChange={handleFormChange}
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-4"
                    >
                        <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">First name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="First Name"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">Last name</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Last Name"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="sr-only">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="email@trpe.ae"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Confirm Password"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {submitError && (
                            <div className="flex text-destructive py-2 rounded-lg text-sm items-center">
                                <AlertTriangle className="h-5 w-5 mr-2 stroke-1 text-destructive"/>
                                <span>{submitError}</span>
                            </div>
                        )}

                        <div className="flex pt-6">
                            <Button
                                className="w-40"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing Up...' : 'Sign Up'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
});

RegisterForm.displayName = 'RegisterForm';

export default RegisterForm;