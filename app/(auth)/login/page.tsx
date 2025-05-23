
import {Metadata} from "next";
import {redirect} from "next/navigation";
import LoginForm from "@/app/(auth)/_components/LoginForm";
import {validateRequest} from "@/actions/auth-session";

export const metadata: Metadata = {
    title: "Login - TRPE",
    description: "Login to your account",
}


async function LoginPage() {


    return (
        <div className={'flex flex-col pt-12 lg:flex-row max-w-7xl mx-auto items-center justify-center'}>
            <div className={' h-full py-24'}>
                <div className="p-6 space-y-6 ">
                    <div className={'px-6'}>
                        <h1 className={'text-3xl font-semibold'}>Login</h1>
                        <p className={'text-gray-500'}>Login to your account</p>
                    </div>
                    <LoginForm/>
                </div>
            </div>

        </div>
    );
}

export default LoginPage;