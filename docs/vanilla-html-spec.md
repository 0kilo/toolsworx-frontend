# Convert-All: Vanilla HTML/JavaScript/CSS Specification

## Project Overview

Convert-All is a comprehensive collection of online tools and utilities built with pure HTML, JavaScript, and CSS. This specification defines the architecture for a modular, SEO-optimized, and maintainable web application that provides 80+ tools across 8 categories including unit conversions, calculators, file converters, media tools, developer utilities, filters, helpful calculators, and charts.

### Key Objectives
- **Modular Architecture**: Easy addition and removal of tools through registry-based configuration
- **SEO Optimization**: Fast loading, semantic HTML, structured data, and meta tag management
- **Responsive Design**: Mobile-first approach with consistent theming
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation and screen reader support
- **Performance**: Optimized bundle size, lazy loading, and efficient rendering

## Tech Stack

### Core Technologies
- **HTML5**: Semantic markup with ARIA attributes for accessibility
- **JavaScript (ES6+)**: Vanilla JS with modern features, no frameworks
- **CSS3**: Custom properties, CSS Grid/Flexbox, animations, and responsive design

### Build Tools & Development
- **Vite**: Fast development server and optimized production builds
- **ESLint**: JavaScript linting with Airbnb config
- **Prettier**: Code formatting consistency
- **PostCSS**: CSS processing with autoprefixer

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Folder Structure

```
vanilla-convert-all/
├── docs/                    # Documentation
├── public/                  # Static assets
│   ├── assets/             # Images, icons, fonts
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base components (Button, Card, etc.)
│   │   └── layouts/       # Layout components
│   ├── tools/             # Tool implementations
│   │   ├── categories/    # Tool categories
│   │   ├── registry/      # Tool registry system
│   │   └── shared/        # Shared tool utilities
│   ├── styles/            # CSS stylesheets
│   │   ├── base/          # Base styles and resets
│   │   ├── components/    # Component-specific styles
│   │   ├── themes/        # Theme definitions
│   │   └── utilities/     # Utility classes
│   ├── utils/             # JavaScript utilities
│   │   ├── api/           # API helpers
│   │   ├── converters/    # Conversion logic
│   │   ├── formatters/    # Data formatters
│   │   └── validators/    # Input validation
│   ├── config/            # Configuration files
│   │   ├── site.js        # Site metadata
│   │   └── tools.json     # Tool definitions
│   ├── pages/             # HTML pages
│   │   ├── index.html     # Homepage
│   │   ├── tools.html     # Tools listing
│   │   └── tool.html      # Individual tool template
│   └── app.js             # Main application logic
├── tests/                 # Test files
├── package.json
├── vite.config.js
└── README.md
```

## Theme System

### Design Tokens
Based on the existing globals.css with OKLCH color space for better color management:

```css
:root {
  /* Base Colors */
  --color-primary: #17346d;
  --color-primary-light: oklch(0.7 0.15 250);
  --color-primary-dark: oklch(0.3 0.2 250);

  /* Semantic Colors */
  --color-background: #ffffff;
  --color-surface: #f8f9fa;
  --color-text: #212529;
  --color-text-muted: #6c757d;

  /* Status Colors */
  --color-success: #28a745;
  --color-warning: #ffc107;
  --color-error: #dc3545;
  --color-info: #17a2b8;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-xxl: 3rem;

  /* Typography */
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  /* Layout */
  --border-radius-sm: 0.25rem;
  --border-radius-md: 0.375rem;
  --border-radius-lg: 0.5rem;
  --border-radius-xl: 0.75rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

  /* Transitions */
  --transition-fast: 150ms ease-in-out;
  --transition-normal: 250ms ease-in-out;
  --transition-slow: 350ms ease-in-out;
}

/* Dark Theme */
[data-theme="dark"] {
  --color-background: #121212;
  --color-surface: #1e1e1e;
  --color-text: #ffffff;
  --color-text-muted: #b0b0b0;
  /* ... other dark theme overrides */
}
```

### Theme Implementation
- CSS custom properties for dynamic theming
- JavaScript-based theme switching
- CSS-in-JS utilities for component theming
- Consistent design system across all components

## Component Library

### Core Components

#### Button Component
```javascript
class Button {
  constructor(options = {}) {
    this.variant = options.variant || 'primary';
    this.size = options.size || 'md';
    this.disabled = options.disabled || false;
    this.loading = options.loading || false;
  }

  render(content) {
    const classes = [
      'btn',
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.disabled ? 'btn-disabled' : '',
      this.loading ? 'btn-loading' : ''
    ].filter(Boolean).join(' ');

    return `
      <button class="${classes}" ${this.disabled ? 'disabled' : ''}>
        ${this.loading ? '<span class="spinner"></span>' : ''}
        ${content}
      </button>
    `;
  }
}
```

#### Card Component
```javascript
class Card {
  constructor(options = {}) {
    this.elevation = options.elevation || 'md';
    this.padding = options.padding || 'md';
    this.interactive = options.interactive || false;
  }

  render(content, header = '', footer = '') {
    const classes = [
      'card',
      `card-elevation-${this.elevation}`,
      `card-padding-${this.padding}`,
      this.interactive ? 'card-interactive' : ''
    ].filter(Boolean).join(' ');

    return `
      <div class="${classes}">
        ${header ? `<div class="card-header">${header}</div>` : ''}
        <div class="card-body">${content}</div>
        ${footer ? `<div class="card-footer">${footer}</div>` : ''}
      </div>
    `;
  }
}
```

#### Form Components
- Input (text, number, email, etc.)
- Select dropdown
- Checkbox and radio groups
- File upload with drag-and-drop
- Range slider
- Textarea with auto-resize

