import { PlaylistItemListResponse, videoFormat, videoSpeed } from '@/lib/types';
import { calculateTotalDuration, parseDuration } from '@/lib/utils';
import VideoCard from './video-card';
import { useState, useMemo } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Clock, PlayCircle, User, Hash, Settings, Calendar, BarChart3, Timer, TrendingUp, Zap, Users, Database, Activity } from 'lucide-react';
import { Badge } from './ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from './ui/progress';

export default function PlaylistResult({ playlist }: { playlist: PlaylistItemListResponse }) {
    const [format, setFormat] = useState<videoFormat>('hrs')
    const [speed, setSpeed] = useState<videoSpeed>('1')

    // Enhanced calculations with new data
    const playlistStats = useMemo(() => {
        const durations = playlist.items.map((item) => parseDuration(item.videoDuration));
        const totalSeconds = durations.reduce((acc, curr) => acc + curr, 0);
        
        // Calculate statistics
        const avgDuration = totalSeconds / playlist.items.length;
        const shortestVideo = Math.min(...durations);
        const longestVideo = Math.max(...durations);
        
        // Content analysis
        const shortVideos = durations.filter(d => d < 300).length; // < 5 min
        const mediumVideos = durations.filter(d => d >= 300 && d < 1200).length; // 5-20 min
        const longVideos = durations.filter(d => d >= 1200).length; // > 20 min
        
        // Viewing time estimates
        const watchingHours = totalSeconds / 3600;
        const daysToComplete = Math.ceil(watchingHours / 2); // Assuming 2 hours per day
        
        // New analytics
        const uniqueChannels = new Set(playlist.items.map(item => item.snippet.channelId || item.snippet.videoOwnerChannelId)).size;
        const playlistCreator = playlist.items[0]?.snippet?.channelTitle || 'Unknown';
        const totalPlaylistSize = playlist.pageInfo?.totalResults || playlist.items.length;
        const isPartialPlaylist = playlist.items.length < totalPlaylistSize;
        
        // Content freshness analysis
        const now = new Date();
        const recentVideos = playlist.items.filter(item => {
            const publishDate = new Date(item.contentDetails.videoPublishedAt);
            const monthsAgo = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
            return monthsAgo <= 6; // Videos from last 6 months
        }).length;
        
        const oldVideos = playlist.items.filter(item => {
            const publishDate = new Date(item.contentDetails.videoPublishedAt);
            const yearsAgo = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
            return yearsAgo >= 2; // Videos older than 2 years
        }).length;
        
        return {
            totalSeconds,
            avgDuration,
            shortestVideo,
            longestVideo,
            shortVideos,
            mediumVideos,
            longVideos,
            watchingHours,
            daysToComplete,
            uniqueChannels,
            playlistCreator,
            totalPlaylistSize,
            isPartialPlaylist,
            recentVideos,
            oldVideos
        };
    }, [playlist.items]);

    const videoFormat = format.charAt(0).toUpperCase() + format.slice(1)
    const totalLength = calculateTotalDuration(playlistStats.totalSeconds, format) + ' ' + videoFormat
    const playbackLength = calculateTotalDuration(playlistStats.totalSeconds / parseFloat(speed), format) + ' ' + videoFormat
    const avgLength = calculateTotalDuration(playlistStats.avgDuration, format) + ' ' + videoFormat

    const speedLabel = speed === '1' ? 'Normal Speed' : `${speed}x Speed`

    // Calculate progress percentages for content distribution
    const totalVideos = playlist.items.length;
    const shortPercent = (playlistStats.shortVideos / totalVideos) * 100;
    const mediumPercent = (playlistStats.mediumVideos / totalVideos) * 100;
    const longPercent = (playlistStats.longVideos / totalVideos) * 100;

    return (
        <div className="space-y-8 mx-2">
            {/* Enhanced Summary Card */}
            <Card className="overflow-hidden shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 bg-blue-500/20 rounded-full">
                            <PlayCircle className="h-6 w-6 text-blue-600" />
                        </div>
                        Playlist Analysis
                        <div className="flex gap-2 ml-auto">
                            {playlistStats.isPartialPlaylist && (
                                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                    Partial ({playlist.items.length}/{playlistStats.totalPlaylistSize})
                                </Badge>
                            )}
                            <Badge variant="outline">
                                {playlist.items.length} videos
                            </Badge>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                    {/* Main Statistics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Playlist Creator */}
                        <Card className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    Playlist by
                                </div>
                                <p className="font-semibold text-sm leading-tight">
                                    {playlistStats.playlistCreator}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {playlistStats.uniqueChannels} unique channels
                                </p>
                            </div>
                        </Card>

                        {/* Total Duration */}
                        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900 dark:to-emerald-900">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    Total Duration
                                </div>
                                <p className="font-bold text-lg text-green-700 dark:text-green-300">
                                    {totalLength}
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400">
                                    ≈ {playlistStats.watchingHours.toFixed(1)} hours
                                </p>
                            </div>
                        </Card>

                        {/* Playback Duration */}
                        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Zap className="h-4 w-4" />
                                    At {speedLabel}
                                </div>
                                <p className="font-bold text-lg text-blue-700 dark:text-blue-300">
                                    {playbackLength}
                                </p>
                                <p className="text-xs text-blue-600 dark:text-blue-400">
                                    Save {calculateTotalDuration(playlistStats.totalSeconds - (playlistStats.totalSeconds / parseFloat(speed)), format)} {videoFormat.toLowerCase()}
                                </p>
                            </div>
                        </Card>

                        {/* Content Freshness */}
                        <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900 dark:to-violet-900">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Activity className="h-4 w-4" />
                                    Content Age
                                </div>
                                <p className="font-bold text-lg text-purple-700 dark:text-purple-300">
                                    {playlistStats.recentVideos} Recent
                                </p>
                                <p className="text-xs text-purple-600 dark:text-purple-400">
                                    {playlistStats.oldVideos} older than 2 years
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Content Distribution */}
                    <div className="space-y-4 mb-8">
                        <h4 className="font-semibold flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Content Distribution
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    Short Videos (&lt;5 min)
                                </span>
                                <span className="font-medium">{playlistStats.shortVideos} ({shortPercent.toFixed(0)}%)</span>
                            </div>
                            <Progress value={shortPercent} className="h-2" />
                            
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    Medium Videos (5-20 min)
                                </span>
                                <span className="font-medium">{playlistStats.mediumVideos} ({mediumPercent.toFixed(0)}%)</span>
                            </div>
                            <Progress value={mediumPercent} className="h-2" />
                            
                            <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                    Long Videos (&gt;20 min)
                                </span>
                                <span className="font-medium">{playlistStats.longVideos} ({longPercent.toFixed(0)}%)</span>
                            </div>
                            <Progress value={longPercent} className="h-2" />
                        </div>
                    </div>

                    {/* Enhanced Viewing Estimates */}
                    <Card className="p-4 bg-gray-50 dark:bg-gray-800/50 mb-8">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Timer className="h-4 w-4" />
                            Viewing Time Estimates
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                                <p className="font-bold text-lg text-blue-600">{playlistStats.daysToComplete}</p>
                                <p className="text-muted-foreground">Days (2hrs/day)</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-lg text-green-600">{Math.ceil(playlistStats.watchingHours / 8)}</p>
                                <p className="text-muted-foreground">Work days (8hrs/day)</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-lg text-purple-600">{Math.ceil(playlistStats.watchingHours)}</p>
                                <p className="text-muted-foreground">Sessions (1hr each)</p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-lg text-orange-600">{avgLength}</p>
                                <p className="text-muted-foreground">Avg per video</p>
                            </div>
                        </div>
                    </Card>

                    <Separator className="my-6" />

                    {/* Controls */}
                    <div className="flex flex-wrap gap-6 items-center">
                        <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <label className="text-sm font-medium">Display Format:</label>
                            <Select onValueChange={(value: videoFormat) => setFormat(value)} defaultValue={format}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hrs">Hours</SelectItem>
                                    <SelectItem value="min">Minutes</SelectItem>
                                    <SelectItem value="sec">Seconds</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center gap-3">
                            <Zap className="h-4 w-4 text-muted-foreground" />
                            <label className="text-sm font-medium">Playback Speed:</label>
                            <Select onValueChange={(value: videoSpeed) => setSpeed(value)} defaultValue={speed}>
                                <SelectTrigger className="w-32">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0.25">0.25x</SelectItem>
                                    <SelectItem value="0.5">0.5x</SelectItem>
                                    <SelectItem value="0.75">0.75x</SelectItem>
                                    <SelectItem value="1">Normal</SelectItem>
                                    <SelectItem value="1.25">1.25x</SelectItem>
                                    <SelectItem value="1.5">1.5x</SelectItem>
                                    <SelectItem value="1.75">1.75x</SelectItem>
                                    <SelectItem value="2">2x</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Videos Grid */}
            <div>
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                    <PlayCircle className="h-6 w-6 text-blue-600" />
                    Videos ({playlist.items.length})
                    {playlistStats.isPartialPlaylist && (
                        <Badge variant="outline" className="text-sm">
                            Showing {playlist.items.length} of {playlistStats.totalPlaylistSize}
                        </Badge>
                    )}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {playlist.items.map((item, index) => (
                        <VideoCard 
                            key={item.etag} 
                            item={{...item, index: index + 1}} 
                            format={format} 
                            speed={speed} 
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}