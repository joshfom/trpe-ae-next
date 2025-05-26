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
import {LoginFormSchema} from "@/lib/types/form-schema/auth-form-schema";
import {authClient} from "@/lib/auth-client";

const LoginForm = memo(() => {
    // Create form state with zod validation
    const [serverError, setServerError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>('');
    const router = useRouter();

    // Memoize form default values
    const defaultValues = useMemo(() => ({
        email: "",
        password: "",
    }), []);

    // Define the form using useForm hook
    const form = useForm<z.infer<typeof LoginFormSchema>>({
        mode: "onChange",
        resolver: zodResolver(LoginFormSchema),
        defaultValues,
    });

    // For debugging purposes only
    useEffect(() => {
        console.log('Current form values:', form.watch());
    }, [form]);

    /**
     * Represents the onSubmit handler for login form.
     *
     * @callback SubmitHandler
     * @param {Object} formData - The form data to be submitted.
     * @returns {Promise} A Promise that resolves once the submission is complete.
     */
    const onSubmit: SubmitHandler<z.infer<typeof LoginFormSchema>> = useCallback(async (formData) => {
        try {
            setIsLoading(true);
            setServerError(null);

            const result = await authClient.signIn.email({
                email: formData.email,
                password: formData.password,
                callbackURL: '/admin',
            });

            if (result.error) {
                setServerError(result.error.message || "Invalid email or password");
                setIsLoading(false);
            }
        } catch (error) {
            setServerError("Failed to sign in. Please try again.");
            setIsLoading(false);
        }
    }, [form, router]);

    // Clear error on form change
    const handleFormChange = useCallback(() => {
        if (submitError) setSubmitError('');
    }, [submitError]);

    return (
        <div className="px-6 min-w-[500px]">
            <div className={cn("grid gap-6")}>
                <Form {...form}>
                    <form
                        onChange={handleFormChange}
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-4"
                    >
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="sr-only">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Email"
                                            {...field}
                                            disabled={isLoading}
                                            type="email"
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

                        {submitError && (
                            <div className="flex text-destructive py-2 rounded-lg text-sm items-center space-x-2">
                                <AlertTriangle className="h-5 w-5 mr-2 stroke-1 text-destructive"/>
                                <span>{submitError}</span>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <Link href="#"
                                      className="font-medium text-accent-foreground hover:text-accent-foreground">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>

                        <div className="flex pt-6">
                            <Button
                                className="w-40"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
});

LoginForm.displayName = 'LoginForm';

export default LoginForm;