#### Layout Components
- Container with responsive breakpoints
- Grid system (CSS Grid based)
- Flex utilities
- Navigation components
- Modal and overlay system

#### Data Display
- Table with sorting and pagination
- List components
- Badge and tag system
- Progress bars
- Charts (Canvas/SVG based)

### Component Guidelines
- Consistent API across all components
- JavaScript classes for component logic
- CSS modules for styling isolation
- Event-driven architecture
- Accessibility built-in (ARIA, keyboard navigation)

## Tool Registry System

### Registry Structure
```json
{
  "categories": [
    {
      "id": "unit-conversions",
      "name": "Unit Conversions",
      "description": "Convert between different units of measurement",
      "icon": "swap-horizontal",
      "tools": [
        {
          "id": "length-converter",
          "title": "Length Converter",
          "description": "Convert between microns, millimeters, inches, feet, meters, kilometers, miles",
          "keywords": ["length", "distance", "measurement"],
          "path": "/tools/length-converter",
          "category": "unit-conversions",
          "popular": true,
          "inputs": [
            {
              "type": "number",
              "label": "Value",
              "placeholder": "Enter length value",
              "required": true
            },
            {
              "type": "select",
              "label": "From Unit",
              "options": ["microns", "millimeters", "inches", "feet", "meters", "kilometers", "miles"]
            }
          ],
          "outputs": [
            {
              "type": "number",
              "label": "Result",
              "precision": 4
            }
          ]
        }
      ]
    }
  ]
}
```

### Registry Management
- JSON-based configuration for easy maintenance
- Category-based organization
- Tool metadata for SEO and discovery
- Input/output schema definitions
- Validation rules and constraints

### Tool Implementation Pattern
```javascript
class Tool {
  constructor(config) {
    this.config = config;
    this.inputs = {};
    this.outputs = {};
  }

  initialize(container) {
    this.container = container;
    this.render();
    this.bindEvents();
  }

  render() {
    const html = `
      <div class="tool-container">
        <div class="tool-inputs">
          ${this.renderInputs()}
        </div>
        <div class="tool-outputs">
          ${this.renderOutputs()}
        </div>
      </div>
    `;
    this.container.innerHTML = html;
  }

  renderInputs() {
    return this.config.inputs.map(input => this.renderInput(input)).join('');
  }

  renderInput(input) {
    // Input rendering logic based on type
  }

  calculate() {
    // Core calculation logic
  }

  bindEvents() {
    // Event binding for inputs and actions
  }
}
```

## SEO Optimization

### Meta Tags & Structured Data
```html
<!-- Basic Meta Tags -->
<meta name="description" content="Free online tools for unit conversions, calculations, file processing, and more. 80+ tools available.">
<meta name="keywords" content="converter, calculator, tools, online, free">
<meta name="author" content="Convert-All">

<!-- Open Graph -->
<meta property="og:title" content="Convert-All - Free Online Tools">
<meta property="og:description" content="Comprehensive collection of online conversion and calculation tools">
<meta property="og:image" content="/assets/og-image.png">
<meta property="og:url" content="https://convert-all.com">

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Convert-All - Free Online Tools">
<meta name="twitter:description" content="80+ free online tools for conversions, calculations, and more">

<!-- Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Convert-All",
  "description": "Free online tools for conversions and calculations",
  "url": "https://convert-all.com",
  "applicationCategory": "Utility",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
</script>
```

### Technical SEO
- **Performance**: Lazy loading, code splitting, optimized images
- **Mobile**: Responsive design, touch-friendly interactions
- **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation
- **Core Web Vitals**: Fast loading, smooth interactions, stable layout
- **Sitemap**: Dynamic generation for all tools and pages
- **Robots.txt**: Proper crawling directives

### Content Strategy
- Tool-specific meta descriptions
- Keyword-rich tool titles and descriptions
- Category landing pages
- Breadcrumb navigation
- Related tools suggestions

## Development Guidelines

### Code Style
- **JavaScript**: Airbnb style guide with ES6+ features
- **CSS**: BEM methodology with CSS custom properties
- **HTML**: Semantic markup with accessibility considerations
- **Naming**: camelCase for JS, kebab-case for CSS classes and files

### Performance Guidelines
- Bundle size under 100KB gzipped
- Lazy loading for non-critical resources
- Efficient DOM manipulation
- Memory leak prevention
- Image optimization (WebP, responsive images)

### Accessibility (WCAG 2.1 AA)
- Color contrast ratios minimum 4.5:1
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Alternative text for images
- Semantic HTML structure

### Testing Strategy
- Unit tests for utility functions
- Integration tests for components
- E2E tests for critical user flows
- Accessibility testing with axe-core
- Performance testing with Lighthouse

### Security Considerations
- Content Security Policy (CSP)
- Input sanitization and validation
- XSS prevention
- Secure external API calls
- Regular dependency updates

## Deployment & Maintenance

### Build Process
```javascript
// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['core-js'],
          ui: ['components'],
          tools: ['tools']
        }
      }
    }
  }
}
```

### Hosting Recommendations
- **Static Hosting**: Netlify, Vercel, or Cloudflare Pages
- **CDN**: Global content delivery for assets
- **Monitoring**: Performance monitoring and error tracking
- **Analytics**: Privacy-focused analytics (Plausible, Fathom)

### Maintenance Workflow
- Automated deployment on git push
- Version control with semantic versioning
- Regular dependency updates
- Performance monitoring
- User feedback collection

### Tool Addition Process
1. Create tool implementation in `src/tools/`
2. Add configuration to `src/config/tools.json`
3. Test functionality and accessibility
4. Update documentation
5. Deploy and monitor

This specification provides a solid foundation for building a maintainable, scalable, and SEO-optimized vanilla web application with the same comprehensive toolset as the existing Next.js version.
