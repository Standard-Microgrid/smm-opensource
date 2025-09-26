"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function OrganizationSetup() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // TODO: Implement organization setup logic
    console.log("Organization setup form submitted");
    
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              placeholder="Enter your organization name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="organizationType">Organization Type</Label>
            <Input
              id="organizationType"
              placeholder="e.g., Minigrid Operator, Energy Company"
              required
            />
          </div>
          
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Setting up..." : "Complete Setup"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
