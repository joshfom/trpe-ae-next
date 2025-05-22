"use client"
import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import {PhoneInput} from "react-international-phone";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import 'react-international-phone/style.css';

function JoinUsForm() {
    const [value, setValue] = useState()
    return (
        <div className="pt-12 space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="col-span-1 lg:col-span-2">
                <Input type="text" placeholder="Full Name" className="w-full bg-black text-white border border-white"/>
            </div>

            <div className="col-span-1 ">
                <Input type="email" placeholder="example@email.com" className="w-full bg-black text-white border border-white"/>
            </div>

            <div className="col-span-1 ">
                <PhoneInput
                    placeholder="Enter phone number"
                    value={value}
                    name={'phone'}
                    defaultCountry={'ae'}
                    //@ts-ignore
                    onChange={setValue}
                />
            </div>


            <div className="col-span-1 lg:col-span-2">
                <Input type="url" placeholder="LinkedIn Url" className="w-full bg-black text-white border border-white"/>
            </div>


            <div className="col-span-1 lg:col-span-2 ">
                <Textarea rows={8} placeholder="Your message" className="w-full rounded-2xl text-white bg-black"/>
            </div>
            <div className="flex justify-end col-span-1 lg:col-span-2 ">
                <Button className=" w-40 py-2 bg-transperent hover:bg-white hover:text-black border border-white">
                    Apply
                </Button>
            </div>
        </div>
    );
}

export default JoinUsForm;