"use client";
import React, {useState, useEffect, memo, useCallback, useMemo} from 'react';
import {SubmitHandler, useForm} from "react-hook-form";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {AlertTriangle} from "lucide-react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import Link from "next/link";
import {signUpWithEmailAndPassword} from "@/actions/auth/auth-actions";
import {useRouter} from "next/navigation";
import {SignUpFormSchema} from "@/lib/types/form-schema/auth-form-schema";

const RegisterForm = memo(() => {
    // Create form state with zod validation
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

    const isLoading = form.formState.isSubmitting;

    const onSubmit: SubmitHandler<z.infer<typeof SignUpFormSchema>> = useCallback(async (formData) => {
        try {
            // Validate that all required fields are present
            if (!formData.email || !formData.password || !formData.firstName ||
                !formData.lastName || !formData.confirmPassword) {
                setSubmitError('All fields are required');
                return;
            }

            // Validate password match
            if (formData.password !== formData.confirmPassword) {
                setSubmitError('Passwords do not match');
                return;
            }

            // Log form data for debugging (remove in production)
            console.log('Submitting registration data:', {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                // Don't log passwords
            });

            const result = await signUpWithEmailAndPassword(formData);
            const {error} = result;

            if (error) {
                setSubmitError(error?.message);
            } else {
                return router.push('/crm');
            }
        } catch (error: any) {
            console.error('Registration error:', error);
            setSubmitError(error?.message || 'An unexpected error occurred');
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