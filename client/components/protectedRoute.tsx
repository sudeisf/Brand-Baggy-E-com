"use client"

import { useAuthStore } from "@/store/authStore";
import { RotateCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ProtectedRouteProps = {
    children : React.ReactNode,
    allowedRoles : Array<"seller" | "buyer" | "admin">
}   

export default function ProtectedRoute({children , allowedRoles} : ProtectedRouteProps){
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const checkAuth = useAuthStore((state) => state.checkAuth);
    const isLoading = useAuthStore((state) => state.isLoading);
    const user = useAuthStore((state) => state.user);
    const hasHydrated = useAuthStore((state) => state._hasHydrated);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
        }, [checkAuth]);

    useEffect(() => {
        if (!hasHydrated) return;
        if (isLoading) return;

        if (!isAuthenticated) {
        router.push("/login");
        return;
        }

        if (allowedRoles && user && !allowedRoles.includes(user.user_role)) {
        // Role-based redirection
        const redirectPath = user.user_role === "buyer" 
            ? "/home" 
            : user.user_role === "seller" 
            ? "/seller-dashboard" 
            : "/admin";
        router.push(redirectPath);
        }
    }, [isAuthenticated, isLoading, user, router, allowedRoles, hasHydrated]);

    if (!hasHydrated || isLoading) {
        return <Loading />;
      }
      if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.user_role))) {
        return <Loading />; 
      }
    
    return(
        <div>
            {children}
        </div>
    )
}   
const Loading = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
          <RotateCw className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }