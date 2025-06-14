"use client"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import DatePickerWithRange from "@/app/profile/components/DatePicker"
import { string, z } from "zod"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Upload, User } from "lucide-react"
import { Pen } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"
import { useEffect } from "react"
import { AddProfileImage } from "@/app/profile/components/AddProfileImage"

const formSchema = z.object({
    firstName   : z.string().min(1).max(50 ,{message: "First name must be less than 50 characters"}).optional().nullable(),
    lastName: z.string().min(1).max(50 ,{message: "Last name must be less than 50 characters"}).optional().nullable(),
    oldPassword: z.string().max(50, {message: "Old password must be less than 50 characters"}).optional().nullable(),
    newPassword: z.string().max(50, {message: "New password must be less than 50 characters"}).optional().nullable(),
    confirmPassword: z.string().max(50, {message: "Confirm password must be less than 50 characters"}).optional().nullable(),
    email: z.string().email().max(50 ,{message: "Email must be less than 50 characters"}).optional().nullable(),
    phone: z.string()
        .min(10)
        .max(20)
        .regex(/^[0-9]+$/, "Phone number can only contain numbers , Remove spaces if any")
        .refine((val) => {
            const cleanNumber = val.replace(/\s+/g, '');
            return cleanNumber.length <= 20;
        }, {
            message: "Phone number must be at least 10 digits",
        })
        .transform((val) => {
            return val.replace(/\s+/g, '');
        }).optional().nullable(),
    birthDate: z.date().refine((val) => val < new Date(new Date().getFullYear() - 18, 0, 1), {
        message: "You must be at least 18 years old",
    }).optional().nullable(),
    gender: z.string().min(1).max(10 ,{message: "Gender must be less than 10 characters"}).optional().nullable(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
})

export default function ProfileDetail() {
    const user  = useAuthStore((state)=>state.user);
    const updateProfileFn  = useAuthStore((state)=>state.updateProfileFn);
    const isLoading = useAuthStore((state)=> state.isLoading)
    const error = useAuthStore((state)=> state.error)
    const deleteUserFn = useAuthStore((state)=> state.deleteUser);


    async function onDelete() {
        toast.promise(
            deleteUserFn(),
            {
                loading: 'Deleting your account...',
                success: 'Account deleted successfully. We hope to see you again!',
                error: 'Failed to delete account. Please try again.',
                duration: 5000,
                position: "top-right",
            }
        )
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          birthDate: new Date(),
          gender: "",
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        },
      });

    useEffect(() => {
        const fetchAndSetProfile = async () => {
          form.reset({
            firstName: user?.first_name || "",
            lastName: user?.last_name || "",
            email: user?.email || "",
            phone: user?.phone_number || "",
            birthDate: user?.birth_date ? new Date(user.birth_date) : new Date(),
            gender: user?.gender || "",
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        };
        fetchAndSetProfile();
      }, [user]);

      const showSuccessToast = (message : string) => {
        toast.success(message, {
          duration: 4000,
          position: "top-right",
          style: {
            background: "linear-gradient(to right, #331d67, #4a2b8f)",
            color: "white",
            border: "1px solid #331d67"
          }
        });
      };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const updatedFields: Record<string, string> = {};
        
        if (data.firstName?.trim() && data.firstName.trim() !== user?.first_name) {
            updatedFields.first_name = data.firstName.trim();
        }
        
        if (data.lastName?.trim() && data.lastName.trim() !== user?.last_name) {
            updatedFields.last_name = data.lastName.trim();
        }
        
        if (data.email?.trim() && data.email.trim().toLowerCase() !== user?.email?.toLowerCase()) {
            updatedFields.email = data.email.trim().toLowerCase();
        }
        
        if (data.phone?.trim()) {
            const formattedPhone = data.phone.replace(/[\s+]/g, '');
            if (formattedPhone !== user?.phone_number) {
                updatedFields.phone_number = formattedPhone;
            }
        }
        
        if (data.birthDate && data.birthDate.toISOString().split('T')[0] !== user?.birth_date) {
            updatedFields.birth_date = data.birthDate.toISOString().split('T')[0];
        }
        
        if (data.gender?.trim() && data.gender.toLowerCase() !== user?.gender?.toLowerCase()) {
            updatedFields.gender = data.gender.toLowerCase();
        }
        if(data.oldPassword && data.newPassword) {
            updatedFields.oldPassword = data.oldPassword;
            updatedFields.newPassword = data.newPassword;
        }

        if (Object.keys(updatedFields).length > 0) {
            const result = await updateProfileFn(updatedFields);
            if(result?.success === true) { 
                showSuccessToast("Profile updated successfully!");
            } else {
                toast.error(typeof error === 'string' ? error : 'Update failed' , {
                    duration: 4000,
                    position: "top-right",
                    style: {
                      background: "#ef4444",
                      color: "white",
                      border: "1px solid #dc2626"
                    }
                })
            }
        } else {
            toast.info("No changes to update" , {
                duration: 2000,
                position: "top-right",
                style: {
                  background : "#331d67",
                  color : "#ffffff",
                  border: "1px solid #331d67"
                }
            });
        }
    }

    return (
        <div className="flex flex-col gap-4 w-full bg-white rounded-md shadow-xs border-gray-200">
            <div className="flex flex-col gap-10 w-full p-4 md:p-10 mt-0 md:mt-4">
                <h1 className="text-[#331d67] text-2xl md:text-3xl font-bold">My details</h1>
                <div className="flex flex-col gap-4 w-full">
                    <div className="flex flex-col gap-4 w-full">
                        <h1 className="text-[#331d67] text-lg font-medium border-b border-gray-200 pb-4">Personal information</h1>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full p-2">    
                            <div className="flex flex-col lg:flex-row justify-between items-start w-full gap-8">
                                <div className="flex flex-col items-start w-full lg:w-[500px] justify-start gap-4">
                                    <Avatar className="w-32 h-32 md:w-40 md:h-40">
                                        <AvatarImage 
                                            src={user?.profile_url || ''} 
                                            alt={`${user?.first_name || user?.username || 'User'}'s profile picture`}
                                            className="object-cover"
                                        />
                                        <AvatarFallback className="bg-gray-100">
                                            <p className="text-6xl font-roboto font-medium">{user?.first_name?.[0] || user?.username?.[0]}</p>
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex items-start gap-2">
                                        <AddProfileImage />
                                        <div className="flex flex-col items-start gap-1">
                                            <p className="text-lg md:text-xl capitalize font-medium">{user?.username}</p>
                                            <p className="text-sm md:text-md text-gray-500 font-medium">{user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col w-full gap-8">    
                                    <div className="flex flex-col md:flex-row gap-4 w-full">
                                        <FormField
                                            control={form.control}
                                            name="firstName"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="text-sm font-medium uppercase">First Name</FormLabel>
                                                    <FormControl>
                                                        <Input  className="w-full p-3 rounded-md text-sm font-medium bg-gray-100"
                                                          {...field}
                                                          value={field.value || ''}
                                                         />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField  
                                            control={form.control}
                                            name="lastName"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="text-sm font-medium uppercase">Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input 
                                                            className="w-full p-3 rounded-md text-sm font-medium bg-gray-100"  
                                                            {...field}
                                                            value={field.value || ''}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-col md:flex-row gap-4 w-full">
                                        <FormField
                                            control={form.control}
                                            name="birthDate"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="text-sm font-medium uppercase">Birth Date</FormLabel>
                                                    <FormControl>
                                                        <DatePickerWithRange field={field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="text-sm font-medium uppercase">Gender</FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            
                                                            value={field.value || ''}
                                                        >
                                                            <SelectTrigger className="w-full rounded-md bg-gray-100">
                                                                <SelectValue defaultValue={field.value || ''} className="text-sm font-medium bg-gray-100"/>
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
                                            <FormItem className="w-full md:w-auto">
                                                <FormLabel className="text-sm font-medium uppercase">Phone</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        type="tel" 
                                                        className="w-48 p-3 rounded-md text-sm font-medium bg-gray-100"  
                                                        placeholder="+251 74 126 234"
                                                        {...field} 
                                                        value={field.value || ''}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-sm text-gray-500">
                                                    Enter phone number in format: +251 74 126 234
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />  
                                    <Button type="submit" disabled={isLoading} className="w-full md:w-32 rounded-md py-5 bg-[#331d67] text-white">Save</Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 w-full">
                                <h1 className="text-[#331d67] text-lg font-medium border-b mt-10 border-gray-200 pb-4">E-mail Address</h1>
                                <div className="flex flex-col lg:flex-row justify-between items-start w-full pt-4 gap-8">
                                    <div className="flex flex-col items-start w-full lg:w-[500px] justify-start gap-1">
                                        <p className="text-sm text-gray-500">Current E-mail Address</p>
                                        <p className="text-sm text-gray-500">your email address is used for login and notifications</p>
                                    </div>
                                    <div className="flex flex-col w-full gap-4">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="text-sm font-medium uppercase">E-mail Address</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                         className="w-52 p-3 rounded-md text-sm font-medium bg-gray-100"  
                                                         {...field}
                                                         value={field.value || ''}
                                                          />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <p className="text-sm text-gray-500">you can change your e-mail address by clicking the button below</p>
                                        <Button type="submit" className="w-full md:w-32 rounded-md py-5 bg-[#331d67] text-white">change e-mail</Button>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 w-full">
                                    <div className="flex flex-col gap-2">
                                        <h1 className="text-[#331d67] text-lg font-medium border-b mt-10 border-gray-200 pb-4">Password</h1>
                                        <div className="flex flex-col lg:flex-row justify-between items-start w-full mt-10 gap-8">
                                            <div className="flex flex-col gap-2 w-full lg:w-[500px] pr-4">
                                                <p className="text-sm text-gray-500">this section is for you to change your password</p>
                                                <p className="text-sm text-gray-500">you can change your password by clicking the button below</p>
                                            </div>
                                            <div className="flex flex-col gap-8 w-full">
                                                <FormField
                                                    control={form.control}
                                                    name="oldPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium uppercase">Old Password</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="********" className="w-52 p-3 rounded-md text-sm font-medium bg-gray-100"  {...field}
                                                                 value={field.value || ''}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="newPassword"
                                                    render={({ field }) => (
                                                        <FormItem>  
                                                            <FormLabel className="text-sm font-medium uppercase">New Password</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="********"   className="w-52 p-3 rounded-md text-sm font-medium bg-gray-100"  {...field}
                                                                 value={field.value || ''}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="confirmPassword"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-sm font-medium uppercase">Confirm Password</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="********" className="w-52 p-3 rounded-md text-sm font-medium bg-gray-100"  {...field}  value={field.value || ''} />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}  
                                                />
                                                <Button type="submit" className="w-full md:w-40 rounded-md py-5 px-4 bg-[#331d67] text-white">change password</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <h1 className="text-[#331d67] text-lg font-medium border-b mt-10 border-gray-200 pb-4">Delete Account</h1>
                                    <p className="text-md text-gray-500 pb-4 pt-4">you can delete your account by clicking the button below</p>
                                    <Button onClick={()=> onDelete()} disabled={isLoading} className="w-full md:w-32 rounded-md py-5 px-4 bg-red-500/80 text-white">delete account</Button>
                                </div>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
}

