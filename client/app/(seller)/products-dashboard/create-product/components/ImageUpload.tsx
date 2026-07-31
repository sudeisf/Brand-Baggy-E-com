"use client"
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import Image from 'next/image'
import { X } from 'lucide-react'
import imageCompression from 'browser-image-compression'

interface ImageUploadProps {
  onChange: (files: File[]) => void
  value?: File[]
  maxFiles?: number
}

const MIME_TO_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/bmp': 'bmp',
}

function ensureFileExtension(file: File, originalName?: string): File {
  const baseName = originalName || file.name || 'image'
  const hasExt = /\.[a-z0-9]+$/i.test(baseName)
  if (hasExt && file.name === baseName) {
    return file
  }

  const mimeExt = MIME_TO_EXT[file.type] || MIME_TO_EXT[file.type.toLowerCase()]
  const originalExt = baseName.match(/\.([a-z0-9]+)$/i)?.[1]
  const ext = originalExt || mimeExt || 'jpg'
  const nameWithoutExt = baseName.replace(/\.[a-z0-9]+$/i, '') || 'image'
  const safeName = `${nameWithoutExt}.${ext}`

  return new File([file], safeName, {
    type: file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    lastModified: file.lastModified || Date.now(),
  })
}

export default function ImageUpload({ onChange, value, maxFiles = 4 }: ImageUploadProps) {
  const [files, setFiles] = useState<File[]>(value ?? [])

  useEffect(() => {
    if (value) {
      setFiles(value)
    }
  }, [value])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images`)
      return
    }
    
    try {
      const compressedFiles = await Promise.all(
        acceptedFiles.map(async (file) => {
          const compressed = await imageCompression(file, {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: file.type || 'image/jpeg',
          })
          return ensureFileExtension(compressed, file.name)
        })
      )
      const newFiles = [...files, ...compressedFiles]
      setFiles(newFiles)
      onChange(newFiles)
    } catch (error) {
      console.error("Error compressing images:", error)
      alert("Failed to compress some images. Please try again.")
    }
  }, [files, maxFiles, onChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: maxFiles - files.length
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    onChange(newFiles)
  }

  return (
    <div className="space-y-4  shadow-xs  rounded-md ">
        <h1 className='p-4 font-roboto text-md font-medium text-gray-500'>Upload Product Images</h1>
       

    <div className=''>
        {/* First image slot */}
        <div className="relative group px-4 mb-4">
            <div className="aspect-square w-full h-64 relative rounded-lg overflow-hidden">
            {
                files[0] ? (
                    <Image
                        src={URL.createObjectURL(files[0])}
                        alt={`image one`}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className=" h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                    </div>
                )
            }
            </div>
            <button
              onClick={() => removeFile(0)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
        </div>

    
        <div className='flex gap-4 px-4 py-4'>
        <div className="relative group w-1/4">
            <div className="aspect-square relative rounded-lg overflow-hidden">
            {
                files[1] ? (
                    <Image
                        src={URL.createObjectURL(files[1])}
                        alt={`image two`}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                    </div>
                )
            }
            </div>
            <button
              onClick={() => removeFile(1)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
        </div>

       
        <div className="relative group w-1/4">
            <div className="aspect-square relative rounded-lg overflow-hidden">
            {
                files[2] ? (
                    <Image
                        src={URL.createObjectURL(files[2])}
                        alt={`image three`}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                    </div>
                )
            }
            </div>
            <button
              onClick={() => removeFile(2)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
        </div>

      
        <div className="relative group w-1/4">
            <div className="aspect-square relative rounded-lg overflow-hidden">
            {
                files[3] ? (
                    <Image
                        src={URL.createObjectURL(files[3])}
                        alt={`image four`}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                    </div>
                )
            }
            </div>
            <button
              onClick={() => removeFile(3)}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
        </div>
        <div
        {...getRootProps()}
        className={`w-1/4 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-[#331d67] bg-[#331d67]/5' : 'border-gray-300 hover:border-[#331d67]'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            {files.length}/{maxFiles} images uploaded
          </p>
        </div>
      </div>
        </div>
      
      </div>

      
    </div>
  )
}
