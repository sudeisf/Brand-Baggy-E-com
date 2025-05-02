"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"; // Add this
import Link from "next/link";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().min(6, "OTP must be 6 characters").max(6),
});

export default function ForgotPasswordPage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {

      otp: "", // Initialize OTP
    },
    mode: "onBlur",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values); // { email: "user@example.com", otp: "123456" }
    router.push("/reset-password");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md mx-auto p-10 font-inter">
      <div className="flex flex-col space-y-2.5 mb-5">
            <h1 className="font-semibold text-[#3A3D44] text-4xl">Enter the otp sent to your email</h1>
            <p className="text-[#999ba0]">Please enter the 6-digit code sent to your email address to verify your account</p>
        </div>
        <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
                <FormItem>
                <FormControl>
                    <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup className="mx-auto">
                        <InputOTPSlot index={0} className="p-5" />
                        <InputOTPSlot index={1} className="p-5" />
                        <InputOTPSeparator className="text-[#47307d]">-</InputOTPSeparator> {/* Add separator */}
                        <InputOTPSlot index={2} className="p-5" />
                        <InputOTPSlot index={3} className="p-5" />
                        <InputOTPSeparator className="text-[#47307d]">-</InputOTPSeparator> {/* Add separator */}
                        <InputOTPSlot index={4} className="p-5" />
                        <InputOTPSlot index={5} className="p-5" />
                    </InputOTPGroup>
                    </InputOTP>
                </FormControl>
                <FormMessage />
                </FormItem>
                 )}
                 />
                 

        <Button type="submit" className="w-full bg-[#47307d] hover:bg-[#665292] h-10 font-medium">
          Verify OTP
        </Button>
        <div className="flex justify-center align-middle font-inter gap-2">
            <p
            className="text-sm  font-medium font-inter"
            >Didn't receive the OTP?</p>
            <Link
            href = "/forgot-password"
            className="text-sm text-[#47307d] font-medium font-inter"
            >Resend OTP</Link>
        </div>

      </form>
    </Form>
  );
}