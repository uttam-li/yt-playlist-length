'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState, useTransition } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { getPlaylist, getPlaylistByParams } from "@/lib/action";
import { PlaylistItemListResponse } from '@/lib/types';
import PlaylistResult from "./playlist-result";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
    Calculator, 
    Loader2, 
    Filter, 
    Info, 
    User,
    Hash,
    Search,
    SlidersHorizontal,
    Timer,
    Tag,
    Video,
    ChevronDown,
    X,
    RotateCcw
} from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { parseDuration } from "@/lib/utils";

const FormSchema = z.object({
    url: z.string().url({ message: "Please enter a valid YouTube playlist URL" }),
    start: z.number().min(1, { message: "Start must be at least 1" }),
    end: z.number().min(1, { message: "End must be at least 1" }),
    // New filter fields
    minDuration: z.number().min(0).optional(),
    maxDuration: z.number().min(0).optional(),
    channels: z.array(z.string()).optional(),
    dateRange: z.object({
        from: z.string().optional(),
        to: z.string().optional(),
    }).optional(),
    keywords: z.string().optional(),
    contentType: z.array(z.string()).optional(),
    sortBy: z.enum(['position', 'duration', 'publishDate', 'title', 'addedDate']).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
})

export default function SearchBar() {
    const [isAdvanced, setIsAdvanced] = useState<boolean>(false)
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [playlist, setPlaylist] = useState<PlaylistItemListResponse | null>(null)
    const [filteredPlaylist, setFilteredPlaylist] = useState<PlaylistItemListResponse | null>(null)
    const [activeFilters, setActiveFilters] = useState<string[]>([])
    const { toast } = useToast()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            url: '',
            start: 1,
            end: 50,
            minDuration: 0,
            maxDuration: 3600, // 1 hour
            channels: [],
            keywords: '',
            contentType: [],
            sortBy: 'position',
            sortOrder: 'asc',
        },
    })

    // Apply filters to playlist
    const applyFilters = (originalPlaylist: PlaylistItemListResponse, filters: z.infer<typeof FormSchema>) => {
        let filtered = [...originalPlaylist.items]
        const appliedFilters: string[] = []

        // Duration filter
        if (filters.minDuration !== undefined && filters.minDuration > 0) {
            filtered = filtered.filter(item => {
                const duration = parseDuration(item.videoDuration)
                return duration >= filters.minDuration!
            })
            appliedFilters.push(`Min duration: ${filters.minDuration}s`)
        }

        if (filters.maxDuration !== undefined && filters.maxDuration < 3600) {
            filtered = filtered.filter(item => {
                const duration = parseDuration(item.videoDuration)
                return duration <= filters.maxDuration!
            })
            appliedFilters.push(`Max duration: ${filters.maxDuration}s`)
        }

        // Channel filter
        if (filters.channels && filters.channels.length > 0) {
            filtered = filtered.filter(item => 
                filters.channels!.includes(item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle || '')
            )
            appliedFilters.push(`Channels: ${filters.channels.length} selected`)
        }

        // Keywords filter
        if (filters.keywords && filters.keywords.trim()) {
            const keywords = filters.keywords.toLowerCase().split(',').map(k => k.trim())
            filtered = filtered.filter(item => 
                keywords.some(keyword => 
                    item.snippet.title.toLowerCase().includes(keyword) ||
                    (item.snippet.description && item.snippet.description.toLowerCase().includes(keyword))
                )
            )
            appliedFilters.push(`Keywords: "${filters.keywords}"`)
        }

        // Date range filter
        if (filters.dateRange?.from || filters.dateRange?.to) {
            filtered = filtered.filter(item => {
                const publishDate = new Date(item.contentDetails.videoPublishedAt)
                const fromDate = filters.dateRange?.from ? new Date(filters.dateRange.from) : new Date('1900-01-01')
                const toDate = filters.dateRange?.to ? new Date(filters.dateRange.to) : new Date()
                
                return publishDate >= fromDate && publishDate <= toDate
            })
            appliedFilters.push('Date range applied')
        }

        // Content type filter (based on duration categories)
        if (filters.contentType && filters.contentType.length > 0) {
            filtered = filtered.filter(item => {
                const duration = parseDuration(item.videoDuration)
                const isShort = duration < 300 && filters.contentType!.includes('shorts')
                const isStandard = duration >= 300 && duration < 1200 && filters.contentType!.includes('standard')
                const isLong = duration >= 1200 && filters.contentType!.includes('long')
                
                return isShort || isStandard || isLong
            })
            appliedFilters.push(`Content types: ${filters.contentType.length} selected`)
        }

        // Sorting
        if (filters.sortBy && filters.sortBy !== 'position') {
            filtered.sort((a, b) => {
                let aValue: any, bValue: any
                
                switch (filters.sortBy) {
                    case 'duration':
                        aValue = parseDuration(a.videoDuration)
                        bValue = parseDuration(b.videoDuration)
                        break
                    case 'publishDate':
                        aValue = new Date(a.contentDetails.videoPublishedAt)
                        bValue = new Date(b.contentDetails.videoPublishedAt)
                        break
                    case 'addedDate':
                        aValue = new Date(a.snippet.publishedAt)
                        bValue = new Date(b.snippet.publishedAt)
                        break
                    case 'title':
                        aValue = a.snippet.title.toLowerCase()
                        bValue = b.snippet.title.toLowerCase()
                        break
                    default:
                        return 0
                }
                
                const order = filters.sortOrder === 'desc' ? -1 : 1
                if (aValue < bValue) return -1 * order
                if (aValue > bValue) return 1 * order
                return 0
            })
            appliedFilters.push(`Sorted by ${filters.sortBy} (${filters.sortOrder})`)
        }

        setActiveFilters(appliedFilters)
        
        return {
            ...originalPlaylist,
            items: filtered.map((item, index) => ({ ...item, index: index + 1 }))
        }
    }

    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        startTransition(async () => {
            // Better URL validation for YouTube playlist URLs
            try {
                const url = new URL(data.url);
                const playlistId = url.searchParams.get('list');
                
                // Check if it's a YouTube URL and has a playlist ID
                if (!url.hostname.includes('youtube.com') && !url.hostname.includes('youtu.be')) {
                    toast({
                        variant: "destructive",
                        title: "Invalid URL",
                        description: "Please enter a valid YouTube URL",
                    })
                    return
                }
                
                if (!playlistId) {
                    toast({
                        variant: "destructive",
                        title: "Invalid Playlist URL",
                        description: "Please enter a valid YouTube playlist URL containing a 'list' parameter",
                    })
                    return
                }
            } catch (urlError) {
                toast({
                    variant: "destructive",
                    title: "Invalid URL",
                    description: "Please enter a valid URL format",
                })
                return
            }

            if (isAdvanced && data.start >= data.end) {
                toast({
                    variant: "destructive",
                    title: "Invalid Range",
                    description: "Start position must be less than end position",
                })
                return
            }

            try {
                const response = isAdvanced ? 
                    await getPlaylistByParams(data.url, data.start, data.end) : 
                    await getPlaylist(data.url)
                
                setPlaylist(response)
                
                // Apply filters
                const filtered = applyFilters(response, data)
                setFilteredPlaylist(filtered)
                
                toast({
                    title: "Success!",
                    description: `Loaded ${response.items.length} videos, showing ${filtered.items.length} after filters`,
                })
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch playlist. Please check your URL and try again.",
                })
            }
        })
    }

    const clearFilters = () => {
        form.setValue('minDuration', 0)
        form.setValue('maxDuration', 3600)
        form.setValue('channels', [])
        form.setValue('keywords', '')
        form.setValue('contentType', [])
        form.setValue('dateRange', {})
        form.setValue('sortBy', 'position')
        form.setValue('sortOrder', 'asc')
        
        if (playlist) {
            setFilteredPlaylist(playlist)
        }
        setActiveFilters([])
    }

    const reapplyFilters = () => {
        if (playlist) {
            const filtered = applyFilters(playlist, form.getValues())
            setFilteredPlaylist(filtered)
        }
    }

    // Get unique channels for filter dropdown
    const availableChannels = playlist ? 
        Array.from(new Set(playlist.items.map(item => 
            item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle || 'Unknown'
        ))).filter(channel => channel !== 'Unknown') : []

    return (
        <div className="space-y-8 max-w-6xl mx-auto px-4 py-8">
            {/* Enhanced Search Form */}
            <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Main Search */}
                            <div className="space-y-4 flex flex-col md:flex-row gap-4 md:items-end">
                                <FormField
                                    control={form.control}
                                    name="url"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-base font-semibold">YouTube Playlist URL</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        type="url"
                                                        placeholder="https://youtube.com/playlist?list=..."
                                                        className="h-14 text-base border-2 focus:border-blue-500 transition-colors pl-12"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    disabled={isPending}
                                    size="lg"
                                    className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                            Analyzing...
                                        </>
                                    ) : (
                                        <>
                                            <Calculator className="h-5 w-5 mr-2" />
                                            Calculate
                                        </>
                                    )}
                                </Button>
                            </div>

                            {/* Advanced Options Toggle */}
                            <Collapsible open={isAdvanced} onOpenChange={setIsAdvanced}>
                                <CollapsibleTrigger asChild>
                                    <Button 
                                        variant="outline" 
                                        size="lg" 
                                        className="w-full h-12"
                                        type="button"
                                    >
                                        <Filter className="h-4 w-4 mr-2" />
                                        Advanced Options
                                        <Badge variant="secondary" className="ml-2">
                                            {isAdvanced ? 'Hide' : 'Show'}
                                        </Badge>
                                    </Button>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="space-y-6 pt-6">
                                    {/* Range Selection */}
                                    <Card className="p-4 dark:bg-blue-950/20">
                                        <h4 className="font-semibold mb-3">Range Selection</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="start"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Start from video #</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="1"
                                                                className="h-12"
                                                                {...field}
                                                                onChange={(e) => form.setValue('start', parseInt(e.target.value) || 1)}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="end"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>End at video #</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="50"
                                                                className="h-12"
                                                                {...field}
                                                                onChange={(e) => form.setValue('end', parseInt(e.target.value) || 50)}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </Card>
                                </CollapsibleContent>
                            </Collapsible>

                            {/* Filters Section */}
                            {playlist && (
                                <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <SlidersHorizontal className="h-5 w-5" />
                                                Filters & Sorting
                                                {activeFilters.length > 0 && (
                                                    <Badge variant="secondary">
                                                        {activeFilters.length} active
                                                    </Badge>
                                                )}
                                            </CardTitle>
                                            <div className="flex gap-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={clearFilters}
                                                    className="h-8"
                                                >
                                                    <RotateCcw className="h-3 w-3 mr-1" />
                                                    Clear
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                                                    className="h-8"
                                                >
                                                    <ChevronDown className={`h-3 w-3 mr-1 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                                                    {isFiltersOpen ? 'Hide' : 'Show'}
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        {/* Active Filters Display */}
                                        {activeFilters.length > 0 && (
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                {activeFilters.map((filter, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {filter}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </CardHeader>

                                    <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
                                        <CollapsibleContent>
                                            <CardContent className="space-y-6">
                                                {/* Duration Filters */}
                                                <div className="space-y-4">
                                                    <h5 className="font-medium flex items-center gap-2">
                                                        <Timer className="h-4 w-4" />
                                                        Video Duration
                                                    </h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="minDuration"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Minimum Duration (seconds)</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="0"
                                                                            {...field}
                                                                            onChange={(e) => {
                                                                                form.setValue('minDuration', parseInt(e.target.value) || 0)
                                                                                reapplyFilters()
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="maxDuration"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Maximum Duration (seconds)</FormLabel>
                                                                    <FormControl>
                                                                        <Input
                                                                            type="number"
                                                                            placeholder="3600"
                                                                            {...field}
                                                                            onChange={(e) => {
                                                                                form.setValue('maxDuration', parseInt(e.target.value) || 3600)
                                                                                reapplyFilters()
                                                                            }}
                                                                        />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                <Separator />

                                                {/* Content Type Filter */}
                                                <div className="space-y-4">
                                                    <h5 className="font-medium flex items-center gap-2">
                                                        <Tag className="h-4 w-4" />
                                                        Content Type
                                                    </h5>
                                                    <FormField
                                                        control={form.control}
                                                        name="contentType"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <div className="flex flex-wrap gap-4">
                                                                    {[
                                                                        { id: 'shorts', label: 'Short Videos (<5 min)', color: 'bg-green-100 text-green-700' },
                                                                        { id: 'standard', label: 'Standard Videos (5-20 min)', color: 'bg-blue-100 text-blue-700' },
                                                                        { id: 'long', label: 'Long Videos (>20 min)', color: 'bg-purple-100 text-purple-700' }
                                                                    ].map((type) => (
                                                                        <div key={type.id} className="flex items-center space-x-2">
                                                                            <Checkbox
                                                                                id={type.id}
                                                                                checked={field.value?.includes(type.id)}
                                                                                onCheckedChange={(checked) => {
                                                                                    const current = field.value || []
                                                                                    if (checked) {
                                                                                        form.setValue('contentType', [...current, type.id])
                                                                                    } else {
                                                                                        form.setValue('contentType', current.filter(item => item !== type.id))
                                                                                    }
                                                                                    reapplyFilters()
                                                                                }}
                                                                            />
                                                                            <label htmlFor={type.id} className={`text-sm px-2 py-1 rounded ${type.color}`}>
                                                                                {type.label}
                                                                            </label>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <Separator />

                                                {/* Channel Filter */}
                                                {availableChannels.length > 0 && (
                                                    <div className="space-y-4">
                                                        <h5 className="font-medium flex items-center gap-2">
                                                            <User className="h-4 w-4" />
                                                            Channels ({availableChannels.length} available)
                                                        </h5>
                                                        <FormField
                                                            control={form.control}
                                                            name="channels"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <Select
                                                                        onValueChange={(value) => {
                                                                            const current = field.value || []
                                                                            if (!current.includes(value)) {
                                                                                form.setValue('channels', [...current, value])
                                                                                reapplyFilters()
                                                                            }
                                                                        }}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Select channels to filter..." />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {availableChannels.map((channel) => (
                                                                                <SelectItem key={channel} value={channel}>
                                                                                    {channel}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                    {field.value && field.value.length > 0 && (
                                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                                            {field.value.map((channel) => (
                                                                                <Badge key={channel} variant="secondary" className="flex items-center gap-1">
                                                                                    {channel}
                                                                                    <Button
                                                                                        type="button"
                                                                                        variant="ghost"
                                                                                        size="sm"
                                                                                        className="h-4 w-4 p-0 hover:bg-transparent"
                                                                                        onClick={() => {
                                                                                            const updated = field.value?.filter(c => c !== channel) || []
                                                                                            form.setValue('channels', updated)
                                                                                            reapplyFilters()
                                                                                        }}
                                                                                    >
                                                                                        <X className="h-3 w-3" />
                                                                                    </Button>
                                                                                </Badge>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                )}

                                                <Separator />

                                                {/* Keywords Filter */}
                                                <div className="space-y-4">
                                                    <h5 className="font-medium flex items-center gap-2">
                                                        <Search className="h-4 w-4" />
                                                        Keywords Search
                                                    </h5>
                                                    <FormField
                                                        control={form.control}
                                                        name="keywords"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Enter keywords separated by commas..."
                                                                        {...field}
                                                                        onChange={(e) => {
                                                                            field.onChange(e)
                                                                            // Debounce the filter application
                                                                            setTimeout(() => reapplyFilters(), 500)
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <p className="text-xs text-muted-foreground">
                                                                    Search in video titles and descriptions. Use commas to separate multiple keywords.
                                                                </p>
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <Separator />

                                                {/* Sorting */}
                                                <div className="space-y-4">
                                                    <h5 className="font-medium flex items-center gap-2">
                                                        <Hash className="h-4 w-4" />
                                                        Sort Results
                                                    </h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="sortBy"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Sort by</FormLabel>
                                                                    <Select
                                                                        onValueChange={(value) => {
                                                                            field.onChange(value)
                                                                            reapplyFilters()
                                                                        }}
                                                                        defaultValue={field.value}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="position">Playlist Position</SelectItem>
                                                                            <SelectItem value="duration">Video Duration</SelectItem>
                                                                            <SelectItem value="publishDate">Publish Date</SelectItem>
                                                                            <SelectItem value="addedDate">Added to Playlist</SelectItem>
                                                                            <SelectItem value="title">Title (A-Z)</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormItem>
                                                            )}
                                                        />
                                                        <FormField
                                                            control={form.control}
                                                            name="sortOrder"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Order</FormLabel>
                                                                    <Select
                                                                        onValueChange={(value) => {
                                                                            field.onChange(value)
                                                                            reapplyFilters()
                                                                        }}
                                                                        defaultValue={field.value}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="asc">Ascending</SelectItem>
                                                                            <SelectItem value="desc">Descending</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                {/* Apply Filters Button */}
                                                <Button
                                                    type="button"
                                                    onClick={reapplyFilters}
                                                    className="w-full"
                                                    variant="outline"
                                                >
                                                    <Filter className="h-4 w-4 mr-2" />
                                                    Apply Filters
                                                </Button>
                                            </CardContent>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </Card>
                            )}

                            {/* URL Format Help */}
                            <Alert>
                                <Info className="h-4 w-4" />
                                <AlertDescription>
                                    <strong>Tip:</strong> Make sure your URL contains a playlist ID (list=...). 
                                    Works with public playlists from YouTube.
                                </AlertDescription>
                            </Alert>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {/* Results */}
            {filteredPlaylist && <PlaylistResult playlist={filteredPlaylist} />}
        </div>
    )
}