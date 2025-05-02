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
  
    const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver : zodResolver(formSchema),
    defaultValues : {
        password : "",
        confirmPassword: ""
    },
    mode: "onBlur"
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
    router.push('/login')
  }



  return (
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
        <Button className="w-full bg-[#47307d] hover:bg-[#665292] h-10 font-medium" type="submit">Confirm</Button>
      </form>
    </Form>
  )
}




