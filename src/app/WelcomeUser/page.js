import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Target, TrendingUp, Calendar, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "../globals.css";

export default function WelcomeUser() {
  return (
    <div className="flex flex-col min-h-screen ">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b  h-15">
        <Link href="/" className="flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-lg font-bold">GoalTodo</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Pricing
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            About
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Turn Your Dreams Into{" "}
                    <span className="text-blue-600">Achievable Goals</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl">
                    Break down your biggest aspirations into manageable tasks.
                    Our smart todo system helps you stay focused, track
                    progress, and celebrate every milestone on your journey to
                    success.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Start Achieving Today
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    Watch Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Free to start</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>No credit card required</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  width="600"
                  height="400"
                  alt="Goal Achievement Dashboard"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-50"
        >
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Your Goals, Simplified
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Transform overwhelming goals into a clear, actionable roadmap.
                  Our proven system helps you maintain momentum and achieve
                  consistent progress.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <Target className="h-10 w-10 text-blue-600" />
                  <CardTitle>Goal Breakdown</CardTitle>
                  <CardDescription>
                    Break large goals into smaller, manageable tasks that feel
                    achievable and keep you motivated.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <TrendingUp className="h-10 w-10 text-blue-600" />
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>
                    Visualize your progress with intuitive charts and celebrate
                    milestones as you move closer to your goals.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Calendar className="h-10 w-10 text-blue-600" />
                  <CardTitle>Smart Scheduling</CardTitle>
                  <CardDescription>
                    Prioritize tasks based on deadlines and importance, ensuring
                    you focus on what matters most.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <Image
                src="/placeholder.svg?height=400&width=600"
                width="600"
                height="400"
                alt="Progress Visualization"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                    Why Todo Lists Are Goal Achievers' Secret Weapon
                  </h2>
                  <p className="text-gray-600 md:text-lg">
                    Research shows that people who write down their goals are
                    42% more likely to achieve them. Here's how our todo system
                    amplifies that success:
                  </p>
                </div>
                <ul className="grid gap-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Clear Direction</h3>
                      <p className="text-sm text-gray-600">
                        Transform vague aspirations into specific, actionable
                        steps
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Momentum Building</h3>
                      <p className="text-sm text-gray-600">
                        Each completed task creates positive momentum toward
                        your bigger goals
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Accountability</h3>
                      <p className="text-sm text-gray-600">
                        Visual progress tracking keeps you accountable to your
                        commitments
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold">Stress Reduction</h3>
                      <p className="text-sm text-gray-600">
                        Organized tasks reduce mental clutter and decision
                        fatigue
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Success Stories
                </h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See how others have transformed their dreams into reality
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-blue-600 text-blue-600"
                        />
                      ))}
                    </div>
                  </div>
                  <CardDescription>
                    "I finally finished writing my novel! Breaking it down into
                    daily writing tasks made it feel possible instead of
                    overwhelming."
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-semibold">S</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Sarah Chen</p>
                      <p className="text-xs text-gray-600">Published Author</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-blue-600 text-blue-600"
                        />
                      ))}
                    </div>
                  </div>
                  <CardDescription>
                    "Lost 30 pounds by breaking my fitness goal into daily
                    workouts and meal prep tasks. The progress tracking kept me
                    motivated!"
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-semibold">M</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Mike Rodriguez</p>
                      <p className="text-xs text-gray-600">
                        Fitness Enthusiast
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-blue-600 text-blue-600"
                        />
                      ))}
                    </div>
                  </div>
                  <CardDescription>
                    "Launched my startup by organizing every step from business
                    plan to first customer. This system made the impossible feel
                    manageable."
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-semibold">A</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Alex Thompson</p>
                      <p className="text-xs text-gray-600">Entrepreneur</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Ready to Achieve Your Goals?
                </h2>
                <p className="max-w-[600px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of goal achievers who have transformed their
                  dreams into reality. Start your journey today.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="max-w-lg flex-1"
                  />
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-gray-600">
                  Start free. No credit card required.{" "}
                  <Link
                    href="/privacy"
                    className="underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto max-w-7xl">
            <div className="grid gap-6 lg:grid-cols-4 md:grid-cols-2">
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-3xl font-bold text-blue-600">10,000+</div>
                <div className="text-sm text-gray-600">Goals Achieved</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-3xl font-bold text-blue-600">5,000+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-3xl font-bold text-blue-600">42%</div>
                <div className="text-sm text-gray-600">Higher Success Rate</div>
              </div>
              <div className="flex flex-col items-center space-y-2 text-center">
                <div className="text-3xl font-bold text-blue-600">4.9/5</div>
                <div className="text-sm text-gray-600">User Rating</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} GoalTodo. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}
