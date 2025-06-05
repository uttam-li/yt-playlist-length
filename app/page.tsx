import SearchBar from "@/components/search-bar";
import { GithubIcon } from "lucide-react";
import {
  ArrowTopRightIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-30">
        {/* Enhanced Gradients - Dark Mode Compatible */}
        <div
          aria-hidden="true"
          className="flex absolute -top-96 start-1/2 transform -translate-x-1/2"
        >
          <div className="bg-gradient-to-r from-red-100/30 to-orange-100/30 dark:from-red-900/20 dark:to-orange-900/20 blur-3xl w-[15rem] sm:w-[20rem] lg:w-[25rem] h-[30rem] sm:h-[35rem] lg:h-[44rem] rotate-[-60deg] transform -translate-x-[5rem] sm:-translate-x-[8rem] lg:-translate-x-[10rem]" />
          <div className="bg-gradient-to-tl from-slate-50/50 via-gray-50/50 to-slate-50/50 dark:from-slate-800/30 dark:via-gray-800/30 dark:to-slate-800/30 blur-3xl w-[60rem] sm:w-[75rem] lg:w-[90rem] h-[35rem] sm:h-[42rem] lg:h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[10rem] sm:-translate-x-[12rem] lg:-translate-x-[15rem]" />
        </div>
        {/* End Gradients */}

        <div className="relative z-10">
          <div className="container px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 lg:pt-16">
            <div className="max-w-4xl text-center mx-auto">
              {/* Social Links - Responsive Design */}
              <div className="flex sm:flex-row justify-center items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <a
                  className="inline-flex items-center gap-x-2 border border-border hover:border-border/80 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all group hover:bg-accent/50 backdrop-blur-sm w-full sm:w-auto justify-center"
                  href="https://github.com/uttam-li/yt-playlist-length"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <GitHubLogoIcon className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    GitHub
                  </span>
                  <ArrowTopRightIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground group-hover:text-foreground group-hover:scale-110 transition-all" />
                </a>

                <a
                  className="inline-flex items-center gap-x-2 border border-border hover:border-blue-300 dark:hover:border-blue-600 text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all group hover:bg-blue-50/50 dark:hover:bg-blue-950/30 backdrop-blur-sm w-full sm:w-auto justify-center"
                  href="https://twitter.com/@l1kh1yauttam"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterLogoIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                  <span className="text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Twitter
                  </span>
                  <ArrowTopRightIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-110 transition-all" />
                </a>
              </div>

              {/* Enhanced Title Section - Responsive Typography */}
              <div className="space-y-4 sm:space-y-6">
                <h1 className="scroll-m-20 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent leading-tight">
                  YouTube Playlist
                  <span className="block bg-gradient-to-r from-red-600 to-red-500 dark:from-red-400 dark:to-red-500 bg-clip-text text-transparent">
                    Duration Calculator
                  </span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto px-4 sm:px-0">
                  Instantly calculate the total duration of any YouTube
                  playlist.
                  <span className="block mt-1 sm:mt-2 font-medium">
                    Just paste the URL and get detailed time breakdown.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section with Enhanced Styling */}
      <div className="relative px-4 sm:px-6 lg:px-8">
        <SearchBar />
      </div>
    </>
  );
}
