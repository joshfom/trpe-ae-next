import React from 'react';
import RegisterForm from "@/app/(auth)/_components/RegisterForm";


// import supabase auth

function RegisterPage() {
    return (
        <div className={'flex py-12 flex-col lg:flex-row max-w-7xl mx-auto items-center justify-center'}>
            <div className={'py-12 h-full'}>
                <div className={''}>
                   <div className={'pb-3'}>
                       <h1 className={'text-3xl font-semibold'}>Get Started</h1>
                       <p className={'text-gray-500'}>Setup your account</p>
                   </div>

                    <RegisterForm />
                </div>
            </div>

        </div>
    );
}

export default RegisterPage;