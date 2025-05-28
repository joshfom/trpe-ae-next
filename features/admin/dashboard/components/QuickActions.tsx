"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Building, BookText, Award, UserPlus, Package } from "lucide-react";
import Link from "next/link";

const QuickActions: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link href="/admin/properties/create">
            <span className="flex items-center">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Property
            </span>
          </Link>
        
         <Link href="/admin/communities/create">
            <span className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              Add Community
            </span>
          </Link>
        
        <Link href="/admin/insights/create">
            <span className="flex items-center">
              <BookText className="mr-2 h-4 w-4" />
              Add Insight
            </span>
          </Link>

       <Link href="/admin/developers/create">
            <span className="flex items-center">
              <Award className="mr-2 h-4 w-4" />
              Add Developer
            </span>
          </Link>
        
         <Link href="/admin/off-plans/create">
            <span className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              Add Off-Plan
            </span>
          </Link>
        
      <Link href="/admin/agents/create">
            <span className="flex items-center">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Agent
            </span>
          </Link>
      </div>
    </div>
  );
};

export default QuickActions;
