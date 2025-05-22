import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import RequestCallbackForm from "@/features/site/components/RequestCallbackForm";

interface RequestCallBackProps {
    itemUrl: string;
    itemType: string;
    agentName: string;
}

const RequestCallBack = ({
                             itemUrl,
                             itemType,
                             agentName
                         }: RequestCallBackProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleFormSubmitted = () => {
        setIsOpen(false);
    }
    // Use breakpoint for tablet and mobile
    const isMobileOrTablet = useMediaQuery({ query: '(max-width: 1024px)' });

    if (isMobileOrTablet) {
        return (
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerTrigger asChild>
                    <Button
                        className="w-full border bg-black border-white hover:bg-white hover:text-black"
                    >
                        Request Call Back
                    </Button>
                </DrawerTrigger>
                <DrawerContent className={'h-[80%]'}>
                    <DrawerHeader className={'pt-8'}>
                        <DrawerTitle>
                            Request a Call Back
                        </DrawerTitle>
                    </DrawerHeader>
                    <div className="px-4 pb-4">
                        <RequestCallbackForm
                            itemUrl={itemUrl}
                            handleFormSubmitted={handleFormSubmitted}
                            itemType={itemType}
                            agentName={agentName}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full border bg-black border-white hover:bg-white hover:text-black"
                >
                    Request Call Back
                </Button>
            </DialogTrigger>
            <DialogContent className={'max-w-xl'}>
                <DialogHeader>
                    <DialogTitle>
                        Request a Call Back
                    </DialogTitle>
                </DialogHeader>
                <RequestCallbackForm
                    handleFormSubmitted={handleFormSubmitted}
                    itemUrl={itemUrl}
                    itemType={itemType}
                    agentName={agentName}
                />
            </DialogContent>
        </Dialog>
    );
};

export default RequestCallBack;