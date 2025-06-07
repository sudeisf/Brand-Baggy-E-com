"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { LoaderCircle } from "lucide-react"
import { useState } from "react"

const formSchema = z.object({
    password:  z.string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters"),
    confirmPassword: z.string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be less than 32 characters")
  }).refine((data)=> data.password === data.confirmPassword ,{
    message: "Passwords don't match",
    path: ["confirmPassword"] 
  });

export default function NewPasswordPage() {
  
  const router = useRouter();
  const newPassword = useAuthStore((state) => state.newPassword);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const [redirecting, setRedirecting] = useState<Boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver : zodResolver(formSchema),
    defaultValues : {
        password : "",
        confirmPassword: ""
    },
    mode: "onBlur"
  })

   async function onSubmit(values: z.infer<typeof formSchema>) {
    try{
      const result = await newPassword(values.password, values.confirmPassword);
      if (result?.success) {
        setRedirecting(true)
        setTimeout(() => {
          router.replace('/login');
        }, 100);
      }else{
        if (result?.fieldErrors?.password) {
          form.setError("password", {
            type: 'server',
            message: result.fieldErrors.password
          });
        }
        if (result?.fieldErrors?.confirmPassword) {
          form.setError("confirmPassword", {
            type: 'server',
            message: result.fieldErrors.confirmPassword
          });
        }
        if (result?.error) {
          form.setError("root", {
            message: result.error
          });
        }
      }
    }catch(error){
      console.error("Submission error:", error);
      form.setError("root", {
        message: "An unexpected error occurred"
      });
    }
  }



  return (
  <>
     { isLoading || redirecting ? (
         <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
         <LoaderCircle className="w-8 h-8 animate-spin text-[#47307d]" />
         <p className="text-lg font-medium text-[#3A3D44]">Setting you new password...</p>
       </div>
     ) : (
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto p-2 md:p-10 font-inter">
        <div className="flex flex-col space-y-2.5 mb-10 md:mt-0 mt-10">
            <h1 className="font-semibold text-[#3A3D44] text-4xl">Create new Password</h1>
            <p className="text-[#999ba0]">Create your password if you forgot it , then you have to do forget password again</p>
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="font-medium">Password</FormLabel>
              <FormControl>
                <Input
                type="password"
                 className="rounded-sm text-md tracking-widest"
                 placeholder="••••••••••••"   {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="font-medium">Confirm password</FormLabel>
              <FormControl>
                <Input
                 className="rounded-sm text-md tracking-widest"
                 type="password"
                 placeholder="••••••••••••"  
                 {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
         className="w-full bg-[#47307d] hover:bg-[#665292] h-10 font-medium" 
         type="submit"
         disabled={isLoading}
         >
          {isLoading ?<LoaderCircle className="animate-spin" /> : "Confirm"}
        </Button>
      </form>
    </Form>
    )
  }
  </>
)
}




