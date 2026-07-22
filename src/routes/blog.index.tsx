import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import PageShell from "@/components/site/page-shell";
import PageHero from "@/components/site/page-hero";
import { ArrowRight, BookOpen } from "lucide-react";
import { blogPosts } from "@/data/blog";

export const Route = createFileRoute("/blog/")({
  component: BlogIndexPage,
});

function BlogIndexPage() {
  return (
    <PageShell
      title="Blog & Actualités — DolaPay"
      description="Découvrez les dernières actualités de DolaPay, nos études de cas et notre vision sur l'infrastructure financière en Afrique."
      canonicalUrl="/blog"
    >
      <PageHero
        title={<>Actualités & <span className="text-primary">Insights</span>.</>}
        description="L'actualité de l'infrastructure financière en Afrique, racontée par ceux qui la construisent."
      />

      <section className="py-16 md:py-24 bg-[#F5F8FF] min-h-[500px]">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group flex flex-col rounded-3xl bg-white border border-border overflow-hidden hover:shadow-card transition-shadow"
              >
                <Link to={`/blog/${post.slug}`} className="block relative overflow-hidden aspect-[16/10] bg-navy/5">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm">
                      <BookOpen className="h-3 w-3" />
                      {post.category}
                    </span>
                  </div>
                </Link>

                <div className="flex flex-col flex-grow p-6 md:p-8">
                  <div className="flex items-center gap-2 text-xs text-navy/50 mb-4">
                    <time dateTime={post.date}>{post.date}</time>
                  </div>
                  
                  <Link to={`/blog/${post.slug}`} className="block group-hover:text-primary transition-colors">
                    <h2 className="text-xl font-bold text-navy leading-tight line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="mt-3 text-sm text-navy/60 leading-relaxed line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>

                  <div className="mt-6 pt-5 border-t border-border flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        className="h-8 w-8 rounded-full border border-border"
                      />
                      <div>
                        <div className="text-xs font-semibold text-navy">{post.author.name}</div>
                        <div className="text-[10px] text-navy/50">{post.author.role}</div>
                      </div>
                    </div>
                    <Link to={`/blog/${post.slug}`} className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
