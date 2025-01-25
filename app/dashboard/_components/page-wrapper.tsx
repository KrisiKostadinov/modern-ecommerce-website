import { ReactNode } from "react";

type PageWrapperProps = {
  children: ReactNode;
};

export default function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="min-h-screen max-w-[1440px] mx-auto max-2xl:px-5">
      {children}
    </main>
  );
}
