import { BlogBody } from "@/components/blog-body";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { BlogPost } from "@/lib/services/blog-service";
import { cn } from "@/lib/utils";
import DOMPurify from "dompurify";
import { useEffect, useMemo, useRef, useState } from "react";

interface BlogDetailsContentProps {
    post: BlogPost;
}

const BlogDetailsContent = ({ post }: BlogDetailsContentProps) => {
    const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
    const [activeId, setActiveId] = useState<string>("");
    const contentRef = useRef<HTMLDivElement>(null);

    // Sanitize HTML content to prevent XSS attacks
    const sanitizedContent = useMemo(() => {
        return DOMPurify.sanitize(post.content || "", {
            ALLOWED_TAGS: [
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i',
                'ul', 'ol', 'li', 'blockquote',
                'a', 'img', 'code', 'pre',
                'div', 'span', 'hr', 'table', 'thead', 'tbody', 'tr', 'td', 'th'
            ],
            ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id'],
            ALLOW_DATA_ATTR: false,
        });
    }, [post.content]);

    useEffect(() => {
        if (contentRef.current) {
            const h2Elements = contentRef.current.querySelectorAll("h2");
            const extractedHeadings = Array.from(h2Elements).map((h2) => {
                if (!h2.id) {
                    h2.id = h2.innerText.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
                }
                return {
                    id: h2.id,
                    text: h2.innerText,
                };
            });
            setHeadings(extractedHeadings);

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveId(entry.target.id);
                        }
                    });
                },
                {
                    rootMargin: "-100px 0px -60% 0px",
                    threshold: 1.0,
                }
            );

            h2Elements.forEach((h2) => observer.observe(h2));

            return () => {
                h2Elements.forEach((h2) => observer.unobserve(h2));
            };
        }
    }, [sanitizedContent]);

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <section>
            {/* Featured Image Section */}
            <AnimateOnView once blur delay={0.3}>
                <div className="max-w-[2000px] mx-auto w-full md:h-[691px] h-[300px] overflow-hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </AnimateOnView>

            <Container className="flex flex-col lg:flex-row justify-between md:gap-10 gap-6 py-[60px]">
                {/* Main Content Column */}
                <div className="max-w-[717px]" ref={contentRef}>
                    {/* Mobile Table of Contents */}
                    <div className="lg:hidden mb-12">
                        <AnimateOnView blur once delay={0.4} className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-8">
                            <h3 className="text-white text-xl font-semibold mb-6">Table of content</h3>
                            <nav className="space-y-4">
                                {headings.length > 0 ? (
                                    headings.map((heading) => (
                                        <button
                                            key={heading.id}
                                            onClick={() => scrollToHeading(heading.id)}
                                            className={cn(
                                                "flex items-center gap-2 text-sm font-medium leading-relaxed transition-all duration-300 text-left group",
                                                activeId === heading.id
                                                    ? "text-white translate-x-1"
                                                    : "text-white/40 hover:text-white"
                                            )}
                                        >
                                            <span className={cn(
                                                "w-1 h-1 rounded-full transition-all duration-300",
                                                activeId === heading.id
                                                    ? "bg-primary w-2 shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
                                                    : "bg-white/10 group-hover:bg-primary"
                                            )} />
                                            {heading.text}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-white/20 text-sm">No sections found.</p>
                                )}
                            </nav>
                        </AnimateOnView>
                    </div>

                    <BlogBody content={sanitizedContent} />
                </div>

                {/* Sidebar */}
                <aside className="max-w-[400px] w-full lg:sticky lg:top-[100px] lg:h-fit space-y-6">
                    {/* Table of Contents - Desktop */}
                    <AnimateOnView blur once delay={0.4} className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-8 hidden lg:block">
                        <h3 className="text-white text-xl font-semibold mb-6">Table of content</h3>
                        <nav className="space-y-4">
                            {headings.length > 0 ? (
                                headings.map((heading) => (
                                    <button
                                        key={heading.id}
                                        onClick={() => scrollToHeading(heading.id)}
                                        className={cn(
                                            "flex items-center gap-2 text-sm font-medium leading-relaxed transition-all duration-300 text-left group",
                                            activeId === heading.id
                                                ? "text-white translate-x-1"
                                                : "text-white/40 hover:text-white"
                                        )}
                                    >
                                        <span className={cn(
                                            "w-1 h-1 rounded-full transition-all duration-300",
                                            activeId === heading.id
                                                ? "bg-primary w-2 shadow-[0_0_8px_hsl(var(--primary)/0.5)]"
                                                : "bg-white/10 group-hover:bg-primary"
                                        )} />
                                        {heading.text}
                                    </button>
                                ))
                            ) : (
                                <p className="text-white/20 text-sm">No sections found.</p>
                            )}
                        </nav>
                    </AnimateOnView>

                    {/* Newsletter */}
                    <AnimateOnView blur once delay={0.5} className="bg-[#0A0A0A] border border-white/5 rounded-[32px] p-8">
                        <h3 className="text-white text-xl font-semibold mb-2 italic">AI & Markets: The Weekly Edge</h3>
                        <p className="text-white/40 text-sm mb-8">Unsubscribe anytime.</p>

                        <div className="space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="Enter Your Email"
                                    className="w-full bg-white/5 border border-white/10 rounded-full px-6 py-4 text-white focus:outline-none focus:border-primary/50 transition-colors"
                                />
                            </div>
                            <Button className="w-full rounded-full py-7 bg-white text-black hover:bg-white/90 font-semibold shadow-inner">
                                Send Now
                            </Button>
                        </div>
                    </AnimateOnView>
                </aside>
            </Container>
        </section>
    );
};

export default BlogDetailsContent;
