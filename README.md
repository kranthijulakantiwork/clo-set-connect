# CLO-SET CONNECT Store

A React application built for the CLO Virtual Fashion front-end developer assessment. This app implements a content store with advanced filtering, searching, and sorting capabilities.

## 🚀 Features

### Required Features ✅
- **Content Filtering**: Filter by Pricing Options (Paid, Free, View Only)
- **Keyword Search**: Search by title or user name with real-time filtering
- **Responsive Grid Layout**: 
  - 4 columns (default)
  - 3 columns (< 1200px)
  - 2 columns (< 768px)
  - 1 column (< 480px)
- **Infinite Scroll**: Load more items as you scroll with react-window virtualization
- **URL Persistence**: Filters and search persist across page reloads using URL parameters (no browser storage)
- **Reset Functionality**: Clear all filters with one click

### Optional Features ✅
- **TypeScript**: Full TypeScript implementation with type safety
- **Sorting**: Sort by Item Name, Higher Price, or Lower Price
- **Price Range Slider**: Filter paid items by price range (0-999)
- **Skeleton UI**: Loading states for better UX

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **TailwindCSS** - Styling
- **react-window** - Virtualized list rendering for performance

## 📦 Installation

\`\`\`bash
# Clean install (recommended)
# 1. Delete node_modules and package-lock.json if they exist
rm -rf node_modules package-lock.json

# 2. Clear npm cache
npm cache clean --force

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
\`\`\`

The app will be available at `http://localhost:5173`

## 🏗️ Architecture

### State Management
- **Redux Toolkit** for centralized state management
- Single store with content slice managing:
  - Items data
  - Filters (pricing, search, sort, price range)
  - Pagination state
  - Loading states

### URL Synchronization
- Custom `useURLSync` hook manages URL parameters
- Filters persist across page reloads without localStorage
- Clean URL structure for sharing filtered views

### Component Structure
\`\`\`
src/
├── components/
│   ├── Header.tsx           # App header with branding
│   ├── SearchBar.tsx        # Search input with debouncing
│   ├── FilterPanel.tsx      # All filter controls
│   ├── PriceRangeSlider.tsx # Custom range slider
│   ├── ContentGrid.tsx      # Virtualized grid with infinite scroll
│   ├── ContentCard.tsx      # Individual item card
│   └── SkeletonCard.tsx     # Loading skeleton
├── store/
│   ├── store.ts             # Redux store configuration
│   └── contentSlice.ts      # Content state and reducers
├── hooks/
│   ├── useURLSync.ts        # URL synchronization hook
│   └── useWindowSize.ts     # Window size tracking for responsive grid
├── types/
│   └── index.ts             # TypeScript type definitions
└── App.tsx                  # Main app component
\`\`\`

## 🎯 Key Implementation Details

### Filtering Logic
- All filtering happens on the frontend
- Multiple filters can be combined
- Filters are applied in order: pricing → search → price range → sort

### Infinite Scroll with Virtualization
- Uses react-window for efficient rendering of large lists
- Only renders visible items in the viewport
- Automatically loads more items when scrolling near the bottom
- Skeleton UI shows while loading more items

### Price Range Slider
- Custom implementation with drag handles
- Only active when "Paid" option is selected
- Prevents handle overlap
- Updates on mouse release for better performance

### Responsive Design
- Mobile-first approach with dark theme
- Breakpoints: 480px, 768px, 1200px
- Grid automatically adjusts columns based on viewport width
- Optimized touch interactions

## 📝 Package Choices

### Core Dependencies
- **React 18**: Latest stable version with concurrent features
- **Redux Toolkit**: Simplified Redux with built-in best practices
- **TypeScript**: Type safety and better developer experience

### Build Tools
- **Vite**: Fast dev server and optimized builds
- **TailwindCSS**: Utility-first CSS for rapid UI development

### Performance
- **react-window**: Virtualized rendering for handling large lists efficiently

## 🌐 API

Data is fetched from:
\`\`\`
GET https://closet-recruiting-api.azurewebsites.net/api/data
\`\`\`

### Data Structure
- `imagePath`: URL to the item image
- `title`: Item name
- `userName`: Creator name
- `pricingOption`: 0 (Paid), 1 (Free), 2 (View Only)
- `price`: Price for paid items

## 🎨 Design

The UI follows a dark theme design with:
- Dark navy background (#0f1419)
- Light cards for content items
- Purple accent for interactive elements
- Responsive grid layout matching the provided design specifications

## 📄 License

This project was created as part of a technical assessment for CLO Virtual Fashion.
