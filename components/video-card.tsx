import { PlaylistItemListResponse, videoFormat, videoSpeed } from '@/lib/types'
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { calculateTotalDuration, parseDuration } from '@/lib/utils'
import { ExternalLink, Clock, Calendar, Play, Eye, TrendingUp, Timer, Hash, User2, Sparkles } from 'lucide-react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

export default function VideoCard({ item, format, speed }: { 
    item: PlaylistItemListResponse['items'][0] & { index: number }, 
    format: videoFormat, 
    speed: videoSpeed 
}) {
    const videoTitle = item.snippet.title.length > 70 ? 
        item.snippet.title.substring(0, 70) + '...' : 
        item.snippet.title
    
    const imageUrl = item?.snippet?.thumbnails?.medium?.url || item.videoThumbnail;
    const videoLength = parseDuration(item.videoDuration)
    const videoFormat = format.charAt(0).toUpperCase() + format.slice(1)
    const originalLength = calculateTotalDuration(videoLength, format)
    const playbackDuration = calculateTotalDuration(videoLength / parseFloat(speed), format)
    
    const publishDate = new Date(item.contentDetails.videoPublishedAt).toLocaleDateString('en-US', { 
        month: "short", 
        day: "numeric",
        year: 'numeric' 
    });
    
    const addedToPlaylistDate = new Date(item.snippet.publishedAt).toLocaleDateString('en-US', { 
        month: "short", 
        day: "numeric",
        year: 'numeric' 
    });

    // Determine video length category
    const getVideoCategory = (seconds: number) => {
        if (seconds < 300) return { label: 'Quick', color: 'bg-green-500', textColor: 'text-green-700' };
        if (seconds < 1200) return { label: 'Standard', color: 'bg-blue-500', textColor: 'text-blue-700' };
        return { label: 'Deep Dive', color: 'bg-purple-500', textColor: 'text-purple-700' };
    };

    const category = getVideoCategory(videoLength);

    // Content freshness indicator
    const getContentFreshness = () => {
        const now = new Date();
        const publishedDate = new Date(item.contentDetails.videoPublishedAt);
        const monthsAgo = (now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
        
        if (monthsAgo <= 1) return { label: 'New', color: 'bg-green-100 text-green-700', icon: Sparkles };
        if (monthsAgo <= 6) return { label: 'Recent', color: 'bg-blue-100 text-blue-700', icon: TrendingUp };
        if (monthsAgo <= 24) return { label: 'Standard', color: 'bg-gray-100 text-gray-700', icon: Clock };
        return { label: 'Classic', color: 'bg-amber-100 text-amber-700', icon: Timer };
    };

    const freshness = getContentFreshness();

    return (
        <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-blue-200 dark:hover:border-blue-800">
            <div className="relative">
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                    <Image 
                        src={imageUrl} 
                        alt={item.snippet.title} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Video Number Badge */}
                    <Badge 
                        variant="secondary" 
                        className="absolute top-2 left-2 md:top-3 md:left-3 bg-black/90 text-white border-none font-bold px-2 py-1 md:px-3 text-xs"
                    >
                        #{item.index}
                    </Badge>
                    
                    {/* Category Badge - Hidden on mobile */}
                    <Badge 
                        variant="secondary" 
                        className={`absolute top-2 right-2 md:top-3 md:right-3 ${category.color} text-white border-none px-2 py-1 text-xs hidden sm:inline-flex`}
                    >
                        {category.label}
                    </Badge>
                    
                    {/* Duration Badge */}
                    <Badge 
                        variant="secondary" 
                        className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-black/90 text-white border-none flex items-center gap-1 text-xs"
                    >
                        <Clock className="h-3 w-3" />
                        {originalLength}
                    </Badge>

                    {/* Freshness Badge - Hidden on mobile */}
                    <Badge 
                        variant="secondary" 
                        className={`absolute bottom-2 left-2 md:bottom-3 md:left-3 ${freshness.color} border-none items-center gap-1 text-xs hidden sm:flex`}
                    >
                        <freshness.icon className="h-3 w-3" />
                        {freshness.label}
                    </Badge>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full">
                            <Play className="h-6 w-6 md:h-8 md:w-8 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            <CardContent className="p-3 md:p-5 space-y-3 md:space-y-4">
                {/* Title */}
                <h4 className="font-semibold text-sm md:text-base leading-tight line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {videoTitle}
                </h4>

                {/* Mobile: Show category and freshness inline */}
                <div className="flex items-center gap-2 sm:hidden">
                    <Badge variant="outline" className={`${category.textColor} text-xs px-2 py-1`}>
                        {category.label}
                    </Badge>
                    <Badge variant="outline" className={`${freshness.color} text-xs px-2 py-1 flex items-center gap-1`}>
                        <freshness.icon className="h-3 w-3" />
                        {freshness.label}
                    </Badge>
                </div>

                {/* Video Metadata Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-xs">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span className="sm:hidden">Pub {publishDate}</span>
                        <span className="hidden sm:inline">Published {publishDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Timer className="h-3 w-3" />
                        <span>{originalLength} {videoFormat.toLowerCase()}</span>
                    </div>
                    {/* Hide position on mobile to save space */}
                    <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
                        <Hash className="h-3 w-3" />
                        <span>Pos #{item.snippet.position + 1}</span>
                    </div>
                    {/* Hide added date on mobile */}
                    <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
                        <User2 className="h-3 w-3" />
                        <span>Added {addedToPlaylistDate}</span>
                    </div>
                </div>

                {/* Speed Comparison */}
                {speed !== '1' && (
                    <div className="p-2 md:p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                        <div className="flex items-center justify-between text-xs md:text-sm">
                            <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                                <TrendingUp className="h-3 w-3" />
                                At {speed}x speed
                            </span>
                            <span className="font-semibold text-blue-700 dark:text-blue-300">
                                {playbackDuration} {videoFormat.toLowerCase()}
                            </span>
                        </div>
                    </div>
                )}

                {/* Channel Info */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    <span className="truncate">
                        {item.snippet.videoOwnerChannelTitle || item.snippet.channelTitle || 'Unknown Channel'}
                    </span>
                </div>

                {/* Watch Button - Larger touch target on mobile */}
                <Button
                    asChild
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white h-9 md:h-8"
                    size="sm"
                >
                    <a
                        href={`https://youtube.com/watch?v=${item.contentDetails.videoId}&list=${item.snippet.playlistId}&index=${item.snippet.position + 1}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 text-sm"
                    >
                        <Play className="h-3 w-3" />
                        <span className="sm:hidden">Watch</span>
                        <span className="hidden sm:inline">Watch on YouTube</span>
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </Button>
            </CardContent>
        </Card>
    )
}