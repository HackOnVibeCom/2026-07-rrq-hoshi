"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard/x");
      } else {
        router.push("/?auth=required");
      }
    };
    checkUser();
  }, [router, supabase]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg text-muted">
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <span className="text-sm font-medium">Redirecting...</span>
      </div>
    </div>
  );
}
