import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getBlogPostBySlug } from "@/data/blog";
import PageShell from "@/components/site/page-shell";
import { ArrowLeft, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPostBySlug(params.slug);
    if (!post) throw notFound();
    return post;
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const post = Route.useLoaderData();

  return (
    <PageShell
      title={`${post.title} — Blog DolaPay`}
      description={post.excerpt}
      canonicalUrl={`/blog/${post.slug}`}
    >
      <article className="pb-24 pt-16 md:pt-24 bg-white">
        {/* Header de l'article */}
        <header className="mx-auto max-w-3xl px-4 md:px-6 mb-12">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-medium text-navy/50 hover:text-primary transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> Retour au blog
          </Link>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary/80">
              <span className="h-px w-6 bg-primary/40"></span>
              {post.category}
            </span>
            <span className="text-navy/30 text-xs">•</span>
            <time dateTime={post.date} className="text-xs text-navy/50 font-medium">{post.date}</time>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-navy tracking-tight leading-[1.1] mb-8">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 py-6 border-y border-border">
            <img src={post.author.avatarUrl} alt={post.author.name} className="h-12 w-12 rounded-full border border-border" />
            <div>
              <div className="font-semibold text-navy">{post.author.name}</div>
              <div className="text-sm text-navy/60">{post.author.role}</div>
            </div>
          </div>
        </header>

        {/* Image de couverture */}
        <div className="mx-auto max-w-5xl px-4 md:px-6 mb-16">
          <div className="aspect-[21/9] w-full rounded-3xl overflow-hidden bg-navy/5 border border-border shadow-sm">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Contenu Markdown */}
        <div className="mx-auto max-w-2xl px-4 md:px-6">
          <div className="
            text-navy/80 text-lg leading-relaxed
            [&>p]:mb-8 
            [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-navy [&>h2]:mt-14 [&>h2]:mb-6
            [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-navy [&>h3]:mt-12 [&>h3]:mb-5
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-8 [&>ul>li]:mb-2
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-8 [&>ol>li]:mb-2
            [&>strong]:text-navy [&>strong]:font-semibold
            [&>blockquote]:border-l-4 [&>blockquote]:border-primary/20 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-navy/60 [&>blockquote]:mb-8
            [&>a]:text-primary [&>a]:underline [&>a]:underline-offset-4 hover:[&>a]:text-primary/80
          ">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          {/* CTA Bas de page (Stratégie B2B) */}
          <div className="mt-20 pt-10 border-t border-border text-center">
            <h3 className="text-2xl font-bold text-navy mb-4">Prêt à intégrer le paiement universel ?</h3>
            <p className="text-navy/60 mb-6">Rejoignez les entreprises qui utilisent DolaPay pour encaisser Mobile Money et Cartes Bancaires en Afrique.</p>
            <Link to="/auth/sign-up" className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-glow hover:bg-primary/90 transition-all">
              Créer un compte gratuit
            </Link>
          </div>
        </div>
      </article>
    </PageShell>
  );
}
