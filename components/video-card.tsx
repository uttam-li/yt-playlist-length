import { PlaylistItemListResponse, videoFormat, videoSpeed } from '@/lib/types'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Image from 'next/image'
import { calculateTotalDuration, parseDuration } from '@/lib/utils'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'

export default function VideoCard({ item, format, speed }: { item: PlaylistItemListResponse['items'][0], format: videoFormat, speed: videoSpeed }) {

    const videoTitle = item.snippet.title.length > 45 ? item.snippet.title.substring(0, 45) + '...' : item.snippet.title
    const imageUrl = item?.snippet?.thumbnails?.medium?.url || item.videoThumbnail;
    const videoLength = parseDuration(item.videoDuration)
    const videoFormat = format.charAt(0).toUpperCase() + format.slice(1)
    const originalLength = calculateTotalDuration(videoLength, format) + ' ' + videoFormat
    const playbackDuration = calculateTotalDuration(videoLength / parseFloat(speed), format) + ' ' + videoFormat
    const publishDate = new Date(item.contentDetails.videoPublishedAt).toLocaleDateString('en-IN', { day: "2-digit", month: "short", year: 'numeric' });
    return (
        <>
            <Card className='max-w-[320px] hidden md:block min-h-[310px] relative'>
            <span className='absolute bg-secondary font-semibold ring-1 ring-muted-foreground py-1 px-2 text-center rounded-lg my-auto w-8 h-8 flex items-center justify-center text-lg top-2 left-2'>{item.index}</span>
                <CardHeader className='bg-secondary rounded-t-lg p-4 text-center'>
                <Image src={imageUrl} alt={item.videoTitle} className="object-cover rounded-lg shadow-md hidden md:block mb-1" width={320} height={180} />
                    <CardTitle>
                        {item.videoTitle}
                    </CardTitle>
                </CardHeader>
                <CardContent className='pt-2 text-sm space-y-1'>
                    {/* <CardDescription>{item.snippet.description.substring(0, 100)}...</CardDescription> */}
                    <p><span className='font-semibold'>Video Duration:</span> {originalLength}</p>
                    <p><span className='font-semibold'>Playback Duration:</span> {playbackDuration}</p>
                    <p><span className='font-semibold'>Published:</span> {publishDate}</p>
                </CardContent>
                <CardFooter className='bg-secondary rounded-b-lg p-2 text-center mt-[-20px]'>
                    <a
                        className="inline-flex items-center gap-x-2 border dark:border-primary/15 text-sm p-1 ps-3 rounded-full transition-all group"
                        href={`https://youtube.com/watch?v=${item.contentDetails.videoId}&index=${item.index}`}
                    >
                        Link
                        <span className="py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full bg-muted-foreground/15 font-semibold text-sm">
                            <ArrowTopRightIcon className="h-4 w-4 group-hover:scale-125 transition-all" />
                        </span>
                    </a>
                </CardFooter>
            </Card>
            <Card className='md:hidden w-full mx-6 shadow-lg text-sm'>
                <CardContent className="p-3 flex justify-between items-center">
                <span className='font-semibold ring-1 ring-muted-foreground py-1 px-2 text-center rounded-md my-auto w-8 h-8 flex items-center justify-center'>{item.index}</span>
                    <span className='p-1 pl-4 rounded-md flex-grow overflow-hidden break-words'>{videoTitle}</span>
                    <a
                        className="inline-flex items-center gap-x-2 border text-sm p-1 ps-3 rounded-full transition-all group"
                        href={`https://youtube.com/watch?v=${item.contentDetails.videoId}&index=${item.index}`}
                    >
                        Link
                        <span className="inline-flex justify-center items-center gap-x-2 rounded-full bg-muted-foreground/15 font-semibold text-sm">
                            <ArrowTopRightIcon className="h-4 w-4 group-hover:scale-125 transition-all" />
                        </span>
                    </a>
                </CardContent>
                <CardFooter className='grid grid-cols-2 justify-evenly bg-muted rounded-b-xl px-4 py-1'>
                    <span className='font-semibold'>Video Duration:</span>
                    <span className='font-semibold'>Playback Duration:</span>
                    <span>{originalLength}</span>
                    <span>{playbackDuration}</span>
                </CardFooter>
            </Card>
        </>
    )
}