import { Button } from "@/components/ui/button";
import { Zap, Users, BarChart3, Shield, Globe, Github } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-4xl flex flex-col items-center text-center">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-xl">
              <Zap className="size-6" />
            </div>
            <h1 className="text-5xl font-bold">Standard Microgrid Manager</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
            Comprehensive smart meter management platform for microgrid operations. 
            Monitor, control, and optimize your energy infrastructure with real-time insights.
          </p>
          <div className="flex gap-4 mb-12">
            <Button asChild size="lg" className="px-8">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="px-8">
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Microgrid Management</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to efficiently manage your microgrid operations and energy distribution.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border">
              <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Real-time Monitoring</h3>
              <p className="text-muted-foreground">
                Track energy generation, consumption, and distribution across all your microgrid sites with live dashboards.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border">
              <div className="bg-green-100 dark:bg-green-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Management</h3>
              <p className="text-muted-foreground">
                Manage customer accounts, billing, and energy consumption patterns with comprehensive customer profiles.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border">
              <div className="bg-purple-100 dark:bg-purple-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Meter Integration</h3>
              <p className="text-muted-foreground">
                Seamlessly integrate with smart meters and IoT devices for accurate energy measurement and control.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border">
              <div className="bg-orange-100 dark:bg-orange-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multi-site Management</h3>
              <p className="text-muted-foreground">
                Manage multiple microgrid sites from a single platform with centralized control and monitoring.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border">
              <div className="bg-red-100 dark:bg-red-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Analytics & Reporting</h3>
              <p className="text-muted-foreground">
                Generate detailed reports and analytics to optimize energy efficiency and operational performance.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border">
              <div className="bg-indigo-100 dark:bg-indigo-900/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Energy Optimization</h3>
              <p className="text-muted-foreground">
                Automatically optimize energy distribution and storage to maximize efficiency and reduce costs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join the future of microgrid management. Start monitoring and optimizing your energy infrastructure today.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="outline" asChild size="lg" className="px-8">
              <a href="https://github.com/standardmicrogrid/smm-platform" target="_blank" rel="noreferrer">
                <Github className="w-4 h-4 mr-2" />
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
