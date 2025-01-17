"use client";

import React, { ReactNode } from "react";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AlertProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function CustomAlert({ icon, title, description }: AlertProps) {
  return (
    <Alert>
      {icon}
      <div className="ml-2">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          {description}
        </AlertDescription>
      </div>
    </Alert>
  );
}
