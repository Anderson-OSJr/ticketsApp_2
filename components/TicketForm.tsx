"use client";

import { ticketSchema } from "@/ValidationSchemas/ticket";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import SimpleMDE from "react-simplemde-editor";
//Esse import veio da documentação do NPM
//Corrige o problema de formatação do editor (faltava o style sheet)
//npmjs.com/package/react-simplemde-editor
import "easymde/dist/easymde.min.css";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Ticket } from "@prisma/client";


//O ticketSchema é um "Validador".
//O TicketFormData é como uma "Transfer Class".
type TicketFormData = z.infer<typeof ticketSchema>;

//O "ticket?" significa um ticket opcional
//Tem que ser opcional, pois pode ser usado tanto sem ticket(criar new ticket com post)...
//Ou com ticket(editar um ticket existente com o patch)
interface Props {
    ticket?: Ticket
}

const TicketForm = ({ticket}: Props) => {

    const [isSubitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    //"useForm" é um "Custom hook to manage the entire form."
    const form = useForm<TicketFormData>({
        resolver: zodResolver(ticketSchema)
    })

    async function onSubmit(values: z.infer<typeof ticketSchema>) {
        try {
            setIsSubmitting(true);
            setError("");

            //Se já existir um ticket, vai para o update, se não, vai para a create.
            if(ticket) {
                await axios.patch("/api/tickets/" + ticket.id, values);
            } else {
                await axios.post("/api/tickets", values);
            }            

            setIsSubmitting(false);

            router.push("/tickets");
            router.refresh();

        } catch (error) {
            console.log(error);
            setError("Unknown Error Occured.");
            setIsSubmitting(false);
        }
    }

    return (
        <div className="rounded-md  border w-full p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                    <FormField 
                        control={form.control} 
                        name="title" 
                        defaultValue={ticket?.title}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Ticket Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ticket Title" {...field}/>
                                </FormControl>
                            </FormItem>
                        )}>
                    </FormField>
                    <Controller 
                        name="description" 
                        defaultValue={ticket?.description}
                        control={form.control} 
                        render={({field}) => (
                            <SimpleMDE placeholder="Description" {...field}/>
                    )}/>

                    <div className="flex w-full space-x-4">
                        <FormField 
                            control={form.control}
                            name="status"
                            defaultValue={ticket?.status}                            
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}>                                        
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    placeholder="Status..."
                                                    defaultValue={ticket?.status} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="OPEN">Open</SelectItem>
                                            <SelectItem value="STARTED">Started</SelectItem>
                                            <SelectItem value="CLOSED">Closed</SelectItem>
                                        </SelectContent>                                        
                                    </Select>
                                </FormItem>
                            )}                           
                        />
                        <FormField 
                            control={form.control}
                            name="priority" 
                            defaultValue={ticket?.priority}                            
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Priority</FormLabel>
                                    <Select 
                                        onValueChange={field.onChange} 
                                        defaultValue={field.value}>                                        
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue 
                                                    placeholder="Priority..."
                                                    defaultValue={ticket?.priority} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="LOW">Low</SelectItem>
                                            <SelectItem value="MEDIUM">Medium</SelectItem>
                                            <SelectItem value="HIGH">High</SelectItem>
                                        </SelectContent>                                        
                                    </Select>
                                </FormItem>
                            )}                           
                        />
                    </div>
                    <Button type="submit" disabled={isSubitting}>
                        {ticket? "Update Ticket" : "Create Ticket"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}

export default TicketForm;

