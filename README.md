# 🌳 LovingTree Lingo

**An Interactive Language Learning Platform for Kids**

LovingTree Lingo is a fun and engaging language learning application designed specifically for children. Our mission is to make language learning enjoyable, interactive, and effective for young learners through gamification, colorful visuals, and age-appropriate content.

## 🎯 About the Project

This application is being developed for **LovingTree Kids** - creating a safe, educational, and entertaining environment where children can:

- 📚 Learn new languages through interactive lessons
- 🎮 Play educational games that reinforce learning
- 🏆 Track their progress with achievements and rewards
- 👥 Connect with other young learners in a safe environment
- 🎨 Experience learning through colorful, child-friendly interfaces

## ✨ Key Features (Planned)

- **Kid-Friendly Interface**: Bright colors, large buttons, and intuitive navigation
- **Gamified Learning**: Points, badges, and level progression to keep kids motivated
- **Interactive Lessons**: Audio pronunciation, visual aids, and hands-on exercises
- **Safe Environment**: Parental controls and child-safe content moderation
- **Progress Tracking**: Visual progress indicators for both kids and parents
- **Multi-Language Support**: Starting with popular languages like Spanish, French, and Mandarin
- **Offline Mode**: Continue learning even without internet connection

## 🛠 Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **UI Library**: Chakra UI v3 (mobile-first, responsive design)
- **Backend**: Supabase (Authentication, Database, Real-time features)
- **Build System**: Turborepo (Monorepo management)
- **Deployment**: Vercel
- **Styling**: Chakra UI + Emotion

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/chennanli/LovingTreeLingo.git
   cd LovingTreeLingo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```
   This step is crucial as it installs all the required packages defined in package.json. The project won't work without this step!

3. **Set up environment variables**:
   Create `.env.local` in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open in browser**:
   Navigate to `http://localhost:3000`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run linting

## 🎨 Design Philosophy

**Child-Centered Design**: Every interface element is designed with children in mind - large touch targets, clear visual hierarchy, and engaging animations.

**Learning Through Play**: We believe kids learn best when they're having fun. Our approach integrates educational content with game-like elements.

**Safety First**: All features are built with child safety as the top priority, including content moderation and parental oversight tools.

## 📊 Development Status

- ✅ **Foundation**: Next.js project setup with TypeScript
- ✅ **UI Framework**: Chakra UI integration for responsive design
- ✅ **Backend**: Supabase configuration for data and authentication
- ✅ **Build System**: Turborepo monorepo structure
- ✅ **Welcome Page**: Initial landing page with branding
- 🚧 **Core Features**: Language lessons, games, and user profiles (coming next)
- 🚧 **Deployment**: Production deployment to Vercel

## 🤝 Contributing

We welcome contributions from developers who are passionate about education and child development. Please ensure all contributions align with our child-safety standards.

### Development Guidelines
- Follow TypeScript best practices
- Maintain mobile-first responsive design
- Write child-friendly copy and content
- Include proper error handling and loading states
- Test thoroughly on different devices and screen sizes

## 📞 Contact & Support

For questions about LovingTree Lingo development or partnership opportunities, please reach out through our development team.

---

**Built with ❤️ for LovingTree Kids**

*Making language learning fun, safe, and effective for children everywhere.*