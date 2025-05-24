"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Building, BookText, Award, UserPlus, Package } from "lucide-react";

const QuickActions: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button variant="outline" className="justify-start" asChild>
          <a href="/admin/properties/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Property
          </a>
        </Button>
        
        <Button variant="outline" className="justify-start" asChild>
          <a href="/admin/communities/create">
            <Building className="mr-2 h-4 w-4" />
            Add Community
          </a>
        </Button>
        
        <Button variant="outline" className="justify-start" asChild>
          <a href="/admin/insights/create">
            <BookText className="mr-2 h-4 w-4" />
            Add Insight
          </a>
        </Button>
        
        <Button variant="outline" className="justify-start" asChild>
          <a href="/admin/developers/create">
            <Award className="mr-2 h-4 w-4" />
            Add Developer
          </a>
        </Button>
        
        <Button variant="outline" className="justify-start" asChild>
          <a href="/admin/off-plans/create">
            <Package className="mr-2 h-4 w-4" />
            Add Off-Plan
          </a>
        </Button>
        
        <Button variant="outline" className="justify-start" asChild>
          <a href="/admin/agents/create">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Agent
          </a>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
