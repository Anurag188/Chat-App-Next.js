
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios"
import { useParams, useRouter } from "next/navigation";



import {
    Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form"
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useModal } from "@/hooks/useModalStore";
import { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";


const formSchema = z.object({
    emails: z.array(z.string()),
})

export const ManageMembersModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const [memberEmail, setMemberEmail] = useState("");
    const router = useRouter();
    const params = useParams();
    const {conversation}=data;

    const isModalOpen = isOpen && type == "manageMembers";



    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emails: [''],

        }
    })
    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            
            const updatedEmails = [...values.emails.slice(0, 0), ...values.emails.slice(0 + 1)];
            form.setValue("emails", updatedEmails);
            const members = await axios.post('/api/users/emails', { emails: values.emails });
            
            await axios.patch('/api/conversations/update', {conversation:conversation,members: members.data})
            
            form.reset();
            router.refresh();
            onClose();

        }
        catch (error) {
            toast.error('Invalid Member Email')
            form.reset();
            onClose();
        }
    }

    const handleInputChange = (event: any) => {
        setMemberEmail(event.target.value)
        console.log(memberEmail)
    }

    const addMember = () => {
        form.setValue('emails', [...form.getValues('emails'), memberEmail]);
        setMemberEmail('');
        console.log(form.getValues("emails"))
    };

    const deleteMember = (key: any) => {
        const currentEmails = form.getValues("emails");

        // Ensure the index is within the valid range
        if (key > 0 && key < currentEmails.length) {
            const updatedEmails = [...currentEmails.slice(0, key), ...currentEmails.slice(key + 1)];

            // Update the form state
            form.setValue("emails", updatedEmails);
        }
        router.refresh();
    }

    const handleClose = () => {
        form.reset();
        onClose();
    }
    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add Members
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormItem>
                                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                   Add Members
                                </FormLabel>
                                <div className="flex">
                                    <Input
                                        className="bg-zinc-300/50 border-0 focus-visble:ring-0 text-black focus-visible:ring-offset-0 mr-3"
                                        placeholder="Enter Member email"
                                        type="text"
                                        value={memberEmail}
                                        onChange={handleInputChange}
                                    />
                                    <Button type="button" variant="outline" onClick={() => addMember()} className="hover:text-white hover:bg-black">
                                        Add
                                    </Button>
                                </div>
                            </FormItem>


                            <div className="flex flex-wrap m-3 gap-x-2">
                                {Array.isArray(form.getValues("emails")) && form.getValues("emails").map((member, key) => (key !== 0 && (
                                    <div key={key} className="flex relative">
                                        <div className="flex px-2 text-[16px] text-zinc-800 bg-zinc-300/50 w-fit mb-2 rounded-full mr-2">
                                            {member}
                                        </div>
                                        <button type="button" className="absolute bg-rose-500 text-white rounded-full top-0 right-0 h-3 w-3 md:h-3 md:w-3" onClick={() => deleteMember(key)}>
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )))}
                            </div>
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="outline" disabled={isLoading} className="hover:text-white hover:bg-black">
                                Confirm
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
}

