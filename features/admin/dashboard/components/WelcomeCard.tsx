"use client"
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface WelcomeCardProps {
  username?: string;
  loading?: boolean;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ 
  username = 'Admin',
  loading = false
}) => {
  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  
  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon";
  } else if (currentHour >= 18) {
    greeting = "Good evening";
  }
  
  return (
    <Card className="mb-6 bg-linear-to-r from-blue-500 to-purple-600 text-white">
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            {loading ? (
              <>
                <Skeleton className="h-6 w-40 bg-white/30" />
                <Skeleton className="h-8 w-64 bg-white/30" />
              </>
            ) : (
              <>
                <p className="text-blue-100">{new Date().toLocaleDateString()}</p>
                <h2 className="text-2xl font-bold">
                  {greeting}, {username}!
                </h2>
                <p className="text-blue-100">Welcome to your workspace dashboard</p>
              </>
            )}
          </div>
          
          {loading ? (
            <Skeleton className="h-16 w-16 rounded-full bg-white/30" />
          ) : (
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-3xl">{username.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeCard;
