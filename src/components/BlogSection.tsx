import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

const BlogSection = () => {
  const blogPosts = [
    {
      title: "10 Essential Health Tips for Remote Workers",
      excerpt:
        "Working from home can impact your health. Here are proven strategies to maintain wellness while working remotely.",
      author: "Dr. Sarah Johnson",
      date: "March 15, 2024",
      readTime: "5 min read",
      category: "Wellness",
      image: "/images/gg",
    },
    {
      title: "Understanding Telemedicine: A Complete Guide",
      excerpt:
        "Everything you need to know about virtual healthcare appointments and how to make the most of them.",
      author: "Dr. Michael Chen",
      date: "March 12, 2024",
      readTime: "8 min read",
      category: "Telemedicine",
      image: "/images/gg",
    },
    {
      title: "Mental Health in the Digital Age",
      excerpt:
        "Exploring the impact of technology on mental health and strategies for maintaining emotional well-being.",
      author: "Dr. Emily Rodriguez",
      date: "March 10, 2024",
      readTime: "6 min read",
      category: "Mental Health",
        image:
          "/images/gg",
    },
  ];

  return (
    <section id="blog" className="py-20">
      <div className="container mx-auto px-">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Health Insights & Updates
          </h2>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Stay informed with the latest health tips, medical insights, and
            wellness advice from our experts
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12 w-[90%] mx-auto">
          {blogPosts.map((post) => (
            <Card
              key={post.title}
              className="hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardHeader>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                    {post.category}
                  </span>
                  <span>{post.readTime}</span>
                </div>
                <CardTitle className="hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription>{post.excerpt}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  Read More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Articles
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
