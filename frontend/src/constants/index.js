import { people01, people02, people03, facebook, instagram, linkedin, twitter, send, shield, star } from "../assets";

export const navLinks = [
  {
    id: "home",
    title: "Home",
    isSection: true,
    link: "/",
  },
  {
    id: "startdetection",
    title: "Start Detection",
    link: "/startdetection",
    isSection: false,
  },
  {
    id: "login",
    title: "Login",
    link: "/login",
    isSection: false,
  },
];

export const startDetectionNavLinks = [
  {
    id: "home",
    title: "Home",
    link: "/",
  },
  {
    id: "startdetection",
    title: "Start Detection",
    link: "/startdetection",
  },
  {
    id: "reports",
    title: "Reports",
    link: "/reports",
  },
];

export const loginNavLinks = [
  {
    id: "home",
    title: "Home",
    link: "/",
  },
];

export const features = [
  {
    id: "feature-1",
    icon: star,
    title: "AI Geometric Shape Detection",
    content:
      "Recognizes geometric objects in real-time using advanced AI to support accessible learning.",
  },
  {
    id: "feature-2",
    icon: shield,
    title: "Audio & Haptic Feedback",
    content:
      "Conveys shape details through sound and vibration, making geometry understandable without sight.",
  },
  {
    id: "feature-3",
    icon: send,
    title: "Interactive Learning",
    content:
      "Engages students through responsive interactions, building confidence and spatial awareness.",
  },
];

export const feedback = [
  {
    id: "feedback-1",
    content:
      "SoundMath has completely transformed the way I learn geometry! The audio descriptions make shapes and concepts much easier to understand, and the haptic feedback helps me explore geometry in a hands-on way.",
    name: "Lucas Turner",
    title: "Student",
    img: people01,
  },
  {
    id: "feedback-2",
    content:
      "A real breakthrough! The real-time AI guidance helps me grasp geometric shapes and their properties in a way I never thought possible. It’s made learning so much more engaging and interactive.",
    name: "Emma Williams",
    title: "Student",
    img: people02,
  },
  {
    id: "feedback-3",
    content:
      "I never thought I could fully understand geometry as a visually impaired student, but SoundMath has proven me wrong! The combination of sound and touch is amazing for learning and engaging with geometric concepts.",
    name: "Aiden Brown",
    title: "Student",
    img: people03,
  },
];

export const stats = [
  {
    id: "stats-1",
    title: "Happy Users",
    value: "10K+",
  },
  {
    id: "stats-2",
    title: "Geometric Objects Analyzed",
    value: "50K+",
  },
  {
    id: "stats-3",
    title: "Detection Accuracy",
    value: "95%",
  },
];

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Home",
        link: "/",
      },
      {
        name: "How It Works",
        link: "/how-it-works",
      },
      {
        name: "Features",
        link: "/features",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "/help-center",
      },
      {
        name: "Feedback",
        link: "/feedback",
      },
    ],
  },
  {
    title: "Support",
    links: [
      {
        name: "Contact Us",
        link: "/contact",
      },
      {
        name: "FAQ",
        link: "/faq",
      },
      {
        name: "Privacy Policy",
        link: "/privacy-policy",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-1",
    icon: instagram,
    link: "https://www.instagram.com/",
  },
  {
    id: "social-media-2",
    icon: facebook,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: twitter,
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    icon: linkedin,
    link: "https://www.linkedin.com/",
  },
];