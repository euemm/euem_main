# EUEM Portfolio Website

A modern, responsive portfolio website built with Next.js 14, showcasing full-stack development projects and skills. Features a sleek design with dark/light theme support, smooth animations, and an intuitive user experience.

![Next.js](https://img.shields.io/badge/Next.js-14.2.33-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.6-38B2AC)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB)

## ✨ Features

### 🎨 **Modern Design System**
- **Responsive Design** - Optimized for all screen sizes (mobile, tablet, desktop)
- **Dark/Light Theme** - Seamless theme switching with system preference detection
- **Glass Morphism Effects** - Modern UI with backdrop blur and transparency
- **Custom Brand Colors** - EUEM branded color palette (Purple, Red, Blue, Cyan)
- **Smooth Animations** - CSS transitions and hover effects throughout

### 🚀 **Core Functionality**
- **Project Showcase** - Interactive grid with filtering and detailed project pages
- **Authentication System** - Sign up/sign in with email verification
- **User Account Management** - Profile management and settings
- **Responsive Navigation** - Adaptive top navigation with mobile menu
- **Scroll to Top** - Floating action button for easy navigation
- **SEO Optimized** - Meta tags, structured data, and performance optimized

### 🔐 **Authentication & Security**
- **Email Verification** - 6-digit code verification with intuitive input fields
- **Session Management** - Persistent user sessions with local storage
- **Form Validation** - Client-side and server-side validation
- **Security Best Practices** - Protected routes and secure data handling

### 📱 **User Experience**
- **Mobile-First Design** - Optimized touch interactions and responsive breakpoints
- **Accessibility** - WCAG compliant with proper ARIA labels and keyboard navigation
- **Performance Optimized** - Image optimization, lazy loading, and code splitting
- **Progressive Web App** - Service worker ready with offline capabilities

## 🛠 Technology Stack

### **Frontend Framework**
- **Next.js 14.2.33** - React framework with App Router
- **React 18.2.0** - UI library with hooks and concurrent features
- **TypeScript 5.3.3** - Type-safe JavaScript with strict mode

### **Styling & UI**
- **Tailwind CSS 3.3.6** - Utility-first CSS framework
- **Lucide React 0.294.0** - Beautiful icon library
- **Custom Design Tokens** - EUEM brand color system
- **CSS Variables** - Dynamic theming with CSS custom properties

### **Development Tools**
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting with Tailwind plugin
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing and optimization

### **Build & Deployment**
- **Vercel** - Optimized deployment platform (recommended for ease)
- **PM2** - Production process management with monitoring
- **GitHub Actions** - CI/CD pipeline ready
- **Docker** - Containerization support
- **Self-hosted** - Deploy on any VPS or dedicated server

## 📋 Project Structure

```
euem_main/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main page component
├── components/                   # React components
│   ├── AccountPage.tsx          # User account management
│   ├── AuthDialog.tsx           # Authentication modal
│   ├── HomePage.tsx             # Landing page with hero section
│   ├── ProjectDetailPage.tsx    # Individual project showcase
│   ├── ProjectsPage.tsx         # Projects grid with filtering
│   ├── ThemeToggle.tsx          # Dark/light theme switcher
│   ├── ToggleButton.tsx         # Scroll to top button
│   └── TopNav.tsx               # Responsive navigation bar
├── app/                         # Next.js App Router
│   ├── api/                     # API routes
│   │   └── health/              # Health check endpoint
│   ├── globals.css              # Global styles and CSS variables
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main page component
├── components/                  # React components
│   ├── AccountPage.tsx          # User account management
│   ├── AuthDialog.tsx           # Authentication modal
│   ├── HomePage.tsx             # Landing page with hero section
│   ├── ProjectDetailPage.tsx    # Individual project showcase
│   ├── ProjectsPage.tsx         # Projects grid with filtering
│   ├── ThemeToggle.tsx          # Dark/light theme switcher
│   ├── ToggleButton.tsx         # Scroll to top button
│   └── TopNav.tsx               # Responsive navigation bar
├── data/                        # Static data
│   └── projects.json            # Project portfolio data
├── design-tokens/               # Design system
│   └── colors.ts                # Brand color definitions
├── logs/                        # PM2 log files (created at runtime)
├── public/                      # Static assets
│   ├── EUEM_LIGHT.png          # Light mode logo
│   ├── EUEM_DARK.png           # Dark mode logo
│   ├── favicon.ico             # Browser favicon
│   └── projects/               # Project screenshots
├── ecosystem.config.js          # PM2 process configuration
├── server.js                    # Custom Next.js server for PM2
└── styles/                     # Additional stylesheets
```

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** 18.0.0 or higher
- **npm** 8.0.0 or higher
- **Git** for version control

**For Production Deployment:**
- **PM2** (install globally: `npm install -g pm2`)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd euem_main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### **Available Scripts**

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run preview      # Build and preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run type-check   # TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check code formatting

# Production (PM2)
npm run pm2:start    # Start with PM2 process manager
npm run pm2:stop     # Stop PM2 process
npm run pm2:restart  # Restart PM2 process
npm run pm2:delete   # Delete PM2 process
npm run prod:build   # Clean build for production

# Maintenance
npm run clean        # Remove build artifacts
```

## 🚀 Production Deployment

### **PM2 Process Management**

The project includes PM2 configuration for production deployment with process management, monitoring, and automatic restarts.

#### **Prerequisites**

1. **Install PM2 globally**
   ```bash
   npm install -g pm2
   ```

2. **Create environment file** (optional)
   ```bash
   # Create .env file with your configuration
   echo "NODE_ENV=production" > .env
   echo "PORT=3000" >> .env
   echo "NEXT_PUBLIC_APP_URL=https://yourdomain.com" >> .env
   ```

   **Example .env file:**
   ```bash
   # Environment Configuration
   NODE_ENV=production
   PORT=3000

   # Optional: Application URL (for production)
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

#### **Deploy with PM2**

1. **Build for production**
   ```bash
   npm run prod:build
   ```

2. **Start with PM2**
   ```bash
   # Option 1: Using npm script
   npm run pm2:start
   
   # Option 2: Direct PM2 command (recommended)
   pm2 start ecosystem.config.js
   ```

3. **PM2 Management Commands**
   ```bash
   # Check status
   pm2 status

   # View logs
   pm2 logs euem-portfolio

   # Monitor dashboard
   pm2 monit

   # Stop process
   npm run pm2:stop

   # Restart process
   npm run pm2:restart

   # Delete process
   npm run pm2:delete
   ```

#### **PM2 Configuration Features**

- **Automatic Restarts** - Restarts on crashes or memory limits
- **Health Monitoring** - HTTP health checks every 30 seconds
- **Log Management** - Separate error, output, and combined logs
- **Environment Variables** - Loads from `.env` file automatically
- **Memory Limits** - Restarts if memory usage exceeds 1GB
- **Process Persistence** - Survives server reboots

#### **Health Check Endpoint**

The application includes a health check endpoint for monitoring:

```bash
# GET request - Basic health check
GET /api/health

# Response
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "nodeVersion": "v18.17.0",
  "environment": "production",
  "port": 3000
}

# POST request - Detailed health check with memory usage
POST /api/health
Content-Type: application/json

{
  "customCheck": "optional"
}

# Response includes memory usage
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "nodeVersion": "v18.17.0",
  "environment": "production",
  "port": 3000,
  "memory": {
    "used": 45.67,
    "total": 512.89,
    "external": 12.34
  },
  "custom": "optional"
}
```

**Why You Need It:**
- **PM2 Monitoring** - PM2 checks this endpoint every 30 seconds
- **Load Balancer Health Checks** - nginx, AWS ALB, etc. can monitor app health
- **Uptime Monitoring** - Services like UptimeRobot can ping this endpoint
- **Debugging** - Quick way to check if your app is running and responsive
- **Memory Monitoring** - Track memory usage in production

## 🎯 Key Features Deep Dive

### **Theme System**
- **Automatic Detection** - Respects system preference on first visit
- **Manual Toggle** - Floating theme switcher in bottom-right corner
- **Persistent Storage** - Theme preference saved in localStorage
- **Smooth Transitions** - All elements animate smoothly between themes

### **Project Showcase**
- **Interactive Grid** - Hover effects and smooth transitions
- **Category Filtering** - Filter projects by technology stack
- **Detailed Views** - Full project descriptions with live demos
- **Technology Tags** - Visual technology stack indicators
- **Responsive Images** - Optimized images with proper aspect ratios

### **Authentication Flow**
- **Seamless UX** - No popup switching during verification
- **6-Digit Code Input** - Individual input fields for each digit
- **Auto-focus Navigation** - Smooth keyboard navigation
- **Countdown Timer** - Visual feedback for code resend
- **Error Handling** - Clear error messages and validation

## 🎨 Design System

### **Brand Colors**
- **EUEM Purple** (#201139) - Primary brand color
- **EUEM Red** (#FE4B4A) - Accent color for actions
- **EUEM Blue** (#4666FF) - Secondary color
- **EUEM Cyan** (#12B5F7) - Highlight color

### **Component Library**
- **Consistent Spacing** - 4px base unit system
- **Typography Scale** - Responsive text sizing
- **Border Radius** - Consistent corner rounding
- **Shadow System** - Layered shadow depths

### **Responsive Breakpoints**
- **Mobile** (< 640px)
- **Small** (640px - 768px)
- **Medium** (768px - 1024px)
- **Large** (1024px+)

## 📱 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile Safari** 14+
- **Chrome Mobile** 90+

## 🔧 Configuration

### **Tailwind CSS**
The project uses a comprehensive Tailwind configuration with:
- Custom color palette matching EUEM branding
- Extended component variants
- Typography plugin for markdown content
- Responsive design utilities

### **TypeScript**
Strict TypeScript configuration with:
- Path mapping for clean imports
- Strict mode enabled
- No implicit any types
- ES2017 target for modern features

### **ESLint & Prettier**
Code quality tools configured for:
- Consistent code formatting
- Import organization
- React best practices
- Accessibility guidelines

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** and ensure tests pass
4. **Commit your changes** (`git commit -m 'Add amazing feature'`)
5. **Push to the branch** (`git push origin feature/amazing-feature`)
6. **Open a Pull Request**

### **Development Guidelines**
- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** - The React framework for production
- **Tailwind CSS** - The utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Vercel** - Deployment platform and Next.js creators

---

**Built with ❤️ by EUEM** | [Portfolio Website](https://euem.net) | [GitHub](https://github.com/euemm)