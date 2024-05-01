import { PlaylistItemListResponse, videoFormat, videoSpeed } from '@/lib/types';
import { calculateTotalDuration, parseDuration } from '@/lib/utils';
import VideoCard from './video-card';
import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '@radix-ui/react-dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export default function PlaylistResult({ playlist }: { playlist: PlaylistItemListResponse }) {

    const [format, setFormat] = useState<videoFormat>('hrs')
    const [speed, setSpeed] = useState<videoSpeed>('1')

    const playlistLength = playlist.items.map((item: PlaylistItemListResponse['items'][0]) => parseDuration(item.videoDuration)).reduce((acc, curr) => acc + curr, 0);

    const videoFormat = format.charAt(0).toUpperCase() + format.slice(1)
    const totalLength = calculateTotalDuration(playlistLength, format) + ' ' + videoFormat
    const playbackLength = calculateTotalDuration(playlistLength / parseFloat(speed), format) + ' ' + videoFormat

    return (
        <div className="flex flex-col items-center justify-center space-y-6 py-12">
            <div className='flex flex-col md:flex-row gap-x-10 gap-y-2 text-sm md:text-base '>
                <span className='inline-flex items-center justify-between gap-2'>
                    <Label id='speed' className='font-semibold text-lg'>Format:</Label>
                    <Select onValueChange={(value: videoFormat) => setFormat(value)} defaultValue={format}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select the format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="hrs">Hours</SelectItem>
                                <SelectItem value="min">Minutes</SelectItem>
                                <SelectItem value="sec">Seconds</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </span>
                <span className='inline-flex items-center justify-between gap-2'>
                    <Label id='speed' className='font-semibold text-lg'>Speed:</Label>
                    <Select onValueChange={(value: videoSpeed) => setSpeed(value)} defaultValue={speed}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select the format" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="0.25">0.25x</SelectItem>
                                <SelectItem value="0.5">0.5x</SelectItem>
                                <SelectItem value="0.75">0.75x</SelectItem>
                                <SelectItem value="1">Normal</SelectItem>
                                <SelectItem value="1.25">1.25x</SelectItem>
                                <SelectItem value="1.5">1.5</SelectItem>
                                <SelectItem value="1.75">1.75</SelectItem>
                                <SelectItem value="2">2</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </span>
            </div>
            <Card className='mx-5 shadow-xl border-[2px]'>
                <CardContent className='p-3'>
                    <CardHeader>
                        <CardTitle>
                            <div className='flex flex-col items-start gap-y-2 leading-5 text-sm md:text-base'>
                                <div>
                                    Published By:
                                    <span className="pl-2 text-primary font-normal">
                                        {playlist.items[0].snippet.videoOwnerChannelTitle}
                                    </span>
                                </div>
                                <div>
                                    Total Videos:
                                    <span className="pl-2 text-primary font-normal">
                                        {playlist.items.length}
                                    </span>
                                </div>
                                <div>
                                    Total Duration:
                                    <span className="pl-2 text-primary font-normal">
                                        {totalLength}
                                    </span>
                                </div>
                                <div>
                                    Playback Duration &#40;{speed}x&#41; :
                                    <span className="pl-2 text-primary font-normal">
                                        {playbackLength}
                                    </span>
                                </div>
                            </div>
                        </CardTitle>
                    </CardHeader>
                        {/* <CardDescription>
                            <span>

                            </span>
                        </CardDescription> */}
                </CardContent>
            </Card>

            <div className='flex flex-wrap gap-4 items-center justify-center'>
                {playlist && playlist?.items && (
                    playlist.items.map((item) => (
                        <VideoCard key={item.etag} item={item} format={format} speed={speed} />
                    ))
                )}
            </div>
        </div>
    )
}
