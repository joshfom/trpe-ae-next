import React from "react";
import Image from "next/image";

const AgentCard = () => {
    return <div className={'rounded-xl border border-gray-100 shadow-lg p-3'}>
        <div className={'flex flex-col items-center'}>
            <div className="relative w-[300px] h-[300px]">
                <Image 
                    src="https://trpe.ae/wp-content/uploads/2024/03/rosie-agent-bio.jpg" 
                    alt="TRPE Agent"
                    width={300}
                    height={300}
                    className="rounded-xl object-cover"
                />
            </div>
            <h2 className={'text-xl font-semibold mt-3'}>Rosie Ramirez</h2>
            <p className={'text-trpe-primary'}>Real Estate Agent</p>
            <div className={'grid grid-cols-2 gap-4 w-full mt-4'}>
                <div
                    className={'border border-gray-100 shadow px-3 py-2 rounded-md flex items-center justify-center'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         stroke-width="1.5" stroke="currentColor" className="w-4 h-4 text-gray-600 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"/>
                    </svg>
                    <span className={'text-xs'}>Call</span>
                </div>
                <div
                    className={'border border-gray-100 shadow px-3 py-2 rounded-md flex items-center justify-center'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                         stroke-width="1.5" stroke="currentColor" className="w-4 h-4 text-gray-600 mr-2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"/>
                    </svg>
                    <span className={'text-xs'}>Email</span></div>
            </div>
        </div>
    </div>;
}

export default AgentCard;