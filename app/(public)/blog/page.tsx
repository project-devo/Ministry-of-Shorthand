import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { blogPosts } from "@/lib/public-content";
import { buildMetadata } from "@/lib/site";

export const metadata = buildMetadata({
  title: "Blog",
  description:
    "Read practical shorthand learning guides, daily practice ideas, and exam-focused improvement tips.",
  path: "/blog",
});

const BlogPage = () => {
  return (
    <section className="content-auto mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12 space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Blog</p>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground">
          Practical reading for shorthand learners
        </h1>
        <p className="max-w-2xl text-base leading-7 text-muted-foreground">
          Clear, useful writing for students who want better routines, fewer mistakes, and more
          confidence in their preparation.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="rounded-[1.5rem] border border-border/70 bg-card/90 p-6 shadow-lg shadow-black/5"
          >
            <span className="mb-4 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-secondary-foreground">
              {post.category}
            </span>
            <h2 className="mb-3 text-2xl font-semibold text-foreground">{post.title}</h2>
            <p className="mb-6 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>
            <Link href="/signup" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Read soon
              <ArrowRight className="size-4" />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
};

export default BlogPage;
