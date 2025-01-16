"use client";

import { ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AuthWrapperProps = {
  title: string;
  children: ReactNode;
};

export default function AuthWrapper({ title, children }: AuthWrapperProps) {
  return (
    <Card className="max-w-md mx-auto rounded border overflow-hidden mt-10 max-sm:mx-5">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
