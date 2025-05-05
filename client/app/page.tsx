"use client"
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
       <main className="">
        <p className="w-[50%] mx-auto p-5 bg-amber-200 text-white font-mono capitalize mt-5 rounded-md    hover:w-[70%] hover:rounded-4xl transition-all duration-300 ease-in-out">55y first progress</p>
        <Button onClick={() => {
          useAuthStore.getState().logout();
          router.push('/login');
        }}>Logout</Button>
       </main>
  );
}
