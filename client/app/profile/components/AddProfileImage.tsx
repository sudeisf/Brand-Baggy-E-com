import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pen, Upload, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { useAuthStore } from "@/store/authStore"

export function AddProfileImage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const profilImageUploadFn = useAuthStore((state)=>state.profilImageUpload)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }
  const submitImage = async () => {
    if (!selectedImage) return;
    try {
      const formData = new FormData();
      formData.append('profile_image', selectedImage);
      await profilImageUploadFn(formData);
      setSelectedImage(null);
      setPreviewUrl("");
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setPreviewUrl("")
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
      <div className="gap-2">
          <Pen className="h-4 w-4" />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Profile Image</DialogTitle>
          <DialogDescription>
            Upload a new profile image. Supported formats: JPG, PNG, GIF
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="image" className="sr-only">
              Profile Image
            </Label>
            <div className="flex flex-col items-center gap-4">
              {previewUrl ? (
                <div className="relative">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="rounded-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 h-6 w-6 rounded-full"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex h-[200px] w-[200px] items-center justify-center rounded-full border-2 border-dashed border-gray-300">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
          <Button 
            type="submit" 
            disabled={!selectedImage} 
            onClick={submitImage}
          >
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
