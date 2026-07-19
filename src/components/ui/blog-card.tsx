import { BlogPost } from "@/lib/services/blog-service";
import { Link } from "@tanstack/react-router";

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard = ({ post }: BlogCardProps) => {
  return (
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      <div className="flex flex-col h-full rounded-3xl overflow-hidden transition-colors duration-300">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="pt-6 pb-2 px-1 flex flex-col gap-3 flex-grow justify-between">
          <div className="flex items-center gap-2 text-lg font-medium">
            <span className="text-primary">{post.category}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            <span className="text-muted-foreground">{post.read_time}</span>
          </div>

          <h3 className="h4 group-hover:text-primary transition-colors duration-200">
            {post.title}
          </h3>
          
          <div className="flex items-center justify-between text-muted-foreground text-lg font-medium mt-1">
            <span>{post.date}</span>
            <span>By {post.author}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
