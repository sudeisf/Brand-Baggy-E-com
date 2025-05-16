"use client"

import { Rubik } from "next/font/google"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { DatePickerForm } from "@/app/profile/components/DatePicker"
import { z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"
import { Pen } from "lucide-react"
const rubik = Rubik({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
})
const formSchema = z.object({
    firstName   : z.string().min(1).max(50 ,{message: "First name must be less than 50 characters"}),
    lastName: z.string().min(1).max(50 ,{message: "Last name must be less than 50 characters"}),
    oldPassword: z.string().min(1).max(50 ,{message: "Old password must be less than 50 characters"}),
    newPassword: z.string().min(1).max(50 ,{message: "New password must be less than 50 characters"}),
    confirmPassword: z.string().min(1).max(50 ,{message: "Confirm password must be less than 50 characters"}),
    email: z.string().email().max(50 ,{message: "Email must be less than 50 characters"}),
    phone: z.string().min(1).max(15).regex(/^[0-9]+$/).refine((val) => val.length === 10, {
        message: "Phone number must be 10 digits",
    }),
    birthDate: z.date().refine((val) => val < new Date(new Date().getFullYear() - 18, 0, 1), {
        message: "You must be at least 18 years old",
    }),
    gender: z.string().min(1).max(10 ,{message: "Gender must be less than 10 characters"}),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
})

const personalInfo ={
    firstName: "Jhon",
    lastName: "Doe",
    email: "jhon.doe@example.com",
    phone: "1234567890",
    birthDate: new Date("1990-01-01"),
    gender: {
        label: "Male",
        value: "male",
    },
}

export default function MyAccount() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: personalInfo.firstName,
            lastName: personalInfo.lastName,
            email: personalInfo.email,
            phone: personalInfo.phone,
            birthDate: personalInfo.birthDate,
            gender: personalInfo.gender.value,
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },

    })
    const onSubmit = (data: z.infer<typeof formSchema>) => {
        console.log(data)
    }


    return (
        <div className="flex flex-col gap-4 w-full bg-white rounded-md border-2 border-gray-200">
            <div className="flex flex-col gap-10 w-full p-10 mt-4">
                <h1 className={`${rubik.className} text-[#331d67] text-3xl font-bold`}>My details</h1>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-4 w-full">
                        <h1 className={`${rubik.className} text-[#331d67] text-lg font-medium border-b border-gray-200 pb-4`}>Personal information</h1>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full p-2">    
                            <div className="flex justify-between items-start w-full ">
                                  
                                    <div className="flex flex-col items-start w-[500px] justify-start gap-4">
                                        <Avatar className="w-40 h-40">
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>
                                                <User className="w-10 h-10" />
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex items-start gap-2">
                                            <Pen className="w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700" />
                                            <div className="flex flex-col items-start gap-1">
                                                <p className="text-xl capitalize font-medium">John Doe</p>
                                                <p className="text-md text-gray-500 font-medium">john.doe@example.com</p>
                                            </div>
                                            
                                        </div>
                                    </div>
                                
                                <div className="flex flex-col w-full gap-8">    
                                    <div className="flex gap-4 w-full">
                                        <FormField
                                            control={form.control}
                                        name="firstName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={`${rubik.className} text-sm font-medium uppercase`}>First Name</FormLabel>
                                            <FormControl>
                                                <Input className="w-full p-3 rounded-md text-sm font-medium bg-gray-100"  {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                />
                                <FormField  
                                    control={form.control}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={`${rubik.className} text-sm font-medium uppercase`}>Last Name</FormLabel>
                                            <FormControl>
                                                <Input className="w-full p-3 rounded-md text-sm font-medium bg-gray-100"  {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                </div>
                                <div className="flex gap-4 w-full">
                                    <FormField
                                        control={form.control}
                                        name="birthDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={`${rubik.className} text-sm font-medium uppercase`}>Birth Date</FormLabel>
                                                <FormControl>
                                                    <DatePickerForm field={field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className={`${rubik.className} text-sm font-medium uppercase`}>Gender</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue="Male"
                                                    >
                                                        <SelectTrigger className="w-full rounded-md bg-gray-100">
                                                            <SelectValue defaultValue={field.value} className="text-sm font-medium bg-gray-100"/>
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-md text-sm font-medium">
                                                            <SelectItem className="rounded-md" value="male">Male</SelectItem>
                                                            <SelectItem className="rounded-md" value="female">Female</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />  

                                </div>
                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className={`${rubik.className} text-sm font-medium uppercase`}>Phone</FormLabel>
                                            <FormControl>
                                                <Input  type="tel" className="w-48 p-3 rounded-md text-sm font-medium bg-gray-100"  {...field} />
                                            </FormControl>
                                            <FormDescription className="text-sm text-gray-500">keep 9-digit format with no spaces and dashes</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />  
                                  <Button type="submit" className="w-32 rounded-md py-5 bg-[#331d67] text-white">Save</Button>
                            </div>
                            </div>

                            <div className="flex flex-col gap-4 w-full">
                                <h1 className={`${rubik.className} text-[#331d67] text-lg font-medium border-b mt-10 border-gray-200 pb-4`}>E-mail Address</h1>
                                <div className="flex justify-between items-start w-full pt-4">
                                    <div className="flex flex-col items-start w-[500px] justify-start gap-1">
                                        <p className="text-sm text-gray-500">Current E-mail Address</p>
                                        <p className="text-sm text-gray-500">your email address is used for login and notifications</p>
                                    </div>
                                    <div className="flex flex-col w-full gap-4 ">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormLabel className={`${rubik.className} text-sm font-medium uppercase`}>E-mail Address</FormLabel>
                                                <FormControl>
                                                    <Input className="w-52 p-3 rounded-md text-sm font-medium bg-gray-100"  {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <p className="text-sm text-gray-500">you can change your e-mail address by clicking the button below</p>
                                    <Button className="w-32 rounded-md py-5 bg-[#331d67] text-white">change e-mail</Button>
                                    </div>
                                   
                                </div>
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="flex flex-col gap-2">
                                        <h1 className={`${rubik.className} text-[#331d67] text-lg font-medium border-b mt-10 border-gray-200 pb-4`}>Password</h1>
                                        <div className="flex justify-between items-start w-full mt-10">
                                        <div className="flex flex-col gap-2 w-[500px] pr-4">
                                            <p className="text-sm text-gray-500">this section is for you to change your password</p>
                                            <p className="text-sm text-gray-500">you can change your password by clicking the button below</p>
                                        </div>
                                         <div className="flex flex-col gap-8 w-full">
                                            <FormField
                                                control={form.control}
                                                name="oldPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className={`${rubik.className} text-sm font-medium uppercase`}>Old Password</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="********" className="w-52 p-3 rounded-md text-sm font-medium bg-gray-100"  {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="newPassword"
                                                render={({ field }) => (
                                                    <FormItem>  
                                                        <FormLabel className={`${rubik.className} text-sm font-medium uppercase`}>New Password</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="********"   className="w-52 p-3 rounded-md text-sm font-medium bg-gray-100"  {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="confirmPassword"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className={`${rubik.className} text-sm font-medium uppercase`}>Confirm Password</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="********" className="w-52 p-3 rounded-md text-sm font-medium bg-gray-100"  {...field} />
                                                        </FormControl>
                                                    </FormItem>
                                                )}  
                                            />
                                            <Button className="w-40 rounded-md py-5 px-4 bg-[#331d67] text-white">change password</Button>
                                         </div>
                                        </div>
                        
                                        
    
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 ">
                                    <h1 className={`${rubik.className} text-[#331d67] text-lg font-medium border-b mt-10 border-gray-200 pb-4`}>Delete Account</h1>
                                    <p className="text-md text-gray-500 pb-4 pt-4">you can delete your account by clicking the button below</p>
                                    <Button className="w-32 rounded-md py-5 px-4 bg-red-500/80 text-white">delete account</Button>
                                </div>
                            </div>

                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
