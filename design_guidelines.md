# GetStreetCred Design Guidelines

## Design Approach: Reference-Based (Social + Content Platform Hybrid)

Drawing inspiration from **Behance** (project showcasing), **Product Hunt** (rating/voting systems), and **Instagram** (visual grid layouts) to create an engaging platform that celebrates modern infrastructure through community ratings and visual storytelling.

## Core Design Principles

1. **Dark, Professional Aesthetic**: Dark background (#0f0f0f to #1a1a1a) establishes authority and makes project imagery pop
2. **Yellow as Power Accent**: Vibrant yellow (#fbbf24 to #fcd34d) for CTAs, ratings, and interactive elements
3. **Image-First Content**: Infrastructure projects are inherently visual - prioritize high-quality imagery
4. **Trust Through Transparency**: Clear rating metrics, community feedback, and project details

## Typography System

- **Primary Font**: Inter or DM Sans (modern, highly legible)
- **Display Font**: Space Grotesk or Outfit for hero headlines (architectural, bold)
- **Hierarchy**:
  - Hero Headlines: 3.5rem to 4.5rem, bold (700-800)
  - Section Titles: 2rem to 2.5rem, semibold (600)
  - Project Names: 1.25rem to 1.5rem, medium (500)
  - Body Text: 1rem, regular (400)
  - Metadata (location, dates): 0.875rem, light gray text

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 20 for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-20
- Card gaps: gap-6 to gap-8

**Container Strategy**:
- Max-width: max-w-7xl for main content
- Full-width for hero and grid sections with inner constraints

## Component Library

### Navigation Bar
- Fixed dark header with subtle border-bottom
- Logo left, navigation center (Trending Projects, Top Rated, Add Projects)
- Right-aligned auth buttons: Sign In (ghost style), Join Now (yellow fill)
- Height: 64px to 72px with backdrop blur

### Hero Section
- **Layout**: Full-width with large featured project image (60-70% viewport height)
- **Image Treatment**: High-quality infrastructure photo with subtle gradient overlay (dark bottom fade)
- **Content Placement**: Positioned over image (left or center-aligned)
  - Project name in large display type
  - Location with pin icon
  - Brief description (2-3 lines, max-w-2xl)
  - Yellow CTA button with blurred background backdrop
  - Star rating display with yellow stars
- **Button Styling**: px-8 py-3, blurred dark background (bg-black/40 backdrop-blur-md), yellow border, white text

### Trending Projects Section
- **Grid Layout**: 3-column desktop (lg:grid-cols-3), 2-column tablet (md:grid-cols-2), single mobile
- **Section Header**: "Trending Projects" with view all link
- Display 6-9 project cards minimum for visual impact

### Project Cards
- **Structure**: Vertical card with image-dominant design
- **Image**: 16:9 aspect ratio thumbnail, object-cover, rounded corners (rounded-xl)
- **Content Overlay** (on hover): Dark gradient from bottom
- **Card Details** (always visible below image):
  - Project name (font-medium, text-lg)
  - Location with subtle icon
  - Rating stars (yellow) with vote count
  - Completion year or status badge
- **Interaction**: Subtle scale transform on hover (hover:scale-105), smooth transition
- Border: 1px border with gray-800

### Rating System
- Yellow star icons (filled/outlined states)
- Display format: ★★★★☆ 4.2 (1.2K ratings)
- Prominent placement on hero and cards

### Additional Components for Future Phases
- Filter bar with category tags (Bridges, Towers, Transportation, etc.)
- Sort dropdown (Top Rated, Most Recent, Most Discussed)
- Empty states for no results with yellow accent illustration

## Images Strategy

**Required Images**:
1. **Hero Image**: High-resolution photo of featured modern infrastructure project (Hong Kong-Zhuhai-Macau Bridge recommended) - 1920x1080 minimum, landscape orientation
2. **Project Thumbnails**: 6-9 images of modern infrastructure:
   - Hong Kong-Zhuhai-Macau Bridge
   - Burj Khalifa
   - Shanghai Tower
   - The Line (NEOM, Saudi Arabia)
   - Singapore Changi Airport Jewel
   - Tokyo Skytree
   - Marina Bay Sands
   - High-speed rail stations (Japan/China)
   - All images should be 800x450px minimum, consistent aspect ratio

**Image Treatment**: Slight desaturation on cards, full saturation on hover, sharp focus on architectural details

## Animations

Minimal, purposeful motion:
- Card hover: scale and shadow lift (transition-transform duration-300)
- Button hover: brightness increase, no complex animations
- Page transitions: None
- Scroll effects: None

## Responsive Behavior

- **Desktop (1024px+)**: 3-column grid, full hero height
- **Tablet (768px-1023px)**: 2-column grid, reduced hero height (60vh)
- **Mobile (<768px)**: Single column, hero 50vh, stacked navigation

## Accessibility

- ARIA labels for star ratings and interactive elements
- Keyboard navigation for all cards and buttons
- High contrast maintained (yellow on dark, white on dark)
- Focus states with yellow outline

This design creates a visually stunning, Instagram-meets-Product Hunt experience that celebrates modern infrastructure through community engagement and beautiful imagery.