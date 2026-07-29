"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/store/authStore"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, Shield, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function SecuritySettings() {
  const updateProfileFn = useAuthStore((state) => state.updateProfileFn)
  const deleteUserFn = useAuthStore((state) => state.deleteUser)
  const isLoading = useAuthStore((state) => state.isLoading)

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All password fields are required.", { position: "top-right" })
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.", { position: "top-right" })
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.", { position: "top-right" })
      return
    }

    const result = await updateProfileFn({
      oldPassword,
      newPassword,
    })

    if (result?.success) {
      toast.success("Password updated successfully!", { position: "top-right" })
      setOldPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      toast.error("Failed to update password. Check your current password.", { position: "top-right" })
    }
  }

  const handleDeleteAccount = async () => {
    toast.promise(deleteUserFn(), {
      loading: "Deleting your account...",
      success: "Account deleted successfully.",
      error: "Failed to delete account.",
      position: "top-right",
    })
    setDeleteDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} id="password-form">
            <div className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showOld ? "text" : "password"}
                    placeholder="Enter current password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showOld ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <Separator />

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Hint */}
              {newPassword && (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Password requirements:</p>
                  <ul className="space-y-1 text-xs">
                    <li className={newPassword.length >= 8 ? "text-emerald-600" : "text-muted-foreground"}>
                      {newPassword.length >= 8 ? "✓" : "○"} At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? "text-emerald-600" : "text-muted-foreground"}>
                      {/[A-Z]/.test(newPassword) ? "✓" : "○"} One uppercase letter
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? "text-emerald-600" : "text-muted-foreground"}>
                      {/[0-9]/.test(newPassword) ? "✓" : "○"} One number
                    </li>
                    <li className={newPassword === confirmPassword && confirmPassword ? "text-emerald-600" : "text-muted-foreground"}>
                      {newPassword === confirmPassword && confirmPassword ? "✓" : "○"} Passwords match
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end border-t pt-6">
          <Button type="submit" form="password-form" disabled={isLoading} className="gap-2">
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Shield className="size-4" />
            )}
            Update Password
          </Button>
        </CardFooter>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="size-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action
            cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="gap-2">
                <Trash2 className="size-4" />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account, store data, products, and remove all associated data
                  from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="gap-2"
                >
                  <Trash2 className="size-4" />
                  Yes, delete my account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
