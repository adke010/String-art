# String Art 2026 - PRD (Product Requirements Document)

## Overview
**String Art 2026** is a web application that converts photos into string art patterns using an advanced greedy algorithm. The app calculates the optimal path for a continuous thread to recreate any image with mathematical precision and artisanal beauty.

## Tech Stack
- **Frontend**: React.js with Framer Motion animations
- **Styling**: Tailwind CSS with shadcn/ui components
- **Design System**: Custom HSL-based color tokens (stone/rose palette)
- **State Management**: React useState/useEffect hooks
- **Storage**: LocalStorage for progress persistence

## Application Structure

### 1. Landing Page (`/components/landing/LandingPage.jsx`)
A beautifully animated landing page with:
- **Navigation**: Sticky header with logo, nav links, and CTA button
- **Hero Section**: Animated headline with before/after image comparison slider
- **Social Proof**: Technology badges and user statistics
- **Features Section**: 3 feature cards with icons
- **How It Works**: 3-step process with visual example
- **Testimonials**: 3 testimonial cards with ratings
- **CTA Section**: Dark background with glowing action button
- **Footer**: Logo, copyright, and navigation links

### 2. String Art Generator (`/components/app/StringArtGenerator.jsx`)
The main application with:
- **Header**: Home button, status indicator
- **Control Panel**:
  - Image upload (drag & drop or click)
  - Brightness/Contrast adjustments
  - Configuration: Lines (1000-10000), Size (cm), Pins count
  - Generate/Stop buttons
  - Guide mode and download options
- **Canvas Area**:
  - Live preview of string art generation
  - Statistics display
  - History panel for version restoration
- **Guide Modal**: Step-by-step construction assistant

## Key Features

### Algorithm
- **Greedy optimization**: Finds optimal thread path for maximum darkness coverage
- **Bresenham's line algorithm**: Efficient pixel-to-pin connection
- **Error matrix subtraction**: Prevents thread concentration in same areas
- **Real-time rendering**: Shows progress as lines are calculated

### User Experience
- **Smooth animations**: Framer Motion for page transitions and interactions
- **Responsive design**: Mobile-first approach, works on all devices
- **Progress persistence**: Saves guide step in LocalStorage
- **History tracking**: Stores recent generations for comparison
- **Time estimation**: Calculates remaining construction time

## Design System

### Colors (HSL Format)
- **Stone palette**: Warm neutrals for backgrounds and text
- **Rose accent**: Primary action color (#f43f5e)
- **Semantic tokens**: --background, --foreground, --primary, --accent, etc.

### Typography
- **Primary font**: Inter (headings and body)
- **Display font**: Playfair Display (decorative use)

### Components
- Custom button variants (primary, accent, ghost, outline)
- Enhanced sliders with rose accent
- Progress bars with smooth animations
- Feature cards with hover effects

## File Structure
```
/app/frontend/src/
├── App.js                          # Main app with view routing
├── index.css                       # Design system tokens & utilities
├── components/
│   ├── landing/
│   │   └── LandingPage.jsx        # Landing page component
│   ├── app/
│   │   └── StringArtGenerator.jsx # Main generator app
│   └── ui/                         # shadcn components
└── tailwind.config.js              # Tailwind configuration
```

## How to Use

1. **Landing Page**: Click "COMENZAR A CREAR" or "Iniciar App"
2. **Upload Image**: Drag & drop or click to select an image
3. **Adjust Image**: Use brightness/contrast sliders, zoom and pan to frame
4. **Configure**: Set lines count (4000 default), size in cm, and pins
5. **Generate**: Click "GENERAR ARTE" and watch the algorithm work
6. **Build**: Click "INICIAR EN LIENZO" for step-by-step construction guide
7. **Export**: Download TXT file with pin sequence instructions

## Notes
- This is a **frontend-only prototype** with no backend integration
- All data is stored locally in browser
- Algorithm runs entirely in browser using Canvas API
- Works best with high-contrast portrait images
