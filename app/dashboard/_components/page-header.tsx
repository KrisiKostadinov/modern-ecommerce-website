import { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type ButtonProps = {
  text: String;
  icon: ReactNode;
  link?: String | null;
  callback?: () => void;
};

type PageHeaderProps = {
  heading: String;
  loading?: boolean;
  button?: ButtonProps | null;
};

export default function PageHeader({
  heading,
  loading,
  button,
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center my-5">
      <h1 className="text-2xl font-semibold">{heading}</h1>
      {button && (
        <Button onClick={button.callback} disabled={loading}>
          {button.icon}
          <span>{button.text}</span>
        </Button>
      )}
    </div>
  );
}