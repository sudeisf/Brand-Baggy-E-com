"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useAuthStore } from "@/store/authStore"
import { LoaderCircle } from "lucide-react"

const formSchema = z.object({
    email: z.string().email("Invalid email address")
});

export default function ForgotPasswordPage() {
const isLoading  = useAuthStore((state)=> state.isLoading)
const sendEmail = useAuthStore((state)=> state.sendEmail)
const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver : zodResolver(formSchema),
    defaultValues : {
        email : "",
    },
    mode: "onBlur"
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    form.clearErrors();
    
    const result = await sendEmail(values.email);

    if (!result) {
      form.setError("root", {
          message: "No response from server"
      });
      return;
  }

     // Handle success case first
     if (result.success) {
      // Optional: Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      return router.push('/verify-otp');  // Note: Fixed typo in 'verify-otp'
  }

    if (result.fieldErrors?.email) {
        
        form.setError("email", {
            type: 'server',
            message: result.fieldErrors.email
        });
    } else if (result.error) {
        
        form.setError("root", { 
            message: result.error 
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md mx-auto p-2 md:p-10 font-inter">
        <div className="flex flex-col space-y-2.5 mb-10 mt-10 md:mt-0 md:mb-5">
            <h1 className="font-semibold text-[#3A3D44] text-4xl">Reset Your Password</h1>
            <p className="text-[#999ba0]">Please enter your email and we will send you an otp code to reset your password in the next step</p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormControl>
                <Input
                className="rounded-sm px-5 py-5"
                 placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         
         <Button disabled={isLoading || !form.formState.isValid} className="w-full bg-[#47307d] hover:bg-[#665292] h-10 font-medium" type="submit">
        {
            isLoading ? <LoaderCircle className="animate-spin" /> : "Rest"
          }
        </Button>
        <div className="flex justify-center">
            <Link
            href = "/login"
            className="text-md  text-[#47307d]  font-inter"
            >Remembered password ?</Link>
        </div>
      </form>
    </Form>
  )
}



