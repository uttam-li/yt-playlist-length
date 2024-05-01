'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Switch } from "./ui/switch";
import { getPlaylist, getPlaylistByParams } from "@/lib/action";

import { PlaylistItemListResponse } from '@/lib/types'
import PlaylistResult from "./playlist-result";
import { SearchIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const FormSchema = z.object({
    url: z.string().url({ message: "Invalid URL" }),
    // maxResult: z.number().min(1, { message: "It should be greater than 0" }),
    start: z.number().min(1, { message: "Start should be greater than 0" }),
    end: z.number().min(1, { message: "End should be greater than 0" })
})

export default function SearchBar() {

    const [isAdvanced, setIsAdvanced] = useState<boolean>(false)
    const [isPending, setIsPending] = useState<boolean>(false)
    const [playlist, setPlaylist] = useState<PlaylistItemListResponse>()
    const { toast } = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        defaultValues: {
            url: '',
            // maxResult: 50,
            start: 1,
            end: 20,
        },
        resolver: zodResolver(FormSchema)
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsPending(true)
    
        if (data.url.includes('list')) {
            if (isAdvanced) {
                if (data.start >= data.end) {
                    toast({
                        title: "Invalid Input",
                        description: "Start must be less than end.",
                    })
                    setIsPending(false)
                    return
                }
            }
    
            try {
                const response = isAdvanced ? 
                    await getPlaylistByParams(data.url, data.start, data.end) :
                    await getPlaylist(data.url)
                setPlaylist(response)
                setIsPending(false)
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch playlist. Please check your URL.",
                })
                setIsPending(false)
            }
        } else {
            toast({
                variant: "destructive",
                title: "Invalid URL",
                description: "Please enter a valid YouTube playlist URL.",
            })
            setIsPending(false)
        }
    }

    return (
        <div className="flex flex-col items-center w-full mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full px-6">
                    <div className="flex items-start space-x-2 my-6 max-w-[600px] mx-auto shadow-xl p-2 md:p-4 border-[1px] rounded-md">
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormControl>
                                        <Input type="url" placeholder="https://youtube.com/playlist?list=PL123456" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending} size="icon" className="h-[36px] w-[40px] font-bold text-base">
                            {
                                isPending ?
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
                                        <path fill="white dark:black" className="dark:" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" opacity={0.25}></path>
                                        <path fill="white" className="dark:white" d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z">
                                            <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"></animateTransform>
                                        </path>
                                    </svg>
                                    :
                                    <SearchIcon size={24} />
                            }
                        </Button>
                    </div>
                    <div className="flex flex-col items-center justify-center space-x-4 space-y-8 mx-auto border-[1px] max-w-[250px] md:max-w-[350px] rounded-lg p-4">
                        <div className="flex gap-2">
                            <h4 className="text-sm font-semibold">
                                Advanced Search
                            </h4>
                            <Switch checked={isAdvanced} onClick={() => setIsAdvanced(!isAdvanced)} className="" />
                        </div>
                        {isAdvanced && (
                            <div className="flex flex-col md:flex-row gap-2 items-start justify-center">
                                <FormField
                                    control={form.control}
                                    name="start"
                                    render={({ field }) => (
                                        <FormItem className="">
                                            <FormLabel className="">Start</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="01" {...field} onChange={(e) => form.setValue('start', parseInt(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="end"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>End</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="20" {...field} onChange={(e) => form.setValue('end', parseInt(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* <FormField
                                    control={form.control}
                                    name="maxResult"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Max Result</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="50" {...field} onChange={(e) => form.setValue('maxResult', parseInt(e.target.value))} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}
                            </div>
                        )}
                    </div>
                </form>
            </Form>
            {playlist && <PlaylistResult playlist={playlist} />}
        </div>
    )
}