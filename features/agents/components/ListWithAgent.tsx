"use client"
import React, {useState} from 'react';
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {PhoneInput} from "react-international-phone";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import 'react-international-phone/style.css';

interface ListWithAgentProps {
    agent: AgentType,
}

function ListWithAgent({agent}: ListWithAgentProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [value, setValue] = useState()
    return (
        <Sheet >
            <SheetTrigger className={'border border-slate-200 py-2 hover:bg-white hover:text-black text-white px-6 rounded-full'}>
                List with {agent.firstName}
            </SheetTrigger>
            <SheetContent className={'max-w-3xl bg-white p-6'}>
                <SheetHeader>
                    <SheetTitle className={'text-2xl'}>
                        Submit your listings to <span className="text-slate-900">{agent.firstName}</span>
                    </SheetTitle>
                </SheetHeader>
                <div className={'grid gap-6 px-6 py-12'}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <Label className={'ml-4'} htmlFor={"first_name"}>First Name</Label>
                            <Input name={'first_name'} type="text" placeholder="First Name"
                                   className="w-full text-slate-600"/>
                        </div>
                        <div>
                            <Label className={'ml-4'} htmlFor={"last_name"}>Last Name</Label>
                            <Input type="text" placeholder="Last Name" className="w-full text-slate-600"/>
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
                            <Input type="email" placeholder="example@email.com" className="w-full text-slate-600"/>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <Label className={'ml-4'} htmlFor={"type"}>Offering Type</Label>
                            <Select>
                                <SelectTrigger className="w-[100%] rounded-3xl py-2.5">
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
                                <SelectTrigger className="w-[100%] rounded-3xl py-3">
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
                                   className="w-full text-slate-600"/>
                        </div>
                    </div>


                    <div className="">
                        <div>
                            <Label className={'ml-4'} htmlFor={"message"}>Message</Label>
                            <Textarea rows={9} placeholder="Share additional information "
                                      className="w-full rounded-3xl text-slate-600"/>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button> Submit</Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default ListWithAgent;