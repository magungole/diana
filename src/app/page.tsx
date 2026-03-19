import Link from 'next/link'
import { Camera, BookOpen, Calendar, Users, Star, ArrowRight, Check, ChevronRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand rounded-xl flex items-center justify-center">
              <Camera size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-brand text-sm leading-none">Diana Baker</p>
              <p className="text-slate-400 text-xs">Business Coaching</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="#about" className="text-sm text-slate-600 hover:text-brand transition-colors">About</Link>
            <Link href="#programmes" className="text-sm text-slate-600 hover:text-brand transition-colors">Programmes</Link>
            <Link href="#community" className="text-sm text-slate-600 hover:text-brand transition-colors">Community</Link>
            <Link href="/login" className="text-sm text-slate-600 hover:text-brand transition-colors">Login</Link>
          </div>

          <Link
            href="/signup"
            className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors shadow-sm"
          >
            Get started free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-cream" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 20%, #c8a96e22 0%, transparent 50%), radial-gradient(circle at 20% 80%, #0f172a11 0%, transparent 50%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-gold/10 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
              <Star size={14} className="fill-gold text-gold" />
              Trusted by 500+ photographers worldwide
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-brand leading-tight mb-6">
              Build the Photography Business{' '}
              <span className="text-gold">You&apos;ve Always Dreamed Of</span>
            </h1>

            <p className="text-xl text-slate-500 leading-relaxed mb-10 max-w-2xl mx-auto">
              Diana Baker&apos;s coaching platform gives you the frameworks, community, and
              accountability to transform your photography passion into a profitable business.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-brand text-white px-8 py-4 rounded-xl font-medium hover:bg-slate-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Start Free Trial
                <ArrowRight size={18} />
              </Link>
              <Link
                href="#programmes"
                className="inline-flex items-center gap-2 border border-brand text-brand px-8 py-4 rounded-xl font-medium hover:bg-brand hover:text-white transition-all"
              >
                See Programmes
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          {/* Hero image/mockup placeholder */}
          <div className="mt-20 max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
              <div className="bg-brand h-12 flex items-center px-6 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 mx-4 bg-white/10 rounded-md h-6" />
              </div>
              <div className="p-8 grid grid-cols-3 gap-6">
                <div className="col-span-1 space-y-3">
                  {['Dashboard', 'Courses', 'Classes', 'Community', 'Resources'].map(
                    (item) => (
                      <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-cream">
                        <div className="w-8 h-8 bg-gold/20 rounded-lg" />
                        <div className="h-3 bg-slate-200 rounded flex-1" />
                      </div>
                    )
                  )}
                </div>
                <div className="col-span-2 space-y-4">
                  <div className="h-8 bg-slate-100 rounded-xl w-2/3" />
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="bg-cream rounded-2xl p-4 border border-slate-100">
                        <div className="h-24 bg-gradient-to-br from-gold/20 to-brand/10 rounded-xl mb-3" />
                        <div className="h-3 bg-slate-200 rounded mb-2" />
                        <div className="h-2 bg-slate-100 rounded w-2/3" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="bg-brand py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-white/70 text-sm">
            <span className="font-semibold text-white text-base">
              Join 500+ photographers transforming their businesses
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-gold text-gold" />
              ))}
              <span className="ml-1">4.9/5 average rating</span>
            </div>
            <span>Wedding · Portrait · Commercial · Fine Art</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand mb-4">
              Everything you need to grow your business
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              A complete coaching ecosystem designed specifically for photographers at every
              stage of their business journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Expert-Led Courses',
                description:
                  'Step-by-step courses on pricing, client experience, marketing, and business systems. Learn at your own pace with video lessons and practical exercises.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: Calendar,
                title: 'Live Group Coaching',
                description:
                  'Weekly live sessions with Diana and guest experts. Get your questions answered, celebrate wins, and stay accountable with group coaching calls.',
                color: 'bg-amber-50 text-amber-600',
              },
              {
                icon: Users,
                title: 'Supportive Community',
                description:
                  "Connect with photographers at similar stages, share wins and challenges, get feedback on your work, and build friendships that last.",
                color: 'bg-emerald-50 text-emerald-600',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-cream rounded-2xl p-8 border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon size={22} />
                </div>
                <h3 className="text-xl font-semibold text-brand mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand mb-4">How it works</h2>
            <p className="text-xl text-slate-500">Three simple steps to transform your photography business</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-gold/40 to-gold/40" />

            {[
              {
                step: '01',
                title: 'Join the Community',
                description:
                  'Sign up for free and get immediate access to starter courses, community posts, and your first coaching resources.',
              },
              {
                step: '02',
                title: 'Follow the Framework',
                description:
                  'Work through Diana&apos;s proven business framework. Set your pricing, build your brand, and implement marketing systems.',
              },
              {
                step: '03',
                title: 'Grow with Support',
                description:
                  'Join weekly group coaching calls, connect with the community, and get personalised feedback as you scale your business.',
              },
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-20 h-20 bg-brand rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-gold font-bold text-2xl">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-brand mb-3">{step.title}</h3>
                <p
                  className="text-slate-500 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: step.description }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section id="programmes" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-bold text-brand mb-2">Featured Programmes</h2>
              <p className="text-slate-500">Start with a course that matches where you are right now</p>
            </div>
            <Link
              href="/signup"
              className="hidden md:flex items-center gap-2 text-brand font-medium hover:text-gold transition-colors"
            >
              View all courses <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Pricing with Confidence',
                description:
                  'Stop undercharging and start attracting clients who value your work. Build a pricing strategy that supports your lifestyle.',
                level: 'Free',
                lessons: '12 lessons',
                duration: '4 hours',
                gradient: 'from-slate-800 to-slate-600',
              },
              {
                title: 'Marketing Mastery for Photographers',
                description:
                  'Build a consistent client pipeline using organic marketing, social media, and referral systems tailored to photographers.',
                level: 'Member',
                lessons: '24 lessons',
                duration: '8 hours',
                gradient: 'from-amber-700 to-amber-500',
              },
              {
                title: 'Scale to Six Figures',
                description:
                  'The complete business system for photographers ready to reach consistent £10k+ months through premium packages and multiple revenue streams.',
                level: 'Premium',
                lessons: '36 lessons',
                duration: '14 hours',
                gradient: 'from-brand to-slate-700',
              },
            ].map((course, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div
                  className={`h-48 bg-gradient-to-br ${course.gradient} flex items-end p-6`}
                >
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      course.level === 'Free'
                        ? 'bg-emerald-400 text-white'
                        : course.level === 'Member'
                        ? 'bg-gold text-white'
                        : 'bg-white text-brand'
                    }`}
                  >
                    {course.level}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-brand text-lg mb-2">{course.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                    <span>{course.lessons}</span>
                    <span>•</span>
                    <span>{course.duration}</span>
                  </div>
                  <Link
                    href="/signup"
                    className="w-full inline-flex items-center justify-center gap-2 bg-brand text-white py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                  >
                    Enrol now <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-cream">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand mb-4">Real results from real photographers</h2>
            <p className="text-xl text-slate-500">Hear what our members say about their experience</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah Johnson',
                niche: 'Wedding Photographer, London',
                quote:
                  "I doubled my prices within 3 months of joining. Diana's pricing framework completely changed how I see my value. I now attract clients who genuinely appreciate quality.",
                result: 'Doubled her prices',
                initials: 'SJ',
              },
              {
                name: 'Marcus Chen',
                niche: 'Portrait Photographer, Manchester',
                quote:
                  "The community alone is worth it. I was so isolated running my business solo. Now I have a network of photographers I can learn from, celebrate with, and lean on.",
                result: 'Built his dream network',
                initials: 'MC',
              },
              {
                name: 'Emma Williams',
                niche: 'Commercial Photographer, Bristol',
                quote:
                  "I went from £2k to £8k months in under a year following Diana's programme. The accountability and coaching made all the difference. Best investment I've made.",
                result: '4x revenue increase',
                initials: 'EW',
              },
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={16} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-brand text-sm">{testimonial.name}</p>
                    <p className="text-slate-400 text-xs">{testimonial.niche}</p>
                  </div>
                  <span className="ml-auto bg-emerald-50 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {testimonial.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-brand mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-slate-500">Choose the plan that fits your stage and goals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Free',
                period: 'forever',
                description: 'Perfect for exploring and getting started',
                features: [
                  'Access to free courses',
                  'Community read access',
                  'Monthly group Q&A',
                  'Resource library basics',
                ],
                cta: 'Get started free',
                href: '/signup',
                highlighted: false,
              },
              {
                name: 'Member',
                price: '£49',
                period: 'per month',
                description: 'For photographers ready to grow',
                features: [
                  'All free features',
                  'Full course library access',
                  'Weekly live coaching calls',
                  'Full community access',
                  'Complete resource library',
                  'Replay archive',
                ],
                cta: 'Start free trial',
                href: '/signup',
                highlighted: true,
              },
              {
                name: 'Premium',
                price: '£97',
                period: 'per month',
                description: 'For serious photographers scaling fast',
                features: [
                  'All Member features',
                  'Premium courses & masterclasses',
                  '1:1 monthly coaching call',
                  'Priority community support',
                  'Business audit & feedback',
                  'Guest expert sessions',
                ],
                cta: 'Go Premium',
                href: '/signup',
                highlighted: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 border ${
                  plan.highlighted
                    ? 'bg-brand border-brand shadow-xl scale-105'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-gold text-white text-xs font-semibold px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3
                  className={`text-xl font-semibold mb-1 ${
                    plan.highlighted ? 'text-white' : 'text-brand'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm mb-6 ${
                    plan.highlighted ? 'text-white/60' : 'text-slate-400'
                  }`}
                >
                  {plan.description}
                </p>
                <div className="mb-8">
                  <span
                    className={`text-4xl font-bold ${
                      plan.highlighted ? 'text-white' : 'text-brand'
                    }`}
                  >
                    {plan.price}
                  </span>
                  <span
                    className={`text-sm ml-1 ${
                      plan.highlighted ? 'text-white/60' : 'text-slate-400'
                    }`}
                  >
                    /{plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm">
                      <Check
                        size={16}
                        className={plan.highlighted ? 'text-gold' : 'text-emerald-500'}
                      />
                      <span className={plan.highlighted ? 'text-white/80' : 'text-slate-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.href}
                  className={`w-full inline-flex items-center justify-center py-3 rounded-xl font-medium text-sm transition-all ${
                    plan.highlighted
                      ? 'bg-gold text-white hover:bg-amber-600'
                      : 'bg-brand text-white hover:bg-slate-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 bg-brand relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 50%, #c8a96e 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to invest in your photography business?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Join hundreds of photographers who have transformed their passion into a
            profitable, sustainable business with Diana&apos;s guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-gold text-white px-8 py-4 rounded-xl font-semibold hover:bg-amber-600 transition-all shadow-lg"
            >
              Start your free trial
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-xl font-medium hover:bg-white/10 transition-all"
            >
              Already a member? Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center">
                  <Camera size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white">Diana Baker</p>
                  <p className="text-white/50 text-xs">Business Coaching</p>
                </div>
              </div>
              <p className="text-white/60 leading-relaxed max-w-sm">
                Empowering photographers to build profitable businesses they love through
                expert coaching, community, and proven frameworks.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                {['Courses', 'Live Classes', 'Community', 'Resources'].map((item) => (
                  <li key={item}>
                    <Link href="/signup" className="text-white/60 hover:text-white text-sm transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {['About Diana', 'Testimonials', 'Pricing', 'Contact'].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2025 Diana Baker Business Coaching. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
