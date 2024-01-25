
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
import toast from "react-hot-toast";


const formSchema = z.object({
    email: z.string().email({
        message: "User Email is required"
    })
})

export const CreateChatModal = () => {
    const { isOpen, onClose, type, data } = useModal();

    const router = useRouter();
    const params = useParams();

    const isModalOpen = isOpen && type == "createChat";



    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",

        }
    })
    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            const res = await axios.post('/api/users', values);
            await axios.post('/api/conversations', { userId: res.data })

            form.reset();
            router.refresh();
            onClose();

        }
        catch (error) {
            toast.error('Email Not Found');
            form.reset();
            onClose();
        }
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
                        Create Chat
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                            User Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-300/50 border-0 focus-visble:ring-0 text-black focus-visible:ring-offset-0"
                                                placeholder="Enter User Email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            <Button variant="outline" disabled={isLoading} className="hover:text-white hover:bg-black">
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>
        </Dialog>
    );
}

