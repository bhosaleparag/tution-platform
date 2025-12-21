import { 
  Home, Settings, MessageSquare, Users, 
  TrendingUp, Trophy, BookOpen, FileInput, TestTube2,
  Terminal, Award, Target, Zap, Code, Shield,
  CalendarCheck, CheckCircle2, PlusCircle, School, GraduationCap,
  UserCheck, HelpCircle, Timer,
  AreaChart, Bug, MessageCircle,

  // Missing imports you used later
  Crown, Star, Medal, 
  Code2, Swords, Gamepad2, 
  Atom, BadgeCent, BadgeCheck, BrainCircuit, BrainCog,
  CalendarDays, CalendarHeart, CalendarRange,
  Component, Construction, Copy, Diamond, Dice5, Flame, Footprints,
  GalleryThumbnails, Gamepad2 as Gamepad2Icon, GanttChartSquare, Gem, Globe, 
  Hammer, HeartHandshake, Infinity, LineChart, Milestone, Network, Orbit,
  Rocket, ShieldCheck, Sigma, Sparkle, Sparkles, SunMoon,
  UserPlus
} from 'lucide-react';


// Role-based navigation routes
export const StudentRoutes = [
  { 
    href: "/", 
    name: "Dashboard", 
    icon: Home,
    description: "View assigned quizzes"
  },
  { 
    href: "/quizzes", 
    name: "My Quizzes", 
    icon: BookOpen,
    description: "View and take quizzes"
  },
  { 
    href: "/results", 
    name: "Results", 
    icon: Award,
    description: "View quiz results and scores"
  },
  { 
    href: "/leaderboard", 
    name: "Leaderboard", 
    icon: TrendingUp,
    description: "See rankings"
  }
];

export const TeacherRoutes = [
  { 
    href: "/", 
    name: "Dashboard", 
    icon: Home,
    description: "Teacher overview"
  },
  { 
    href: "/classes", 
    name: "My Classes", 
    icon: BookOpen,
    description: "Manage your classes"
  },
  { 
    href: "/my-quiz", 
    name: "My Quizzes", 
    icon: PlusCircle,
    description: "Create quiz"
  },
  { 
    href: "/students", 
    name: "Students", 
    icon: Users,
    description: "Manage students"
  },
  { 
    href: "/review", 
    name: "Review", 
    icon: CheckCircle2,
    description: "Review student submissions"
  }
];

export const AdminRoutes = [
  { 
    href: "/", 
    name: "Dashboard", 
    icon: Home,
    description: "Admin overview"
  },
  { 
    href: "/schools", 
    name: "Schools", 
    icon: School,
    description: "Manage schools"
  },
  { 
    href: "/subjects", 
    name: "Subjects", 
    icon: GraduationCap,
    description: "Manage subjects"
  },
  { 
    href: "/teachers", 
    name: "Teachers", 
    icon: UserCheck,
    description: "Manage teachers"
  }
];

// Default routes for unauthenticated users
export const MenuRoutes = StudentRoutes;

export const getRankIcon = (rank) => {
  if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-400" />;
  if (rank === 2) return <Award className="w-5 h-5 text-gray-400" />;
  if (rank === 3) return <Award className="w-5 h-5 text-yellow-600" />;
  return <span className="text-gray-60 font-medium">#{rank}</span>;
};

export const getAchievementIcon = (achievement) => {
  const iconMap = {
    crown: Crown,
    trophy: Trophy,
    star: Star,
    medal: Medal,
    award: Award,
    zap: Zap,
    shield: Shield,
    code: Code,
    target: Target
  };
  const IconComponent = iconMap[achievement] || Award;
  return <IconComponent className="w-4 h-4" />;
};

export const AchievementIcons = {
  AreaChart, Atom, Award, BadgeCent, BadgeCheck, BrainCircuit, BrainCog, Bug, 
  CalendarCheck, CalendarDays, CalendarHeart, CalendarRange, Component, 
  Construction, Copy, Crown, Diamond, Dice5, Flame, Footprints, 
  GalleryThumbnails, Gamepad2, GanttChartSquare, Gem, Globe, Hammer, 
  HeartHandshake, Infinity, LineChart, Medal, Milestone, Network, Orbit, 
  Rocket, Shield, ShieldCheck, Sigma, Sparkle, Sparkles, SunMoon, Swords, 
  TrendingUp, Trophy, UserPlus, Users
}

export const codeEditorTabs = [
  { id: 'problem', label: 'Problem', icon: BookOpen },
  { id: 'inputs', label: 'Inputs', icon: FileInput },
  { id: 'results', label: 'Results', icon: TestTube2 },
  { id: 'output', label: 'Output', icon: Terminal }
];

