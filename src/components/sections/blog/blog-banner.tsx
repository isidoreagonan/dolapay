import BlogCard from "@/components/ui/blog-card";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPosts, useCategories, useFeaturedPosts } from "@/hooks/use-blog";
import { cn } from "@/lib/utils";
import { Link, useSearchParams } from "@tanstack/react-router";
import Container from "../../container";

const BlogBanner = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category") || undefined;

  const { data: blogPosts, isLoading } = useBlogPosts(categoryFilter);
  const { data: featuredPosts, isLoading: featuredLoading } = useFeaturedPosts();
  const { data: categories } = useCategories();

  const handleCategoryClick = (category?: string) => {
    if (category) {
      setSearchParams({ category });
    } else {
      setSearchParams({});
    }
  };

  return (
    <section className="hero-padding-top pb-20 bg-[url(/images/common/banner-gradient.webp)] bg-cover">
      <Container className="md:space-y-16 space-y-12">
        {/* Hero Section */}
        <StaggerContainer className="text-center md:max-w-[640px] max-w-sm mx-auto">
          <AnimateOnView blur>
            <h1 className="h1 mb-5">Insights & Updates</h1>
          </AnimateOnView>
          <AnimateOnView blur delay={0.2}>
            <p className="text-lg text-muted-foreground">
              Explore the latest trends, tips, and insights in fintech and
              payments. Stay ahead with expert articles from our team.
            </p>
          </AnimateOnView>

          {/* Trust Badges */}
          <AnimateOnView blur delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`/images/common/brand-${i}.svg`}
                  alt={`Brand ${i}`}
                  className="h-6 opacity-50"
                />
              ))}
            </div>
          </AnimateOnView>
        </StaggerContainer>

        {/* Featured Posts */}
        {!categoryFilter && (
          <div className="space-y-6">
            <h2 className="h3">Featured Posts</h2>
            {featuredLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[16/10] rounded-2xl" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {featuredPosts?.map((post, index) => (
                  <AnimateOnView key={post.id} once y={40} delay={index * 0.1}>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="group block h-full"
                    >
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-4">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <span className="text-primary text-sm font-medium">
                            {post.category}
                          </span>
                          <h3 className="text-xl font-semibold mt-1 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground text-sm">
                        <span>{post.date}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                        <span>{post.read_time}</span>
                        <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                        <span>By {post.author}</span>
                      </div>
                    </Link>
                  </AnimateOnView>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleCategoryClick()}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              !categoryFilter
                ? "bg-primary text-white"
                : "bg-white/10 text-muted-foreground hover:text-foreground"
            )}
          >
            All
          </button>
          {categories?.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                categoryFilter === cat
                  ? "bg-primary text-white"
                  : "bg-white/10 text-muted-foreground hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-white/10 rounded-2xl aspect-[4/3] mb-6" />
                <div className="space-y-3">
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                  <div className="h-6 bg-white/10 rounded w-full" />
                  <div className="h-4 bg-white/10 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : blogPosts?.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No blog posts found
              {categoryFilter && ` in "${categoryFilter}" category`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts?.map((post, index) => (
              <AnimateOnView key={post.id} once y={40} delay={index * 0.1}>
                <BlogCard post={post} />
              </AnimateOnView>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default BlogBanner;
