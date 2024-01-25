"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios"
import { useRouter } from "next/navigation";

import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";
// import { FileUpload } from "../file-upload";
import { useModal } from "@/hooks/useModalStore";
import { useEffect } from "react";
import { CldUploadButton } from "next-cloudinary";
import { SlPaperClip } from "react-icons/sl";
import Image from "next/image";
import Modal from "../modal";


const formSchema = z.object({
    name: z.string().min(1, {
        message: "server name is required"
    }),
    imageUrl: z.string().min(1, {
        message: "server image is required"
    })
})

export const EditProfileModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const router = useRouter();

    const isModalOpen = isOpen && type === "editProfile";
    const { user } = data;

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: ""
        }
    })

    useEffect(() => {
        if (user) {
            form.setValue("name", user?.name!);
            form.setValue("imageUrl", user?.image!)
        }
    }, [user, form]);

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/users`, values)
            router.refresh();
            onClose();

        }
        catch (error) {
            console.log(error);
        }
    }

    const handleUpload = async (result: any) => {
        try {
            form.setValue("imageUrl", result?.info?.secure_url);

        }
        catch (error) {
            console.log(error);
        }
    }

    const handleClose = () => {

        onClose();
    }

    return (
        <Modal isOpen={isModalOpen} onClose={handleClose}>
            <div className="text-2xl text-center font-bold pb-6">Profile Setting</div>
            <Form {...form}>

                <form onSubmit={form.handleSubmit(onSubmit)} className="">
                    <div className="px-6 pb-[70px] space-y-8">

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-zinc-300/50 border-0 focus-visble:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Photo
                                    </FormLabel>
                                    <FormControl>
                                        <div className="flex items-center justify-center text-center">
                                            <CldUploadButton
                                                options={{ maxFiles: 1 }}
                                                onUpload={handleUpload}
                                                uploadPreset="lehwukid"
                                            >
                                                <Image alt="image" src={form.getValues("imageUrl") || "/images/placeholder.jpg"} width="80" height="80" className="rounded-full"/>
                                            </CldUploadButton>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>

                    <div className="flex items-center justify-end pr-6">
                        <Button variant="outline" disabled={isLoading} className="hover:text-white hover:bg-black">
                            Save
                        </Button>
                    </div>

                </form>
            </Form>
        </Modal>
    );
}

