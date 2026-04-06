# Cybersecurity Learning Roadmap

A comprehensive React-based application for cybersecurity professionals and enthusiasts to learn, track progress, and discover essential tools and resources in the field of malware analysis, reverse engineering, and threat intelligence.

## 🚀 Features

### 📚 Roadmap Pages
- **Interactive Learning Path**: Step-by-step guide through cybersecurity fundamentals
- **Progress Tracking**: Mark completed topics and track your learning journey
- **Comprehensive Coverage**: From basics to advanced techniques

### 🛠️ Tools Arsenal
- **Categorized Tool Collection**: Organized by analysis type (Static, Dynamic, Intelligence, Detection, Practice)
- **Detailed Tool Information**: Click any tool to see:
  - Description and use cases
  - Common commands used
  - Automation scripts available
  - Platform compatibility
  - Difficulty level
- **Essential Tools Added**:
  - **Static Analysis**: Ghidra, IDA Free, Cutter, PE-bear, PEStudio, DIE, FLOSS, CAPA, Radare2
  - **Dynamic Analysis**: x64dbg, WinDbg, Process Monitor, Process Hacker, Wireshark, ANY.RUN, FlareVM, Noriben, FakeNet-NG
  - **Threat Intelligence**: VirusTotal, MalwareBazaar, URLScan.io, Shodan, MITRE ATT&CK, OTX, Malpedia, MISP
  - **Detection & Hunting**: YARA, Sigma, Volatility, Zeek, Snort, Suricata
  - **Practice & Labs**: crackmes.one, pwn.college, Malware Traffic Analysis, OpenSecurityTraining2, HackTheBox, Malware Unicorn

### 👥 Community & Resources
- **Curated Expert List**: 20+ top cybersecurity researchers, analysts, and journalists
- **Detailed Profiles**: Click on any person to view:
  - Their blogs and publications
  - Best work and contributions
  - Why to follow them
- **Blog Discovery**: 18+ essential security blogs with frequency indicators
  - Shows 5 blogs initially with "Show More" button
  - Includes DFIR Report, Elastic Security Labs, Malware Traffic Analysis, vx-underground, and more
- **Community Platforms**: Reddit communities, Discord servers for learning and discussion

### 🎯 Threat Intelligence Feed
- Real-time threat intelligence updates
- IOC sharing and analysis
- Current threat landscape overview

## 🏗️ Technical Implementation

### Frontend Architecture
- **React 18** with modern hooks and functional components
- **Vite** for fast development and optimized builds
- **CSS-in-JS** styling with inline styles for consistency
- **Responsive Design** with grid layouts and mobile-friendly interfaces

### Key Components
- **App.jsx**: Main routing and navigation
- **RoadmapPage.jsx**: Learning path visualization
- **ToolsPage.jsx**: Interactive tools catalog with modal details
- **CommunityPage.jsx**: Expert profiles and resource aggregation
- **ThreatFeedPage.jsx**: Threat intelligence dashboard

### State Management
- React `useState` for component-level state
- Modal systems for detailed views
- Category filtering and pagination

### UI/UX Features
- **Dark Theme**: Cybersecurity-focused dark color scheme
- **Interactive Elements**: Hover effects, smooth transitions
- **Accessibility**: Keyboard navigation, screen reader support
- **Performance**: Optimized rendering with React best practices

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
git clone <repository-url>
cd my-roadmap
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview
```

## 📁 Project Structure
```
src/
├── App.jsx                 # Main application component
├── main.jsx               # Application entry point
├── index.css              # Global styles
├── RoadmapPage.jsx        # Learning roadmap component
├── ToolsPage.jsx          # Tools catalog with modal details
├── CommunityPage.jsx      # Community resources and expert profiles
├── ThreatFeedPage.jsx     # Threat intelligence feed
└── assets/                # Static assets
```

## 🎨 Design System

### Color Palette
- Primary: `#0099ff` (Blue)
- Success: `#00ff9d` (Green)
- Warning: `#f5a623` (Orange)
- Danger: `#ff4d6d` (Red)
- Background: Dark theme with subtle gradients

### Typography
- **Headers**: Syne font family
- **Body**: Syne for descriptions
- **Code**: Fira Code for technical content

### Components
- **Cards**: Rounded corners with subtle borders
- **Buttons**: Consistent styling with hover states
- **Modals**: Overlay system for detailed views
- **Tags**: Color-coded category indicators

## 🔧 Customization

### Adding New Tools
1. Update the `CATEGORIES` array in `ToolsPage.jsx`
2. Include: name, desc, url, platform, level, commonCommands, automationScripts

### Adding Community Members
1. Add to `PEOPLE` array in `CommunityPage.jsx`
2. Include: handle, name, desc, url, tag, why, blogs, bestWork

### Adding Blogs
1. Add to `BLOGS` array in `CommunityPage.jsx`
2. Include: name, url, color, desc, freq

## 📊 Current Statistics

- **20 Expert Profiles** in community section
- **40+ Tools** across 5 categories
- **18 Security Blogs** with frequency tracking
- **6 Reddit Communities** recommended
- **4 Discord Servers** for community engagement

## 🚀 Future Enhancements

- [ ] User authentication and progress saving
- [ ] Interactive quizzes and assessments
- [ ] Tool comparison features
- [ ] RSS feed integration for blogs
- [ ] Dark/light theme toggle
- [ ] Offline accessibility
- [ ] Mobile app version

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with React and Vite
- Inspired by the cybersecurity community's dedication to knowledge sharing
- Special thanks to all the researchers and analysts featured in the community section
