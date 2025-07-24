'use client';

import { ReactNode, useEffect } from "react";
import { auth } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { userId } = await auth();
      if (!userId) {
        router.push("/sign-in");
      }
    };

    checkAuth();
  }, []);

  return <>{children}</>;
}
