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
      { name: "Photopea", url: "https://www.photopea.com", desc: "Advanced web-based image editor. A completely free, browser-based alternative to Adobe Photoshop." },
      { name: "TinyWow", url: "https://tinywow.com", desc: "Hundreds of free, uncapped tools for PDF, video, image, and file conversion." },
      { name: "CyberChef", url: "https://gchq.github.io/CyberChef/", desc: "A 'Swiss Army Knife' web app for encryption, encoding, compression, and data analysis." }
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
      { name: "MDN Web Docs", url: "https://developer.mozilla.org", desc: "The absolute gold standard for web development documentation, maintained by Mozilla." },
      { name: "StackBlitz", url: "https://stackblitz.com", desc: "Instant web-based IDE for modern frameworks (React, Next, Vue) that runs entirely in your browser." },
      { name: "Regex101", url: "https://regex101.com", desc: "Interactive regular expression tester and debugger with real-time explanations of your code." }
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
  category: "Design & Creative",
  description: "Free tools for UI/UX, vectors, and presentations",
  links: [
    { name: "Figma", url: "https://www.figma.com", desc: "Industry-standard collaborative interface design tool. Completely free for students." },
    { name: "Coolors", url: "https://coolors.co", desc: "A fast, intuitive color palette generator for your web and design projects." },
    { name: "Lucide", url: "https://lucide.dev", desc: "A beautiful, open-source icon toolkit. A modern alternative to FontAwesome." }
  ]
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
      { name: "Zotero", url: "https://www.zotero.org", desc: "A free, open-source reference manager to collect, organize, annotate, and auto-generate citations." },
      { name: "Connected Papers", url: "https://www.connectedpapers.com", desc: "Enter a paper and get a visual graph of similar research, making literature reviews incredibly fast." },
      { name: "Hemingway App", url: "https://hemingwayapp.com", desc: "A text editor that highlights lengthy, complex sentences and passive voice to improve essay clarity." },
      { name: "Wolfram Alpha", url: "https://www.wolframalpha.com", desc: "A computational intelligence engine. Excellent for high-level math, physics, and data queries." },
      { name: "Att-end", url: "", desc: "Manage your attendance" },
    ]
  },
]
