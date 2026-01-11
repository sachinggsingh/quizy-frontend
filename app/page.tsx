"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/lib/hooks"
import { HomeHeader } from "@/components/home-header"
import { FeatureCard } from "@/components/feature-card"
import { Trophy, Zap, Users, BookOpen, BarChart3, Target } from "lucide-react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-card/20 to-background">
      <HomeHeader />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-balance text-foreground">
              Challenge Yourself with{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">QuizMaster</span>
            </h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Test your knowledge, compete with friends, and climb the global leaderboard. Engage your mind with
              carefully crafted quizzes across multiple topics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {mounted && isAuthenticated ? (
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12">
                <Link href="/sign-up">Start Taking Quizzes</Link>
              </Button>
            )}
            {mounted && isAuthenticated && (
              <Button asChild variant="outline" size="lg" className="border-border/50 bg-transparent px-8 h-12">
                <Link href="/leaderboard">View Leaderboard</Link>
              </Button>
            )}
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-3 gap-4 pt-12 max-w-xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-primary/20 p-4">
              <p className="text-2xl font-bold text-primary">10K+</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-primary/20 p-4">
              <p className="text-2xl font-bold text-primary">500+</p>
              <p className="text-xs text-muted-foreground">Quizzes</p>
            </div>
            <div className="bg-card/50 backdrop-blur-sm rounded-lg border border-primary/20 p-4">
              <p className="text-2xl font-bold text-primary">50K+</p>
              <p className="text-xs text-muted-foreground">Attempts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-foreground">Why Choose QuizMaster?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to test your knowledge and compete globally
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Zap className="w-6 h-6" />}
              title="Instant Feedback"
              description="Get immediate results and detailed explanations for every question to enhance your learning."
            />
            <FeatureCard
              icon={<Trophy className="w-6 h-6" />}
              title="Competitive Rankings"
              description="Climb the global leaderboard and compete with thousands of users worldwide."
            />
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Diverse Topics"
              description="Explore hundreds of quizzes across science, history, technology, and more."
            />
            <FeatureCard
              icon={<Users className="w-6 h-6" />}
              title="Social Features"
              description="Challenge friends, share achievements, and build your learning community."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6" />}
              title="Progress Tracking"
              description="Monitor your improvement with detailed analytics and performance insights."
            />
            <FeatureCard
              icon={<Target className="w-6 h-6" />}
              title="Personalized Learning"
              description="Get quiz recommendations tailored to your interests and skill level."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-foreground">How It Works</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Get started in just a few simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Create Account",
                description: "Sign up with your email and start your quiz journey in seconds.",
              },
              {
                step: "2",
                title: "Choose Quizzes",
                description: "Browse our collection and pick quizzes that match your interests.",
              },
              {
                step: "3",
                title: "Compete & Learn",
                description: "Take quizzes, earn points, and climb the leaderboard with every attempt.",
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent text-lg font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h4 className="text-xl font-bold text-foreground">{item.title}</h4>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 text-4xl text-primary/30">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h3 className="text-4xl md:text-5xl font-bold text-foreground">What Our Users Say</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Join thousands of learners worldwide</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Alex Johnson",
                role: "Student",
                content: "QuizMaster helped me ace my exams! The diverse question types really tested my knowledge.",
                avatar: "AJ",
              },
              {
                name: "Sarah Chen",
                role: "Teacher",
                content: "An excellent tool for assessing student knowledge. My students love the competitive aspect.",
                avatar: "SC",
              },
              {
                name: "Mike Rodriguez",
                role: "Professional",
                content: "Great for keeping my skills sharp. The leaderboard motivates me to stay on top of things.",
                avatar: "MR",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg p-6 space-y-4 hover:border-primary/50 transition-colors"
              >
                <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-primary-foreground">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 rounded-2xl p-12 md:p-16 text-center space-y-6">
          <h3 className="text-4xl md:text-5xl font-bold text-foreground">Ready to Test Your Knowledge?</h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join QuizMaster today and start your learning journey with thousands of engaging quizzes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12">
              <Link href="/sign-up">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border/50 bg-transparent px-8 h-12">
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Social</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">Q</span>
                </div>
                <p className="text-sm text-muted-foreground">© 2026 QuizMaster. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
