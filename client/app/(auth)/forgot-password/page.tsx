"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"

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
import Link from "next/link"

const formSchema = z.object({
    email: z.string().email("Invalid email address")
});

export default function ForgotPasswordPage() {
  
const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver : zodResolver(formSchema),
    defaultValues : {
        email : "",
    },
    mode: "onBlur"
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }



  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md mx-auto p-10 font-inter">
        <div className="flex flex-col space-y-2.5 mb-5">
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
         
         <Button 
            className="w-full bg-[#47307d] hover:bg-[#665292] h-10 font-medium" 
            onClick={(e) => {
                e.preventDefault();
                router.push('/varify-otp');
            }}
            >
            Reset Password
            </Button>
        <div className="flex justify-center">
            <Link
            href = "/login"
            className="text-sm text-[#47307d] font-medium font-inter"
            >Remembered password ?</Link>
        </div>
      </form>
    </Form>
  )
}


function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

