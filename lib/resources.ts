export interface Resource {
  category : string ;
  description : string;
  links : LinkObject[];
}
export interface LinkObject {
  name : string; 
  url : string;
  desc : string;
}
export const ResourceData : Resource[] = [
  {
    category: "Quick Utilities",
    description: "Free, handy privacy and utility web tools",
    links: [
      { name: "PairDrop", url: "https://pairdrop.net", desc: "Local file sharing in browser" },
      { name: "TempMail", url: "https://tempmail.net", desc: "Disposable temporary email" },
      { name: "TempChat", url: "https://tempchat.org", desc: "Encrypted self-destructing chat" },
      { name: "Cobalt", url: "https://cobalt.tools", desc : "A clean, ad-free tool to download videos and media from various websites."},
      { name: "PDF24", url: "https://tools.pdf24.org", desc : "A free online suite to convert, merge, compress, and edit PDF files easily."},
    ],
  },
  {
    category: "Learning & Dev",
    description: "Free platforms to master coding and roadmaps",
    links: [
      { name: "The Odin Project", url: "https://www.theodinproject.com", desc: "Full stack open curriculum" },
      { name: "freeCodeCamp", url: "https://www.freecodecamp.org", desc: "Interactive coding certifications" },
      { name: "roadmap.sh", url: "https://roadmap.sh", desc: "Community developer roadmaps" },
      { name: "Learn X in Y min", url: "https://learnxinyminutes.com", desc: "Quick syntax guides and code examples to learn new programming languages rapidly." },
    ],
  },
  {
    category: "Developer Tools",
    description: "Essential tools, documentation & components",
    links: [
      { name: "GitHub", url: "https://github.com", desc: "Code hosting & collaboration" },
      { name: "w3schools", url: "https://www.w3schools.com", desc: "Web development reference" },
      { name: "Framer Motion", url: "https://framer/com/motion", desc: "A production-ready animation library for React to create smooth, professional motion effects." },
      { name: "Next.js", url: "https://nextjs.org", desc: "React framework for the web" },
      { name: "shadcn/ui", url: "https://ui.shadcn.com", desc: "Beautifully designed, accessible UI components that you can copy and paste into your apps." },
      { name: "VS Code", url: "https://code.visualstudio.com", desc: "Code editor" },
    ],
  },
  {
    category : "Study & Academic",
    description: "Tools that is usefull for study",
    links : [
      { name: "NotebookLM", url: "https://notebooklm.google.com", desc: "An AI-powered research assistant by Google that lets you chat with your own notes and documents." },
      { name: "Goblin Tools", url: "https://goblin.tools", desc: "A collection of helpful, AI-powered micro-tools to break down tasks, estimate times, and manage overwhelm." },
      { name: "Excalidraw", url: "https://excalidraw.com", desc: "A virtual whiteboard tool that lets you easily sketch hand-drawn diagrams and wireframes." },
      { name: "Unpaywall", url: "https://unpaywall.org", desc: "A browser extension that instantly finds free, legal versions of paywalled academic research papers." },
      { name: "Desmos", url: "https://www.desmos.com", desc: "An advanced online graphing calculator for plotting math equations and exploring functions." },
      { name: "Symbolab", url: "https://www.symbolab.com", desc: "An advanced math solver that shows step-by-step solutions for algebra, calculus, and more." },
      { name: "Att-end", url: "", desc: "Manage your attendance" },
    ]
  },
]
