"use client"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Pencil } from "lucide-react"

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State is required"),
    zip: z.string().min(5, "Zip code must be at least 5 characters").max(10, "Zip code is too long"),
})

type Address = z.infer<typeof formSchema> & { id: string }

export default function Addresses() {
    const [addresses, setAddresses] = useState<Address[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            address: "",
            city: "",
            state: "",
            zip: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        if (editingId) {
            // Update existing address
            setAddresses(addresses.map(addr => 
                addr.id === editingId ? { ...values, id: editingId } : addr
            ))
            setEditingId(null)
        } else {
            // Add new address
            setAddresses([...addresses, { ...values, id: crypto.randomUUID() }])
        }
        form.reset()
    }

    const handleEdit = (address: Address) => {
        setEditingId(address.id)
        form.reset(address)
    }

    const handleDelete = (id: string) => {
        setAddresses(addresses.filter(addr => addr.id !== id))
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        form.reset()
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">My Address Book</h1>

            {/* Address Form */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>{editingId ? "Edit Address" : "Add New Address"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Full Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Street Address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <FormControl>
                                            <Input placeholder="City" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>State</FormLabel>
                                        <FormControl>
                                            <Input placeholder="State" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="zip"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Zip Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Zip Code" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex gap-2">
                                <Button type="submit">{editingId ? "Update" : "Save"} Address</Button>
                                {editingId && (
                                    <Button type="button" variant="outline" onClick={handleCancelEdit}>
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Address List */}
            <div className="space-y-4">
                {addresses.length === 0 ? (
                    <p className="text-gray-500">No addresses saved yet.</p>
                ) : (
                    addresses.map((address) => (
                        <Card key={address.id}>
                            <CardContent className="flex justify-between items-start pt-6">
                                <div>
                                    <p className="font-semibold">{address.name}</p>
                                    <p>{address.address}</p>
                                    <p>{address.city}, {address.state} {address.zip}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleEdit(address)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleDelete(address.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}