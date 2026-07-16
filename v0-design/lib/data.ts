export type Course = {
  id: string
  title: string
  description: string
  price: number
  level: string
  lessons: number
  hours: number
  image: string
  progress?: number
}

export const courses: Course[] = [
  {
    id: 'price-action',
    title: 'Price Action Mastery',
    description:
      'Read raw market structure and trade clean setups without indicators.',
    price: 499,
    level: 'Intermediate',
    lessons: 42,
    hours: 12,
    image: '/images/course-price-action.png',
  },
  {
    id: 'risk-management',
    title: 'Risk & Capital Management',
    description:
      'Protect your account with position sizing, R-multiples, and drawdown control.',
    price: 349,
    level: 'All Levels',
    lessons: 28,
    hours: 8,
    image: '/images/course-risk.png',
  },
  {
    id: 'psychology',
    title: 'Trading Psychology',
    description:
      'Build the discipline and emotional control of a consistent professional.',
    price: 299,
    level: 'All Levels',
    lessons: 24,
    hours: 7,
    image: '/images/course-psychology.png',
  },
  {
    id: 'technical-analysis',
    title: 'Advanced Technical Analysis',
    description:
      'Fibonacci, confluence zones, and multi-timeframe analysis frameworks.',
    price: 549,
    level: 'Advanced',
    lessons: 51,
    hours: 15,
    image: '/images/course-technical.png',
  },
  {
    id: 'scalping',
    title: 'Intraday Scalping System',
    description:
      'A precise rules-based system for capturing fast intraday moves.',
    price: 599,
    level: 'Advanced',
    lessons: 38,
    hours: 11,
    image: '/images/course-scalping.png',
  },
  {
    id: 'fundamentals',
    title: 'Forex Fundamentals',
    description:
      'Understand macro drivers, interest rates, and currency correlations.',
    price: 199,
    level: 'Beginner',
    lessons: 20,
    hours: 6,
    image: '/images/course-fundamentals.png',
  },
]

export const enrolledCourses: Course[] = [
  { ...courses[0], progress: 68 },
  { ...courses[1], progress: 92 },
  { ...courses[3], progress: 34 },
  { ...courses[2], progress: 12 },
]

export type Student = {
  id: string
  name: string
  email: string
  status: 'Approved' | 'Pending' | 'Suspended'
  courses: number
  joined: string
}

export const students: Student[] = [
  { id: '1', name: 'Marcus Whitfield', email: 'marcus.w@example.com', status: 'Approved', courses: 4, joined: 'Jan 12, 2026' },
  { id: '2', name: 'Sofia Alvarez', email: 'sofia.a@example.com', status: 'Approved', courses: 2, joined: 'Feb 03, 2026' },
  { id: '3', name: 'Daniel Osei', email: 'daniel.o@example.com', status: 'Pending', courses: 1, joined: 'Mar 21, 2026' },
  { id: '4', name: 'Amara Nwosu', email: 'amara.n@example.com', status: 'Approved', courses: 6, joined: 'Nov 08, 2025' },
  { id: '5', name: 'Liam Fitzgerald', email: 'liam.f@example.com', status: 'Suspended', courses: 3, joined: 'Dec 19, 2025' },
  { id: '6', name: 'Yuki Tanaka', email: 'yuki.t@example.com', status: 'Pending', courses: 1, joined: 'Apr 02, 2026' },
  { id: '7', name: 'Priya Sharma', email: 'priya.s@example.com', status: 'Approved', courses: 5, joined: 'Oct 27, 2025' },
]

export type Payment = {
  id: string
  student: string
  course: string
  amount: number
  status: 'Approved' | 'Pending' | 'Refunded'
  date: string
}

export const payments: Payment[] = [
  { id: 'INV-1042', student: 'Marcus Whitfield', course: 'Price Action Mastery', amount: 499, status: 'Approved', date: 'Jul 14, 2026' },
  { id: 'INV-1041', student: 'Sofia Alvarez', course: 'Trading Psychology', amount: 299, status: 'Approved', date: 'Jul 13, 2026' },
  { id: 'INV-1040', student: 'Daniel Osei', course: 'Forex Fundamentals', amount: 199, status: 'Pending', date: 'Jul 13, 2026' },
  { id: 'INV-1039', student: 'Amara Nwosu', course: 'Advanced Technical Analysis', amount: 549, status: 'Approved', date: 'Jul 12, 2026' },
  { id: 'INV-1038', student: 'Liam Fitzgerald', course: 'Intraday Scalping System', amount: 599, status: 'Refunded', date: 'Jul 11, 2026' },
  { id: 'INV-1037', student: 'Priya Sharma', course: 'Risk & Capital Management', amount: 349, status: 'Approved', date: 'Jul 10, 2026' },
]

export const curriculum = [
  {
    module: 'Module 1 — Market Structure',
    lessons: [
      { title: 'Introduction to Price Action', duration: '08:24', done: true },
      { title: 'Support & Resistance Zones', duration: '14:10', done: true },
      { title: 'Trend Identification', duration: '11:37', done: true },
    ],
  },
  {
    module: 'Module 2 — Entry Techniques',
    lessons: [
      { title: 'Break of Structure Entries', duration: '16:52', done: false, active: true },
      { title: 'Order Blocks Explained', duration: '19:05', done: false },
      { title: 'Fair Value Gaps', duration: '13:41', done: false },
    ],
  },
  {
    module: 'Module 3 — Trade Management',
    lessons: [
      { title: 'Setting Stop Losses', duration: '10:18', done: false },
      { title: 'Scaling In & Out', duration: '12:55', done: false },
    ],
  },
]
