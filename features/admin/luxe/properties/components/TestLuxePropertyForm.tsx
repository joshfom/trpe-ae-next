"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function TestLuxePropertyForm() {
    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>Test Luxe Property Form</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Property Title</label>
                        <Input placeholder="Enter property title" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Slug</label>
                        <Input placeholder="property-slug" />
                    </div>
                    <Button>Save Property</Button>
                </CardContent>
            </Card>
        </div>
    );
}

export default TestLuxePropertyForm;