export const SecondaryRoutes = [
  { 
    href: "/settings", 
    name: "Settings", 
    icon: Settings,
    description: "Account and app preferences"
  },
  { 
    href: "/feedback", 
    name: "Feedback", 
    icon: MessageSquare,
    description: "Share your thoughts with us"
  }
];

export const FAQS = [
  {
    id: 1,
    category: 'account',
    question: "How do I get started with the app?",
    answer: "To get started, simply create an account using Google or Email authentication. Follow our onboarding guide to set up your profile, choose your avatar, and customize your settings. You'll have immediate access to daily quizzes, coding challenges, and can start adding friends right away!"
  },
  {
    id: 2,
    category: 'account',
    question: "How can I reset my password?",
    answer: "Click on 'Forgot Password' on the login page, enter your registered email address, and we'll send you a secure reset link. Follow the instructions in the email to create a new password. For Google authentication users, password reset is managed through your Google account."
  },
  {
    id: 3,
    category: 'technical',
    question: "Is my data secure?",
    answer: "Yes! We use Firebase's enterprise-grade security with end-to-end encryption. All your data is encrypted both in transit and at rest. We implement strict authentication protocols and never share your personal data with third parties. Your code submissions and quiz results are stored securely."
  },
  {
    id: 4,
    category: 'account',
    question: "Can I export my data?",
    answer: "Absolutely! You can export all your data including quiz history, coding solutions, achievements, and friend list from the Settings page. We support JSON format exports that can be imported into other tools or saved as backups."
  },
  {
    id: 5,
    category: 'gameplay',
    question: "How do multiplayer battles work?",
    answer: "Multiplayer battles match you with opponents in real-time. You'll both receive the same coding problem and race to solve it correctly. Points are awarded based on speed, code efficiency, and correctness. You can invite friends directly or use matchmaking to find opponents of similar skill levels."
  },
  {
    id: 6,
    category: 'gameplay',
    question: "How is scoring calculated in quizzes and challenges?",
    answer: "Each quiz & challenge has a total score (e.g., 50 points). Your score is calculated based on the number of correct answers. For example, if a quiz has 5 questions and you answer 3 correctly, you’ll get 30 out of 50."
  },
  {
    id: 7,
    category: 'technical',
    question: "What happens if I disconnect during a match?",
    answer: "If you disconnect during a battle, you have 60 seconds to reconnect and resume. Your progress is automatically saved. If you can't reconnect in time, the match is forfeit and your opponent wins. In quiz mode, you can resume from where you left off within 5 minutes."
  },
  {
    id: 8,
    category: 'achievements',
    question: "How do achievements and badges work?",
    answer: "Achievements unlock automatically as you complete challenges, win battles, and maintain streaks. Each badge represents a milestone: Bronze (beginner), Silver (intermediate), Gold (advanced), and Platinum (expert). Special badges are awarded for tournaments, perfect scores, and community contributions."
  },
  {
    id: 9,
    category: 'gameplay',
    question: "Can I practice coding challenges offline?",
    answer: "Yes! Daily quizzes and select coding challenges can be accessed offline. Your solutions sync automatically when you reconnect. However, multiplayer battles and leaderboard features require an active internet connection for real-time functionality."
  },
  {
    id: 10,
    category: 'account',
    question: "How does the friend system work?",
    answer: "Send friend requests via username or email. Once accepted, you'll see their online/offline status, can invite them to battles, compare achievements, and track their progress on the leaderboard. Friends can also send you challenge invites and share custom problems."
  },
  {
    id: 11,
    category: 'technical',
    question: "What programming languages are supported?",
    answer: "We currently support JavaScript for coding challenges. Each problem specifies allowed languages. Our code editor includes syntax highlighting, auto-completion, and real-time error detection for all supported languages."
  },
  {
    id: 12,
    category: 'achievements',
    question: "How does the leaderboard ranking work?",
    answer: "Rankings are calculated using an ELO-style system based on your battle wins, quiz scores, problem difficulty, and consistency. Weekly and monthly leaderboards reset regularly, while the all-time leaderboard tracks lifetime performance. Top 100 players earn exclusive badges!"
  },
  {
    id: 13,
    category: 'technical',
    question: "Can I report inappropriate behavior?",
    answer: "Yes, user safety is our priority. Use the report button on any user profile or in-game chat. Serious violations result in warnings, suspensions, or permanent bans."
  },
  {
    id: 14,
    category: 'gameplay',
    question: "How do I improve my coding skills?",
    answer: "Start with daily quizzes to build consistency, then progress to timed challenges. Review your solutions against top performers' code, watch tutorial videos in the Learning Hub, and participate in community discussions. Focus on one language at a time for deeper mastery."
  },
  {
    id: 15,
    category: 'achievements',
    question: "What are daily streaks and how do they work?",
    answer: "Complete quiz or challenge each day to maintain your streak. Streaks increase your score multiplier (up to 3x at 30+ days) and unlock special badges. Miss a day and your streak resets, but you can use one 'Streak Freeze' per month to protect it!"
  }
];

