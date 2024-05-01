import SearchBar from "@/components/search-bar";
import { GithubIcon } from "lucide-react";
import { ArrowTopRightIcon, GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons"

export default function Home() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden pt-24 lg:pt-30">
        {/* Gradients */}
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
        >
        </div>
        {/* End Gradients */}
        <div className="relative z-10">
          <div className="container pt-10 lg:pt-16">
            <div className="max-w-2xl text-center mx-auto">
              <span className="inline-flex">
              <a
                className="inline-flex items-center gap-x-2 border text-sm p-1 ps-3 rounded-full transition-all group"
                href="https://github.com/uttam-li/yt-playlist-length"
              >
                View Code on <GitHubLogoIcon className="bg-secondary h-4 w-4 rounded-full" />
                <span className="py-1.5 px-2.5 inline-flex justify-center items-center gap-x-2 rounded-full bg-muted-foreground/15 font-semibold text-sm">
                  <ArrowTopRightIcon className="h-4 w-4 group-hover:scale-125 transition-all" />
                </span>
              </a>
              <a
                className="inline-flex items-center ml-2 gap-x-2 border text-sm p-2 rounded-full transition-all group"
                href="https://twitter.com/@l1kh1yauttam"
              >
                <TwitterLogoIcon className="h-6 w-6" />
              </a>
              </span>
              {/* Title */}
              <div className="mt-5 max-w-2xl">

                <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                  YouTube Playlist Duration
                </h1>
              </div>
              {/* End Title */}
              <div className="mt-5 max-w-3xl">
                <p className="text-muted-foreground md:text-xl">
                  Calculate the total duration of any YouTube playlist. Just paste the playlist URL and get the total time.
                </p>
              </div>
              {/* Buttons */}
              {/* End Buttons */}
            </div>
          </div>
        </div>
      </div>
      <SearchBar />
      {/* End Hero */}
    </>
  );
}