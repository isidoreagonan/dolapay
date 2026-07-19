import { ReactNode } from "react";

interface BlogContainerProps {
    children: ReactNode;
    className?: string;
}

export function BlogContainer({ children, className = "" }: BlogContainerProps) {
    return (
        <section
            className={`w-full max-w-3xl mx-auto px-6 md:px-8 py-12 md:py-16 ${className}`}
        >
            {children}
        </section>
    );
}


export function BlogBody({ content }: { content: string }) {
    return (
        <div className={`
          font-sans text-foreground prose prose-lg max-w-none
          
          [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-6 [&_h1]:text-white
          [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-semibold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-white
          [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-white
          [&_h4]:text-lg [&_h4]:md:text-xl [&_h4]:font-medium [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:text-white

          [&_p]:text-base [&_p]:md:text-lg [&_p]:mb-6 [&_p]:leading-relaxed [&_p]:text-white/60
          [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80

          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2
          [&_li]:text-base [&_li]:md:text-lg [&_li]:leading-relaxed [&_li]:text-white/60

          [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-6 [&_blockquote]:my-8 [&_blockquote]:italic
          [&_blockquote_p]:text-lg [&_blockquote_p]:text-white/80 [&_blockquote_p]:font-medium

          [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6
          [&_code]:bg-muted [&_code]:text-white [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm
          [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-gray-100

          [&_hr]:border-border [&_hr]:my-8
          [&_strong]:font-semibold [&_strong]:text-white
          [&_img]:rounded-lg [&_img]:shadow-md [&_img]:my-8
        `}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    );
}

