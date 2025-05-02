"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"

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
    email: z.string().email("Invalid email address"),
    username: z.string()
    .min(6 , "username must have 6 charachters")
    .max(10, "username must not be more than 10 charachters"),
    password: z.string()
      .min(8, "Password must be at least 8 characters")
      .max(32, "Password must be less than 32 characters"),
    confirmPassword : z.string()
    .min(8, "Password must be at least 8 characters")
    .max(32, "Password must be less than 32 characters"),
  }).refine((data) =>data.password === data.confirmPassword ,{
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export default function RegisterPage() {
  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver : zodResolver(formSchema),
    defaultValues : {
        email : "",
        username: "",
        password: "",
        confirmPassword : ""
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-md mx-auto p-5 md:p-10 font-inter">
        <div className="flex flex-col space-y-2.5 mb-10">
            <h1 className="font-semibold text-[#3A3D44] text-4xl">Welcome</h1>
            <p className="text-[#999ba0]">Welcome, Experience new ways and views</p>
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="font-medium">Email</FormLabel>
              <FormControl>
                <Input
                className="rounded-sm"
                 placeholder="Enter your email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="font-medium">Username</FormLabel>
              <FormControl>
                <Input
                className="rounded-sm"
                 placeholder="Enter your username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <FormLabel className="font-medium">Password</FormLabel>
              <FormControl>
                <Input
                 className="rounded-sm text-xl tracking-widest"
                 type="password"
                 placeholder="••••••••"  
                 {...field} />
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
              <FormLabel className="font-medium">Confirm Password</FormLabel>
              <FormControl>
                <Input
                 className="rounded-sm text-xl tracking-widest"
                 type="password"
                 placeholder="••••••••"  
                 {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full bg-[#47307d] hover:bg-[#665292] h-10 font-medium" type="submit">Sign Up</Button>
        <div className="flex justify-center gap-0.5 align-bottom">
            <div className="flex items-center gap-2">
                <p className=" text-md text-slate-600 ">Already have an account ?</p>
            </div>
            <div>
            <Link 
                href="/login" 
                className="font-medium text-md text-[#47307d]"
                >
                Sign in
            </Link>
            </div>
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