export const HelpCategories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'account', label: 'Account', icon: Users },
  { id: 'gameplay', label: 'Gameplay', icon: Code },
  { id: 'technical', label: 'Technical', icon: Settings },
  { id: 'achievements', label: 'Achievements', icon: Trophy }
];

export const supportSections = [
  {
    id: 'contact',
    title: 'Contact Support',
    description: '24/7 support team ready to help',
    icon: MessageSquare,
    color: 'purple',
    action: () => setContactModal(true)
  },
  {
    id: 'bug',
    title: 'Report a Bug',
    description: 'Help us improve the platform',
    icon: Bug,
    color: 'red',
    action: () => console.log('Navigate to feedback')
  },
  {
    id: 'community',
    title: 'Community Forum',
    description: 'Connect with other coders',
    icon: MessageCircle,
    color: 'blue',
    action: () => console.log('Navigate to community')
  },
  {
    id: 'docs',
    title: 'Documentation',
    description: 'Detailed guides and tutorials',
    icon: BookOpen,
    color: 'green',
    action: () => console.log('Navigate to docs')
  }
];

export const exploreSections = [
  { title: "Quiz", description: "Daily coding quizzes to test your skills." },
  { title: "Debugger", description: "Fix buggy code challenges in real-time." },
  { title: "Problem", description: "Solve algorithmic coding problems." },
];

export const debuggerMessages = {
  success: {
    title: "🎉 Bug Squashed!",
    message: "Great job! You successfully fixed the bug. Keep going to the next challenge!"
  },
  failure: {
    notFixed: {
      title: "❌ Bug Still There",
      message: "Your fix didn’t work this time. Review the code and try again!"
    },
    closeToFix: {
      title: "🛠️ Almost There!",
      message: "You’re close to fixing the bug! Double-check your changes and give it another shot."
    }
  }
}

export const dashboardFeature = [
  {
    icon: Code2,
    title: "Daily Coding Challenges",
    description: "Fresh problems every day. Practice algorithms, data structures, and problem-solving skills.",
  },
  {
    icon: Target,
    title: "Interactive Quizzes",
    description: "Test your knowledge with timed quizzes. Multiple difficulty levels to match your expertise.",
  },
  {
    icon: Users,
    title: "Friends & Social",
    description: "Connect with fellow coders. See who's online, share achievements, and grow together.",
  },
  {
    icon: Swords,
    title: "Quick Match",
    description:
      "Jump into instant 1v1 coding battles. Face random opponents and prove your skills in real-time duels.",
  },
  {
    icon: Gamepad2,
    title: "Custom Rooms",
    description: "Create private battle rooms with custom settings. Invite friends for exclusive coding showdowns.",
  },
  {
    icon: Trophy,
    title: "Achievements & Badges",
    description: "Unlock rewards as you progress. Showcase your accomplishments on your profile.",
  },
  {
    icon: Crown,
    title: "Global Leaderboard",
    description: "Compete with developers worldwide. Track your ranking and climb to the top.",
  },
  {
    icon: Timer,
    title: "Timed Challenges",
    description: "Race against the clock in speed coding challenges. Improve your problem-solving speed.",
  },
  {
    icon: Award,
    title: "Streak System",
    description: "Build daily streaks and earn bonus rewards. Stay consistent and watch your skills compound.",
  },
];

export const dashboardSteps = [
  {
    number: "1",
    title: "Create Account",
    description: "Sign up with Google or Email in seconds. Set up your profile and preferences.",
  },
  {
    number: "2",
    title: "Practice & Battle",
    description: "Solve daily challenges, take quizzes, or jump into real-time battles with other developers.",
  },
  {
    number: "3",
    title: "Climb Ranks",
    description: "Earn points, unlock achievements, and rise through the global leaderboard.",
  },
];

export const dashboardGameModes = [
  {
    icon: Zap,
    title: "Quick Match",
    description:
      "Jump into instant battles with random opponents. Fast-paced action with automatic matchmaking based on your skill level.",
    features: [
      "Auto matchmaking",
      "Balanced opponents",
      "5-10 min matches",
      "Ranked progression",
    ],
  },
  {
    icon: Gamepad2,
    title: "Create Room",
    description:
      "Host custom battles with your own rules. Invite friends, set difficulty levels, and create the perfect competitive environment.",
    features: [
      "Custom settings",
      "Private rooms",
      "Friend invites",
      "Flexible timing",
    ],
  },
];


export const MAX_LIMIT_PER_QUIZ_QUE = 15

export const MAX_LIMIT_DEBUGGER  = 1000 * 60 * 5