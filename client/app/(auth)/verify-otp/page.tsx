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
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";

const formSchema = z.object({
  otp: z.string()
    .regex(/^\d+$/, "OTP must contain only numbers")
    .min(6, "OTP must be 6 digits")
    .max(6),
});

export default function OtpPage() {
  const isLoading = useAuthStore((state) => state.isLoading);
  const otpVerify = useAuthStore((state) => state.otpVerify);
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  // Debug form state
  useEffect(() => {
    console.log("Current OTP value:", form.getValues().otp);
    console.log("Form validity:", form.formState.isValid);
  }, [form.watch("otp")]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitting OTP:", values.otp);
    const inputValue = String(values.otp)
    console.log("Input Value:", inputValue);
    try {
      const result = await otpVerify(inputValue);
      
      if (result?.success) {
        router.push('/new-password');
      } else {
        if (result?.fieldErrors?.otp) {
          form.setError("otp", {
            type: 'server',
            message: result.fieldErrors.otp
          });
        }
        if (result?.error) {
          form.setError("root", {
            message: result.error
          });
        }
      }
    } catch (error) {
      console.error("Submission error:", error);
      form.setError("root", {
        message: "An unexpected error occurred"
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full max-w-md mx-auto p-2 md:p-10 font-inter">
        <div className="flex flex-col space-y-2.5 mb-10 md:mb-5 mt-10 md:mt-0">
          <h1 className="font-semibold text-[#3A3D44] text-4xl">Enter the OTP sent to your email</h1>
          <p className="text-[#999ba0]">Please enter the 6-digit code sent to your email address</p>
        </div>

        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP 
                  maxLength={6}
                  value={field.value}
                  onChange={e => {
                    // Only allow numeric input
                    const numericValue = e.replace(/\D/g, '');
                    field.onChange(numericValue);
                  }}
                  onBlur={field.onBlur}
                  ref={field.ref}
                >
                  <InputOTPGroup className="mx-auto">
                    <InputOTPSlot index={0} className="p-5" />
                    <InputOTPSlot index={1} className="p-5" />
                    <InputOTPSeparator className="text-[#47307d]">-</InputOTPSeparator>
                    <InputOTPSlot index={2} className="p-5" />
                    <InputOTPSlot index={3} className="p-5" />
                    <InputOTPSeparator className="text-[#47307d]">-</InputOTPSeparator>
                    <InputOTPSlot index={4} className="p-5" />
                    <InputOTPSlot index={5} className="p-5" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-[#47307d] hover:bg-[#665292] h-10 font-medium"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Verify OTP"}
        </Button>

        <div className="flex justify-center align-middle font-inter gap-2">
          <p className="text-md text-[#73777e] font-normal font-inter">
            Didn't receive the OTP?
          </p>
          <Link
            href="/forgot-password"
            className="text-md text-[#47307d] font-medium font-inter"
          >
            Resend OTP
          </Link>
        </div>
      </form>
    </Form>
  );
}