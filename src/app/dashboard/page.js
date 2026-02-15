'use client';
import FeatureCard from '@/components/dashboard/FeatureCard';
import ExamTypeCard from '@/components/dashboard/ExamTypeCard';
import UserTypeCard from '@/components/dashboard/UserTypeCard';
import SecurityFeatureCard from '@/components/dashboard/SecurityFeatureCard';
import TestimonialCard from '@/components/dashboard/TestimonialCard';
import StatsCounter from '@/components/dashboard/StatsCounter';
import { 
  GraduationCap, 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Clock, 
  FileCheck, 
  BarChart3, 
  Users, 
  Building2, 
  BookOpen, 
  CheckCircle2, 
  Shuffle, 
  Lock, 
  Award,
  FileText,
  Timer,
  Target,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  Star
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function LandingPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    exams: 0,
    students: 0,
    institutes: 0
  });

  useEffect(() => {
    // Fetch live stats from Firestore
    fetchStatsData();
  }, []);

  const fetchStatsData = async () => {
    try {
      // Import the server action dynamically
      const { fetchLiveStats } = await import('@/api/actions/stats');
      const result = await fetchLiveStats();
      
      if (result.success) {
        setStats(result.stats);
      } else {
        // Use fallback values if fetch fails
        setStats({
          exams: 15420,
          students: 50000,
          institutes: 500
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use fallback values
      setStats({
        exams: 15420,
        students: 50000,
        institutes: 500
      });
    }
  };

  const features = [
    {
      icon: Clock,
      title: "Easy Exam Creation",
      description: "Create comprehensive exams in minutes with our intuitive interface. Add questions, set timers, and schedule with ease."
    },
    {
      icon: Shield,
      title: "Secure & Cheat-Proof",
      description: "Advanced security measures including question randomization, time limits, and auto-submission ensure fair assessments."
    },
    {
      icon: BarChart3,
      title: "Instant Results",
      description: "Auto-evaluation for MCQs with detailed analytics. Get instant scorecards and comprehensive performance reports."
    },
    {
      icon: Globe,
      title: "Works Anywhere",
      description: "Students can take exams from any device - mobile, tablet, or desktop. No app installation required."
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Secure login system with different access levels for Admins, Teachers, and Students."
    },
    {
      icon: FileCheck,
      title: "Smart Evaluation",
      description: "Automated checking for objective questions and manual evaluation tools for descriptive answers."
    }
  ];

  const examTypes = [
    {
      icon: CheckCircle2,
      title: "Objective (MCQ) Exams",
      description: "Multiple choice questions with instant auto-evaluation and results."
    },
    {
      icon: FileText,
      title: "Descriptive/Subjective Exams",
      description: "Essay-type questions with manual evaluation and detailed feedback."
    },
    {
      icon: Timer,
      title: "Timed & Scheduled Tests",
      description: "Set specific time limits and schedule exams for automatic start and end."
    },
    {
      icon: Target,
      title: "Practice Tests & Mock Exams",
      description: "Create unlimited practice tests for students to prepare effectively."
    },
    {
      icon: Award,
      title: "Entrance & Competitive Exams",
      description: "Conduct large-scale competitive exams with ranking and leaderboards."
    },
    {
      icon: BookOpen,
      title: "Quiz & Assessments",
      description: "Quick assessments and quizzes to evaluate learning outcomes regularly."
    }
  ];

  const securityFeatures = [
    {
      icon: Shuffle,
      title: "Question Randomization",
      description: "Questions and options are randomized for each student to prevent copying."
    },
    {
      icon: Clock,
      title: "Time-Bound Tests",
      description: "Set strict time limits with auto-submission when time expires."
    },
    {
      icon: Lock,
      title: "Secure Login",
      description: "Encrypted authentication and role-based access control for data security."
    },
    {
      icon: Shield,
      title: "Auto-Submission",
      description: "Automatic submission on timeout or when student closes the browser."
    }
  ];

  const userTypes = [
    {
      icon: GraduationCap,
      title: "Educational Institutes",
      description: "Conduct semester exams, unit tests, and internal assessments online.",
      features: [
        "Bulk student registration",
        "Class-wise exam management",
        "Automated result generation",
        "Parent notification system"
      ]
    },
    {
      icon: Building2,
      title: "Corporates",
      description: "Employee assessments, recruitment tests, and skill evaluations.",
      features: [
        "Pre-employment screening",
        "Skills assessment tests",
        "Training evaluations",
        "Performance tracking"
      ]
    },
    {
      icon: BookOpen,
      title: "Coaching Classes",
      description: "Mock tests, practice exams, and performance tracking.",
      features: [
        "Chapter-wise tests",
        "Competitive exam prep",
        "Progress monitoring",
        "Doubt resolution system"
      ]
    }
  ];

  const evaluationFeatures = [
    "Auto-evaluation for MCQs with instant results",
    "Manual checking interface for descriptive answers",
    "Instant scorecards with detailed breakdown",
    "Class rank lists & performance comparisons",
    "Export results to Excel or PDF format",
    "Question-wise analysis and insights"
  ];

  const keyFeatures = [
    {
      title: "Question Bank Management",
      description: "Build and organize comprehensive question banks for reuse"
    },
    {
      title: "Exam Scheduling",
      description: "Schedule exams with automatic start and end times"
    },
    {
      title: "Result Publishing",
      description: "Instant result publication with customizable visibility"
    },
    {
      title: "Multi-language Support",
      description: "Conduct exams in multiple languages for diverse users"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "College Administrator",
      institution: "ABC Engineering College",
      content: "This platform made online exams easy and stress-free for our students. The auto-evaluation feature saved us countless hours.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Coaching Institute Owner",
      institution: "Success Academy",
      content: "Instant results and detailed reports saved us a lot of time. Our students love the practice test feature for exam preparation.",
      rating: 5
    },
    {
      name: "Prof. Anita Desai",
      role: "HOD Computer Science",
      institution: "XYZ University",
      content: "The security features give us confidence in conducting fair exams. Question randomization ensures academic integrity.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-08 text-white-99">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-60/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-32 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-purple-60/20 to-purple-60/10 border border-purple-60/30 rounded-full mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 text-purple-75" />
              <span className="text-sm text-purple-75 font-medium">Trusted by 500+ Institutions</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-white-99">
              Conduct Online Exams.
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-70 to-purple-60"> Simple. Secure. Smart.</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-60 mb-6 sm:mb-8 px-4 leading-relaxed">
              Create, manage, and evaluate online exams with ease. Our platform helps institutions conduct reliable assessments anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <button 
                onClick={() => router.push('/login')}
                className="group px-6 sm:px-8 py-3 sm:py-4 bg-purple-60 hover:bg-purple-65 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl hover:shadow-purple-60/20"
              >
                Create Free Exam
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCounter 
            end={stats.exams} 
            label="Exams Conducted" 
            icon={FileCheck}
            suffix="+"
          />
          <StatsCounter 
            end={stats.students} 
            label="Students Tested" 
            icon={Users}
            suffix="+"
          />
          <StatsCounter 
            end={stats.institutes} 
            label="Institutions Trust Us" 
            icon={Building2}
            suffix="+"
          />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white-99">
            Why Choose Our Online Exam Platform?
          </h2>
          <p className="text-lg sm:text-xl text-gray-60">
            Everything you need for seamless online assessments
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={<feature.icon className="w-8 h-8 sm:w-10 sm:h-10" />}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* Exam Types Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white-99">
            Exam Types We Support
          </h2>
          <p className="text-lg sm:text-xl text-gray-60">
            Flexible exam formats for every assessment need
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {examTypes.map((exam, index) => (
            <ExamTypeCard
              key={index}
              icon={<exam.icon className="w-8 h-8" />}
              title={exam.title}
              description={exam.description}
            />
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white-99">
            Secure & Reliable Examination System
          </h2>
          <p className="text-lg sm:text-xl text-gray-60">
            Advanced security measures for fair and transparent exams
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {securityFeatures.map((feature, index) => (
            <SecurityFeatureCard
              key={index}
              icon={<feature.icon className="w-8 h-8" />}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </section>

      {/* Smart Evaluation Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white-99">
            Smart Evaluation & Instant Results
          </h2>
          <p className="text-lg sm:text-xl text-gray-60">
            Automated and manual evaluation tools for comprehensive assessment
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-10 to-gray-08 border border-gray-15 rounded-2xl p-8 sm:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {evaluationFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-60/20 flex items-center justify-center mt-1">
                  <CheckCircle2 className="w-4 h-4 text-purple-70" />
                </div>
                <p className="text-gray-60">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white-99">
            Built for Everyone
          </h2>
          <p className="text-lg sm:text-xl text-gray-60">
            Tailored solutions for different types of institutions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {userTypes.map((user, index) => (
            <UserTypeCard
              key={index}
              icon={<user.icon className="w-12 h-12" />}
              title={user.title}
              description={user.description}
              features={user.features}
            />
          ))}
        </div>
      </section>

      {/* Key Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white-99">
            Key Features
          </h2>
          <p className="text-lg sm:text-xl text-gray-60">
            Powerful tools to manage your exams efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyFeatures.map((feature, index) => (
            <div 
              key={index}
              className="bg-gradient-to-br from-gray-10 to-gray-08 border border-gray-15 rounded-2xl p-6 hover:border-purple-60/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-60/10"
            >
              <h3 className="text-xl font-semibold mb-2 text-white-99">{feature.title}</h3>
              <p className="text-gray-60">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Device Compatibility Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="bg-gradient-to-br from-purple-60/10 to-transparent border border-purple-60/20 rounded-2xl p-8 sm:p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white-99">
              Anytime. Anywhere. Any Device.
            </h2>
            <p className="text-lg text-gray-60">
              Students can take exams from anywhere using any device—no app installation required.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 mt-8">
            <div className="flex flex-col items-center gap-2">
              <Smartphone className="w-12 h-12 text-purple-70" />
              <span className="text-gray-60">Mobile</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Tablet className="w-12 h-12 text-purple-70" />
              <span className="text-gray-60">Tablet</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Laptop className="w-12 h-12 text-purple-70" />
              <span className="text-gray-60">Laptop</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white-99">
            What Our Users Say
          </h2>
          <p className="text-lg sm:text-xl text-gray-60">
            Trusted by educators and institutions worldwide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              institution={testimonial.institution}
              content={testimonial.content}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="relative group bg-gradient-to-br from-gray-08 to-gray-10 border border-gray-15 rounded-2xl p-8 sm:p-12 lg:p-16 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-purple-60/30 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-60/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white-99">
              Ready to Transform Your Assessments?
            </h2>
            <p className="text-lg sm:text-xl text-gray-60 mb-6 sm:mb-8 max-w-2xl mx-auto px-4 leading-relaxed">
              Join thousands of institutions conducting secure and efficient online exams. Start your free trial today.
            </p>
            <button 
              onClick={() => router.push('/login')}
              className="group px-8 sm:px-10 py-3 sm:py-4 bg-purple-60 hover:bg-purple-65 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-2xl hover:shadow-purple-60/20"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-15 mt-12 sm:mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-purple-60" />
              <span className="text-lg font-bold text-white-99">ExamPro</span>
            </div>
            <p className="text-gray-40 text-sm text-center sm:text-left">
              © 2025 ExamPro. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;