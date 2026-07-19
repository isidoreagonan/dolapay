import {
    BlogPost,
    BlogPostInput,
    createBlogPost,
    deleteBlogPost,
    getBlogPostById,
    getBlogPostBySlug,
    getBlogPosts,
    getCategories,
    getFeaturedPosts,
    getPaginatedBlogPosts,
    getRelatedPosts,
    updateBlogPost,
    uploadBlogImage,
} from "@/lib/services/blog-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useBlogPosts = (category?: string) => {
  return useQuery<BlogPost[]>({
    queryKey: ["blogPosts", category],
    queryFn: () => getBlogPosts(category),
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery<BlogPost | null>({
    queryKey: ["blogPost", slug],
    queryFn: () => getBlogPostBySlug(slug),
    enabled: !!slug,
  });
};

export const useBlogPostById = (id: string) => {
  return useQuery<BlogPost | null>({
    queryKey: ["blogPostById", id],
    queryFn: () => getBlogPostById(id),
    enabled: !!id,
  });
};

export const useCategories = () => {
  return useQuery<string[]>({
    queryKey: ["blogCategories"],
    queryFn: getCategories,
  });
};

export const useFeaturedPosts = () => {
  return useQuery<BlogPost[]>({
    queryKey: ["featuredPosts"],
    queryFn: getFeaturedPosts,
  });
};

export const useRelatedPosts = (currentSlug: string, limit: number = 3) => {
  return useQuery<BlogPost[]>({
    queryKey: ["relatedPosts", currentSlug, limit],
    queryFn: () => getRelatedPosts(currentSlug, limit),
    enabled: !!currentSlug,
  });
};

export const usePaginatedBlogPosts = (
  page: number,
  pageSize: number = 10,
  category?: string,
  search?: string
) => {
  return useQuery({
    queryKey: ["paginatedBlogPosts", page, pageSize, category, search],
    queryFn: () => getPaginatedBlogPosts(page, pageSize, category, search),
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (post: BlogPostInput) => createBlogPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["paginatedBlogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["featuredPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogCategories"] });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, post }: { id: string; post: Partial<BlogPostInput> }) =>
      updateBlogPost(id, post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["paginatedBlogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["featuredPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogCategories"] });
      if (data) {
        queryClient.invalidateQueries({ queryKey: ["blogPost", data.slug] });
        queryClient.invalidateQueries({ queryKey: ["blogPostById", data.id] });
      }
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["paginatedBlogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["featuredPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogCategories"] });
    },
  });
};

export const useUploadBlogImage = () => {
  return useMutation({
    mutationFn: (file: File) => uploadBlogImage(file),
  });
};
