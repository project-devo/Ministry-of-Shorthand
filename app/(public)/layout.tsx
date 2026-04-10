import type { ReactNode } from "react";
import { Footer } from "@/components/public/Footer";

const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <Footer />
    </>
  );
};

export default PublicLayout;
