"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LoaderCircle } from "lucide-react"
import { Combobox } from "@/components/ui/combobox"
import { useState } from "react"

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
    role: z.string().min(1, "Role is required"), 
  }).refine((data) =>data.password === data.confirmPassword ,{
    message: "Passwords don't match",
    path: ["confirmPassword"]
  });

export default function RegisterPage() {
  

  const isLoading  = useAuthStore((state)=> state.isLoading);
  const error  = useAuthStore((state)=> state.error);
  const register = useAuthStore((state)=> state.register);
  const [redirecting, setRedirecting] = useState<Boolean>(false);
  const router = useRouter()


  const form = useForm<z.infer<typeof formSchema>>({
    resolver : zodResolver(formSchema),
    defaultValues : {
        email : "",
        username: "",
        password: "",
        confirmPassword : "",
        role: ""
    },
    mode: "onChange"
  })


 async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        form.clearErrors();
        const result = await register(
            values.email,
            values.username,
            values.password,
            values.confirmPassword,
            values.role
        );

        if (result?.success) {
            setRedirecting(true);
            setTimeout(() => {
                router.replace("/login");
            }, 100);
            return;
        }

        if (!result) {
            form.setError("root", { 
                message: "Registration failed. Please try again." 
            });
            return;
        }

        if ('fieldErrors' in result && result.fieldErrors) {
            const fieldMapping: Record<string, keyof typeof values> = {
                username: 'username',
                email: 'email',
                password: 'password',
                confirm_password: 'confirmPassword',
                role: 'role'
            };

            Object.entries(result.fieldErrors).forEach(([field, message]) => {
                const formField = fieldMapping[field];
                if (formField) {
                    form.setError(formField, {
                        type: 'server',
                        message: message
                    });
                } else {
                    form.setError("root", { 
                        message: `${field}: ${message}` 
                    });
                }
            });
        }

        if (result.error && (!result.fieldErrors || Object.keys(result.fieldErrors).length === 0)) {
            form.setError("root", { message: result.error });
        }
    } catch (error) {
        form.setError("root", { 
            message: "An unexpected error occurred. Please try again." 
        });
    }
}


  return (
    <>
    {
        isLoading || redirecting ? (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <LoaderCircle className="w-8 h-8 animate-spin text-[#47307d]" />
        <p className="text-lg font-medium text-[#3A3D44]">Registering you in...</p>
      </div>
      ) :(
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
        <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Role</FormLabel>
                <FormControl>
                  <Combobox {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {form.formState.errors.root && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
              {form.formState.errors.root.message}
            </div>
          )}

        <Button disabled={ isLoading || !form.formState.isValid} className="w-full bg-[#47307d] hover:bg-[#665292] h-10 font-medium" type="submit">
        {
            isLoading ? <LoaderCircle className="animate-spin" /> : "Sign Up"
          }
        </Button>
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
    </>
    
  )
}


