"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"
import { Camera, Loader2, Save, User } from "lucide-react"

export function ProfileSettings() {
  const user = useAuthStore((state) => state.user)
  const updateProfileFn = useAuthStore((state) => state.updateProfileFn)
  const profilImageUpload = useAuthStore((state) => state.profilImageUpload)
  const isLoading = useAuthStore((state) => state.isLoading)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [gender, setGender] = useState("")

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "")
      setLastName(user.last_name || "")
      setEmail(user.email || "")
      setPhone(user.phone_number || "")
      setGender(user.gender || "")
    }
  }, [user])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("profile_image", file)

    toast.promise(profilImageUpload(formData), {
      loading: "Uploading profile image...",
      success: "Profile image updated!",
      error: "Failed to upload image.",
      position: "top-right",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const updatedFields: Record<string, string> = {}

    if (firstName.trim() && firstName.trim() !== user?.first_name) {
      updatedFields.first_name = firstName.trim()
    }
    if (lastName.trim() && lastName.trim() !== user?.last_name) {
      updatedFields.last_name = lastName.trim()
    }
    if (email.trim() && email.trim().toLowerCase() !== user?.email?.toLowerCase()) {
      updatedFields.email = email.trim().toLowerCase()
    }
    if (phone.trim()) {
      const formattedPhone = phone.replace(/[\s+]/g, "")
      if (formattedPhone !== user?.phone_number) {
        updatedFields.phone_number = formattedPhone
      }
    }
    if (gender && gender !== user?.gender) {
      updatedFields.gender = gender
    }

    if (Object.keys(updatedFields).length === 0) {
      toast.info("No changes to update", { position: "top-right" })
      return
    }

    const result = await updateProfileFn(updatedFields)
    if (result?.success) {
      toast.success("Profile updated successfully!", { position: "top-right" })
    } else {
      toast.error("Failed to update profile", { position: "top-right" })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-5" />
          Profile Settings
        </CardTitle>
        <CardDescription>
          Update your personal information and profile picture.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="profile-form">
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="size-20 ring-2 ring-border ring-offset-2 ring-offset-background transition-all group-hover:ring-primary/50">
                  <AvatarImage
                    src={user?.profile_url || ""}
                    alt={`${user?.first_name || user?.username || "User"}'s avatar`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {user?.first_name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-1 -right-1 flex size-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform hover:scale-110"
                >
                  <Camera className="size-3.5" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <p className="text-xs text-muted-foreground">
                  Recommended size: 400×400px
                </p>
              </div>
            </div>

            <Separator />

            {/* Name Fields */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input
                  id="first-name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input
                  id="last-name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Used for login and notifications.
              </p>
            </div>

            {/* Phone & Gender */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+251 74 126 234"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end border-t pt-6">
        <Button type="submit" form="profile-form" disabled={isLoading} className="gap-2">
          {isLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  )
}
