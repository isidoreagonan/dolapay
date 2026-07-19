import Container from "@/components/container";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { useToast } from "@/hooks/use-toast";
import { BlogPost } from "@/lib/services/blog-service";
import { Facebook, Link2, Linkedin, Twitter } from "lucide-react";

interface BlogDetailsHeroProps {
    post?: BlogPost | null;
}

const BlogDetailsHero = ({ post }: BlogDetailsHeroProps) => {
    const { toast } = useToast();

    if (!post) {
        return null;
    }

    const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
    const encodedUrl = encodeURIComponent(pageUrl);
    const encodedTitle = encodeURIComponent(post.title);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(pageUrl);
            toast({
                title: "Link copied!",
                description: "The page URL has been copied to your clipboard.",
            });
        } catch (err) {
            toast({
                title: "Failed to copy",
                description: "Could not copy link to clipboard.",
                variant: "destructive",
            });
        }
    };

    const shareLinks = {
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    };

    const openShareWindow = (url: string) => {
        window.open(url, '_blank', 'width=600,height=400,noopener,noreferrer');
    };

    return (
        <section className="hero-padding-top">
            <Container>
                <StaggerContainer className="max-w-[1008px] mx-auto text-center mb-12">
                    <AnimateOnView blur>
                        <div className="text-muted-foreground mb-8">
                            {post.date} · {post.read_time}
                        </div>
                    </AnimateOnView>
                    <AnimateOnView blur delay={0.1}>
                        <h1 className="h1 text-white mb-4">
                            {post.title}
                        </h1>
                    </AnimateOnView>
                    <AnimateOnView blur delay={0.2} className="relative flex items-center justify-center">
                        <div className="bg-border h-[1px] absolute w-full top-1/2 -translate-y-1/2 left-0" />
                        <div className="flex items-center justify-center gap-3 bg-background relative z-10 px-4">
                            <button 
                                onClick={handleCopyLink}
                                className="text-white/40 hover:text-white transition-colors border border-border rounded-full h-10 w-10 flex items-center justify-center"
                                aria-label="Copy link to clipboard"
                            >
                                <Link2 className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => openShareWindow(shareLinks.twitter)}
                                className="text-white/40 hover:text-white transition-colors border border-border rounded-full h-10 w-10 flex items-center justify-center"
                                aria-label="Share on Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </button>

                            <button 
                                onClick={() => openShareWindow(shareLinks.facebook)}
                                className="text-white/40 hover:text-white transition-colors border border-border rounded-full h-10 w-10 flex items-center justify-center"
                                aria-label="Share on Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => openShareWindow(shareLinks.linkedin)}
                                className="text-white/40 hover:text-white transition-colors border border-border rounded-full h-10 w-10 flex items-center justify-center"
                                aria-label="Share on LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </button>
                        </div>
                    </AnimateOnView>
                </StaggerContainer>
            </Container>
        </section>
    );
};

export default BlogDetailsHero;
