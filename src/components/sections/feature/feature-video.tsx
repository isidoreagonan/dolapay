import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Play } from "lucide-react";
import { useState } from "react";


interface VideoTestimonialCardProps {
    thumbnail: string;
    videoUrl: string;
    className?: string;
}

// Helper function to convert YouTube URL to embed format
const getYouTubeEmbedUrl = (url: string): string => {
    // If already an embed URL, return as is
    if (url.includes("youtube.com/embed")) {
        return url;
    }

    // Extract video ID from various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
        }
    }

    // If no pattern matches, assume it's already a video ID or return the URL as is
    return url.startsWith("http") ? url : `https://www.youtube.com/embed/${url}?autoplay=1`;
};

const FeatureVideo = ({
    thumbnail,
    videoUrl,
    className = "",
}: VideoTestimonialCardProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const embedUrl = getYouTubeEmbedUrl(videoUrl);

    return (
        <>
            <div
                className={`group relative aspect-[16/9] w-full overflow-hidden md:rounded-[40px] rounded-lg border border-white/10 cursor-pointer ${className}`}
                onClick={() => setIsOpen(true)}
            >
                <img
                    src={thumbnail || "/images/common/placeholder.svg"}
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay to mimic the moody tea-office lighting */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-white ml-1" />
                    </div>
                </div>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-[90vw] sm:max-w-4xl p-0 overflow-hidden bg-black border-zinc-800">
                    <div className="aspect-video w-full">
                        <iframe
                            src={embedUrl}
                            title="Video testimonial"
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default FeatureVideo;

