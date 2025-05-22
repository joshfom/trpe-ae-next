'use client'
import {Button} from "@/components/ui/button";
import AdminAgentCard from "@/features/admin/agent/components/AdminAgentCard";
import {useGetAdminAgents} from "@/features/admin/agent/api/use-get-admin-agents";
import AddAgentForm from "@/features/admin/agent/components/AddAgentForm";
import {useState} from "react";
import AddLanguageForm from "@/features/admin/language/components/AddLanguageForm";
import {useGetAdminLanguage} from "@/features/admin/language/api/use-get-admin-language";


function LanguagesPage() {
    const {data: languages} = useGetAdminLanguage();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={'w-full'}>
            <div className="flex  justify-between items-center h-16 w-full px-4 bg-white ">
                <div className="flex items-center">
                    <div className="text-2xl font-bold">Languages </div>
                </div>

                <div className="items-center  space-x-4">
                    <Button
                        onClick={() => setIsOpen(true)}
                    >
                        Add Language
                    </Button>
                </div>
            </div>


            {
                languages?.length === 0 && (
                    <div className={' flex-1 mt-4 flex flex-col items-center space-y-8 justify-center h-96'}>
                        <p>You have not created any languages yet.</p>
                    </div>
                )
            }

            {
                languages &&
                languages?.length > 0 && (
                    <div className="mt-6 grid grid-cols-8 gap-6">
                        {languages.map((language) => (

                            <div key={language.id} className="flex-flex">
                                <img src={language.icon!} alt={language.name!} />
                                <p>
                                    {language.name}
                                </p>
                            </div>
                        ))}
                    </div>
                )
            }

            <AddLanguageForm isOpen={isOpen} setIsOpen={setIsOpen}/>

        </div>
    );
}

export default LanguagesPage;