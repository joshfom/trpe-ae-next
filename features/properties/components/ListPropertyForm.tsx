"use client";
import React, {useState} from 'react';
import {Input} from "@/components/ui/input";
import dynamic from 'next/dynamic';
import {Label} from "@/components/ui/label";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

// Dynamically import PhoneInput to avoid SSR issues
const PhoneInput = dynamic(() => import('react-international-phone').then(mod => mod.PhoneInput), {
    ssr: false,
    loading: () => <Input placeholder="Loading phone input..." disabled />
});

function ListPropertyForm() {
    const [value, setValue] = useState()
    return (
        <div className={'grid p-6 bg-white rounded-2xl gap-6'}>
            <h3 className={'text-xl'}>Share details</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <Label className={'ml-4'} htmlFor={"first_name"}>First Name</Label>
                    <Input name={'first_name'} type="text" placeholder="First Name" className="w-full "/>
                </div>
                <div>
                    <Label className={'ml-4'} htmlFor={"last_name"}>Last Name</Label>
                    <Input type="text" placeholder="Last Name" className="w-full "/>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <Label className={'ml-4'} htmlFor={"phone"}>Phone</Label>
                    <PhoneInput
                        placeholder="Enter phone number"
                        value={value}
                        name={'phone'}
                        defaultCountry={'ae'}
                        //@ts-ignore
                        onChange={setValue}
                    />
                </div>
                <div>
                    <Label className={'ml-4'} htmlFor={"email"}>Email</Label>
                    <Input type="email" placeholder="example@email.com" className="w-full "/>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <Label className={'ml-4'}  htmlFor={"type"}>Offering Type</Label>
                    <Select>
                        <SelectTrigger className="w-full border  rounded-3xl py-3">
                            <SelectValue placeholder="Property"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="apartment">For Sale</SelectItem>
                            <SelectItem value="villa">For Rent</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className={'ml-4'} htmlFor={"last_name"}>Property Type</Label>
                    <Select>
                        <SelectTrigger className="w-full border  rounded-3xl py-3">
                            <SelectValue placeholder="Property"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="apartment">Apartment</SelectItem>
                            <SelectItem value="villa">Villa</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="office">Office</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="">
                <div>
                    <Label className={'ml-4'} htmlFor={"address"}>Property Address</Label>
                    <Input name={'address'} type="text" placeholder="Property Address"
                           className="w-full "/>
                </div>
            </div>


            <div className="">
                <div>
                    <Label className={'ml-4'} htmlFor={"message"}>Message</Label>
                    <Textarea rows={9} placeholder="Share additional information " className="w-full rounded-3xl "/>
                </div>
            </div>

            <div className=" flex justify-end">
                <div>
                    <Button className={'py-2 w-40 '}> Submit</Button>
                </div>
            </div>
        </div>
    );
}

export default ListPropertyForm;