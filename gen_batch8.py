#!/usr/bin/env python3
"""Generate 100 blogs (1221-1320) about Design Systems, UX, UI, Developer Career, Remote Work, Tech Industry."""

import sys
sys.path.insert(0, '/home/minhvnq/Desktop/Web/MinhOmega.github.io')
import blog_generator

# Check existing slugs
with open('/tmp/existing_slugs.txt') as f:
    existing = set(line.strip() for line in f)

def check(slug):
    if slug in existing:
        print(f"WARNING: duplicate slug {slug}")
        return False
    existing.add(slug)
    return True

blogs = []

# Blog 1221
check("building-a-design-system-from-scratch")
blogs.append(blog_generator.write_blog(
    "Building a Design System From Scratch in 2024",
    "building-a-design-system-from-scratch-2024",
    "2019-01-05",
    "Learn how to build a production-ready design system from scratch with tokens, components, documentation, and governance.",
    ["Design Systems", "UI", "Frontend", "Components"],
    "design",
    [
        ("Why Design Systems Matter",
         """Design systems have become the backbone of modern product development. They provide a shared language between designers and developers, ensuring consistency across products and teams. A well-built design system reduces development time by 30-50%, improves accessibility, and creates a cohesive user experience across all touchpoints.

The key benefits of a design system include consistency across all products and platforms, faster development through reusable components, better collaboration between design and engineering teams, improved accessibility compliance, and easier onboarding for new team members. Companies like Airbnb, Shopify, and Salesforce have invested heavily in design systems because they understand the compounding returns on this investment.

A design system is more than a component library. It encompasses design tokens, component patterns, documentation, usage guidelines, governance processes, and the tools that support the entire workflow. The most successful design systems treat documentation and governance with the same rigor as the code itself."""),
        ("Defining Design Tokens",
         """Design tokens are the foundation of any design system. They represent the smallest design decisions: colors, typography, spacing, shadows, border radii, and animation timings. Instead of hardcoding values like #3B82F6 or 16px throughout your codebase, you reference semantic tokens like color-primary or spacing-md.

There are three levels of design tokens. Primitive tokens are raw values like color-blue-500: #3B82F6. Semantic tokens give meaning: color-action-primary: {color-blue-500}. Component tokens scope to specific components: button-background-primary: {color-action-primary}. This layered approach makes theme switching trivial and ensures design decisions are centralized.

```json
{
  "color": {
    "primitive": {
      "blue-500": "#3B82F6",
      "gray-100": "#F3F4F6"
    },
    "semantic": {
      "action-primary": "{color.primitive.blue-500}",
      "surface-background": "{color.primitive.gray-100}"
    }
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  }
}
```

Tools like Style Dictionary transform tokens into platform-specific formats: CSS custom properties, iOS Swift constants, Android XML resources, and Tailwind config objects. This single-source-of-truth approach means a designer changes a token once and it propagates everywhere."""),
        ("Component Architecture",
         """The component architecture defines how your design system's building blocks are structured. Each component should follow the single responsibility principle: one component, one job. A Button component handles click interactions and visual states. A TextInput handles text entry with validation. Compose these atomic pieces into molecules and organisms following atomic design methodology.

Component APIs should be predictable and consistent. If one component uses a size prop with values small, medium, large, every component should follow the same pattern. Consistency in APIs reduces cognitive load for consumers of your design system.

```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  leftIcon,
  rightIcon,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        loading && 'btn-loading'
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size={size} />}
      {!loading && leftIcon}
      <span>{children}</span>
      {rightIcon}
    </button>
  );
};
```

Composition patterns let complex components build from simple ones. A SearchInput composes TextInput with an Icon and a clear Button. A Modal composes an Overlay, a Card, and action Buttons. Document these composition patterns so consumers understand how to combine components correctly."""),
        ("Theming and Customization",
         """Theming allows your design system to adapt to different brands, products, or user preferences without changing component code. The most effective theming approach uses CSS custom properties that map to design tokens, enabling runtime theme switching without JavaScript overhead.

A robust theming system supports light and dark modes, brand variations for white-label products, high-contrast accessibility themes, and user-customizable preferences. The key is separating what changes (colors, typography, spacing scales) from what stays consistent (component structure, behavior, interaction patterns).

```css
:root {
  --color-background: #FFFFFF;
  --color-foreground: #111827;
  --color-primary: #3B82F6;
  --color-surface: #F9FAFB;
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  --color-background: #111827;
  --color-foreground: #F9FAFB;
  --color-primary: #60A5FA;
  --color-surface: #1F2937;
  --shadow-card: 0 1px 3px rgba(0, 0, 0, 0.3);
}

[data-theme="brand-acme"] {
  --color-primary: #FF6B35;
  --color-surface: #FFF8F0;
}
```

Runtime theme switching uses a data attribute on the root element. Users select their preference, you set the attribute, and CSS custom properties cascade the change through every component instantly. Store the preference in localStorage for persistence across sessions."""),
        ("Documentation and Storybook",
         """Documentation is what separates a component library from a true design system. Without clear documentation, developers won't know what components exist, when to use them, or how to combine them correctly. Storybook has become the industry standard for component documentation and visual testing.

Every component needs several types of documentation. A usage guide explains when and why to use the component. Props documentation lists every prop with types, defaults, and descriptions. Accessibility notes describe keyboard navigation, screen reader behavior, and ARIA requirements. Examples show common use cases and compositions. Do-and-don't guidelines prevent misuse.

```tsx
// Button.stories.tsx
export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
  },
};

export const Primary = {
  args: {
    variant: 'primary',
    children: 'Click me',
  },
};

export const Loading = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Saving...',
  },
};
```

Automate documentation generation from TypeScript interfaces using tools like react-docgen. Integrate accessibility checks with Storybook's a11y addon. Use Chromatic or Percy for visual regression testing to catch unintended visual changes before they reach production."""),
        ("Governance and Contribution Models",
         """A design system without governance becomes outdated and fragmented within months. Governance defines how decisions are made, how components get added or modified, and how the system evolves with product needs. The most successful design systems use a federated contribution model with a central team providing direction.

The central design system team owns the core: tokens, primitive components, documentation infrastructure, and release processes. Feature teams contribute domain-specific components through a well-defined process. This model scales better than a single team trying to build everything because feature teams understand their domain needs best.

A typical contribution workflow starts with a proposal: the contributor describes the need, sketches the API, and gets alignment on scope. Then they build, following established patterns and testing requirements. A review ensures quality, accessibility, and API consistency. Finally, the component gets published with documentation and added to the system's changelog.

Version management follows semantic versioning strictly. Breaking changes get a major version bump with migration guides. New features get minor versions. Bug fixes get patches. A deprecation policy gives consumers time to migrate, typically two minor versions before removal. This predictability builds trust and encourages adoption across the organization."""),
        ("Testing Design System Components",
         """Design systems require more rigorous testing than typical application code because bugs affect every consumer. Unit tests verify component behavior: rendering with different props, handling user interactions, and managing state changes. Accessibility tests ensure WCAG compliance using axe-core or jest-axe. Visual regression tests catch unintended visual changes.

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
```

Cross-browser testing ensures components render correctly in all supported browsers. Use BrowserStack or Playwright to test across Chrome, Firefox, Safari, and Edge. Mobile testing verifies touch interactions, responsive layouts, and performance on lower-powered devices."""),
        ("Scaling Your Design System",
         """As your organization grows, your design system must scale accordingly. This means supporting multiple frameworks, platforms, and consumption patterns. A monorepo structure with Turborepo or Nx keeps all packages in sync while enabling independent development and testing.

Multi-framework support can be achieved through web components as the base layer, with framework-specific wrappers for React, Vue, Angular, and Svelte. Tools like Stencil or Lit compile to standards-based web components that work everywhere. Framework wrappers add framework-specific ergonomics like React hooks or Vue composables.

Performance optimization becomes critical at scale. Bundle analysis ensures consumers only ship what they use through tree-shaking. Lazy loading defers non-critical component initialization. CSS-in-JS solutions like vanilla-extract or CSS modules generate minimal runtime CSS. Server-side rendering compatibility ensures components work in SSR and static generation contexts.

Metrics track design system health and adoption. Component usage analytics show which components are most popular and which are underutilized. Contribution metrics reveal whether federated contribution is working. Developer satisfaction surveys measure the system's impact on productivity. Bug reports and issue resolution times indicate quality trends. These metrics justify continued investment and guide roadmap prioritization."""),
    ]
))

# Blog 1222
check("design-tokens-cross-platform-guide")
blogs.append(blog_generator.write_blog(
    "Design Tokens: A Cross-Platform Guide",
    "design-tokens-cross-platform-guide",
    "2019-02-10",
    "Master design tokens for consistent design across web, iOS, and Android. Learn token architecture, tooling, and implementation patterns.",
    ["Design Tokens", "Cross-Platform", "CSS", "Mobile"],
    "design",
    [
        ("What Are Design Tokens?",
         """Design tokens are named entities that store visual design attributes. They represent the atoms of your design system: colors, typography, spacing, sizing, shadows, borders, opacity, animation durations, and z-index values. Instead of referencing raw values like #3B82F6 or 16px directly, you reference tokens like color-primary or spacing-md.

The concept emerged from the need to synchronize design decisions across multiple platforms. When a designer updates a color in Figma, that change needs to propagate to the web app, iOS app, Android app, email templates, and marketing site simultaneously. Design tokens make this possible by serving as the single source of truth that all platforms consume.

Token naming conventions follow a structured pattern that conveys both the category and the purpose. A well-named token like color-background-surface-primary tells you it's a color, specifically for background surfaces, and it's the primary variant. This semantic naming makes tokens self-documenting and reduces the chance of misuse."""),
        ("Token Categories and Hierarchy",
         """Effective token systems organize tokens into clear categories with a hierarchical structure. The three-tier hierarchy consists of global tokens, alias tokens, and component-specific tokens. Global tokens define raw values. Alias tokens map semantic meanings. Component tokens scope decisions to specific components.

Color tokens typically organize by function: background, foreground, border, text, action, feedback, and overlay categories. Each category contains semantic variants: primary, secondary, tertiary, success, warning, error, and info. This structure provides enough flexibility to handle any UI pattern while remaining organized and predictable.

Typography tokens capture font families, sizes, weights, line heights, and letter spacing. Rather than using pixel values, typography tokens reference a type scale: display-xl, display-lg, heading-1 through heading-6, body-lg, body-md, body-sm, caption, and overline. Spacing tokens follow a mathematical scale, typically 4px increments: 0, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96. This constrained scale enforces visual rhythm and consistency."""),
        ("Tools: Style Dictionary and Token Studio",
         """Style Dictionary by Amazon is the most widely adopted tool for transforming design tokens into platform-specific outputs. It reads token files in JSON or YAML, applies transforms, and generates output files for CSS, iOS, Android, and any custom format. The transform pipeline handles naming conventions, value calculations, and format conversions automatically.

```json
{
  "source": ["tokens/**/*.json"],
  "platforms": {
    "css": {
      "transformGroup": "css",
      "buildPath": "build/css/",
      "files": [{
        "destination": "variables.css",
        "format": "css/variables"
      }]
    },
    "ios": {
      "transformGroup": "ios-swift",
      "buildPath": "build/ios/",
      "files": [{
        "destination": "StyleDictionary.swift",
        "format": "ios-swift/class.swift"
      }]
    },
    "android": {
      "transformGroup": "android",
      "buildPath": "build/android/",
      "files": [{
        "destination": "style_dictionary_colors.xml",
        "format": "android/colors"
      }]
    }
  }
}
```

Token Studio (formerly Figma Tokens) bridges the design-development gap by storing tokens in Figma and syncing them to your codebase through Git. Designers modify tokens visually in Figma, create a pull request, and developers review and merge the changes. This workflow eliminates the handoff friction that plagues traditional design-to-code workflows."""),
        ("Implementing Tokens in CSS",
         """CSS custom properties are the native web implementation for design tokens. They cascade naturally, support runtime modification, and work with every CSS feature. Generate them from your token source using Style Dictionary and include them in your base stylesheet.

```css
:root {
  /* Color Tokens */
  --color-bg-primary: #FFFFFF;
  --color-bg-secondary: #F9FAFB;
  --color-bg-tertiary: #F3F4F6;
  --color-fg-primary: #111827;
  --color-fg-secondary: #6B7280;
  --color-fg-tertiary: #9CA3AF;
  --color-action-primary: #3B82F6;
  --color-action-hover: #2563EB;
  --color-action-active: #1D4ED8;
  --color-feedback-success: #10B981;
  --color-feedback-warning: #F59E0B;
  --color-feedback-error: #EF4444;
  --color-feedback-info: #3B82F6;

  /* Spacing Tokens */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Typography Tokens */
  --font-family-sans: 'Inter', system-ui, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;

  /* Shadow Tokens */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

Components reference these tokens consistently: background-color: var(--color-bg-primary), padding: var(--space-4), font-family: var(--font-family-sans). This pattern makes global style changes trivial: modify the token value, and every component updates automatically."""),
        ("Token Implementation in Tailwind CSS",
         """Tailwind CSS aligns naturally with design tokens through its configuration file. Map your tokens to Tailwind's theme configuration to get utility classes that reflect your design system's decisions. This gives developers the productivity benefits of utility classes while maintaining design system consistency.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      bg: {
        primary: 'var(--color-bg-primary)',
        secondary: 'var(--color-bg-secondary)',
        tertiary: 'var(--color-bg-tertiary)',
      },
      fg: {
        primary: 'var(--color-fg-primary)',
        secondary: 'var(--color-fg-secondary)',
        tertiary: 'var(--color-fg-tertiary)',
      },
      action: {
        primary: 'var(--color-action-primary)',
        hover: 'var(--color-action-hover)',
        active: 'var(--color-action-active)',
      },
    },
    spacing: {
      1: 'var(--space-1)',
      2: 'var(--space-2)',
      3: 'var(--space-3)',
      4: 'var(--space-4)',
      6: 'var(--space-6)',
      8: 'var(--space-8)',
    },
    fontFamily: {
      sans: 'var(--font-family-sans)',
      mono: 'var(--font-family-mono)',
    },
  },
};
```

This configuration means developers write class="bg-primary text-fg-primary p-4 font-sans" and the output CSS references your design tokens. Switch themes by changing the CSS custom property values. The Tailwind config stays the same; only the underlying token values change."""),
        ("Tokens for iOS and Android",
         """Mobile platforms consume design tokens through platform-native formats. iOS uses Swift constants organized in an enum or struct. Android uses XML resource files in the values directory. Style Dictionary generates both formats from the same token source, ensuring parity with the web.

```swift
// Generated Swift token file
public enum DesignTokens {
    public enum Colors {
        public static let bgPrimary = UIColor(red: 1.0, green: 1.0, blue: 1.0, alpha: 1.0)
        public static let bgSecondary = UIColor(red: 0.976, green: 0.980, blue: 0.984, alpha: 1.0)
        public static let actionPrimary = UIColor(red: 0.231, green: 0.510, blue: 0.965, alpha: 1.0)
        public static let feedbackError = UIColor(red: 0.937, green: 0.267, blue: 0.267, alpha: 1.0)
    }
    public enum Spacing {
        public static let xs: CGFloat = 4
        public static let sm: CGFloat = 8
        public static let md: CGFloat = 16
        public static let lg: CGFloat = 24
        public static let xl: CGFloat = 32
    }
    public enum Typography {
        public static let fontSans = "Inter"
        public static let sizeSm: CGFloat = 14
        public static let sizeMd: CGFloat = 16
        public static let sizeLg: CGFloat = 18
    }
}
```

For SwiftUI, design tokens integrate directly into the view layer. Create a custom environment key that provides the token set, enabling theme switching through SwiftUI's environment system. For Jetpack Compose, wrap tokens in a CompositionLocalProvider to propagate them through the component tree."""),
        ("Versioning and Migration",
         """Design tokens evolve as your product and brand evolve. A robust versioning strategy prevents breaking changes from disrupting consumers. Follow semantic versioning: major versions for breaking changes (removing or renaming tokens), minor versions for additions (new tokens), and patches for value updates that maintain the same visual weight.

When deprecating a token, follow a three-phase process. First, mark the token as deprecated in documentation and add a console warning in development builds. Second, provide the replacement token and a migration guide. Third, remove the token in the next major version after giving consumers adequate time to migrate.

Automated migration tools reduce the friction of token changes. Write codemods that search for old token names and replace them with new ones. These codemods work across CSS, JavaScript, Swift, and Kotlin files. Publish them alongside the new version so consumers can run them with a single command rather than manually updating hundreds of references."""),
    ]
))

print(f"Written blog 1222")

# Blog 1223
check("figma-for-developers-design-to-code-workflow-guide")
blogs.append(blog_generator.write_blog(
    "Figma for Developers: The Complete Design-to-Code Workflow",
    "figma-for-developers-design-to-code-workflow-guide",
    "2019-03-18",
    "Master the Figma developer workflow: inspect designs, extract tokens, generate components, and automate handoff.",
    ["Figma", "Design", "Developer Tools", "Workflow"],
    "design",
    [
        ("Why Developers Should Learn Figma",
         """The divide between design and development is one of the biggest sources of friction in product teams. Developers who understand Figma can inspect designs directly, extract exact specifications without back-and-forth questions, prototype interactions, and automate the handoff process. This fluency dramatically reduces cycle time from design to shipped code.

Figma's Dev Mode, introduced in 2023, specifically targets developers. It provides an inspection panel that shows CSS properties, spacing measurements, color values, and typography specs for any selected element. Developers can copy CSS, iOS, or Android code snippets directly from the design. This eliminates the guesswork of translating visual designs into code.

Beyond inspection, Figma's API enables automation. You can extract design tokens programmatically, sync component documentation between Figma and Storybook, generate icon libraries from Figma assets, and validate that implemented components match their designs pixel-for-pixel. These automations compound over time, saving hours each sprint."""),
        ("Navigating the Figma Interface",
         """Understanding Figma's interface lets developers move efficiently through design files. The Layers panel shows the document hierarchy: pages contain frames, frames contain groups and components. The Properties panel on the right shows the selected element's dimensions, position, fills, strokes, effects, and constraints. The toolbar at the top provides selection, frame, shape, text, and pen tools.

Frames are the fundamental layout container in Figma, analogous to div elements in HTML. They can use Auto Layout, which functions identically to CSS Flexbox: direction, alignment, gap, padding, and wrapping. Understanding this mapping makes translating Figma layouts to CSS straightforward. A frame with Auto Layout set to horizontal, center alignment, 16px gap, and 24px padding translates directly to display: flex; flex-direction: row; align-items: center; gap: 16px; padding: 24px.

Components in Figma map to reusable UI components in code. A Figma component with variants (like a Button with Default, Hover, Pressed, Disabled states and Small, Medium, Large sizes) directly corresponds to a React component with props for variant and size. The variant names in Figma should match the prop values in code for seamless translation."""),
        ("Extracting Design Specifications",
         """Dev Mode's inspect panel provides exact specifications for any selected element. Click an element to see its dimensions, padding, margins, colors (in hex, RGB, HSL, or CSS variables), typography properties (font family, size, weight, line height, letter spacing), border radius, shadows, and opacity. Each property includes a copy button for one-click clipboard insertion.

Spacing between elements is measured automatically. Select two elements to see the distance between them. This measurement maps to gap, margin, or padding in your code depending on the parent container's Auto Layout settings. Dev Mode highlights these relationships so you understand which spacing property to use.

```css
/* Typical extraction from Figma Dev Mode */
.hero-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 360px;
}

.hero-card__title {
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
  color: #111827;
}

.hero-card__description {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: #6B7280;
}
```

Figma also supports code syntax highlighting for embedded code blocks. When designers include code examples in their specifications, Dev Mode renders them with proper formatting. This feature is useful for documenting component APIs, usage examples, and accessibility requirements directly alongside the visual design."""),
        ("Figma API for Automation",
         """Figma's REST API opens powerful automation possibilities for developers. You can read file structure, extract component data, download assets, and sync design tokens programmatically. The API uses personal access tokens for authentication and returns JSON responses describing the document tree.

```javascript
const FIGMA_TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = 'your-file-key';

async function getFileComponents() {
  const response = await fetch(
    `https://api.figma.com/v1/files/${FILE_KEY}/components`,
    { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
  );
  const data = await response.json();
  return data.meta.components;
}

async function extractDesignTokens() {
  const response = await fetch(
    `https://api.figma.com/v1/files/${FILE_KEY}/styles`,
    { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
  );
  const styles = await response.json();
  const tokens = {};

  for (const style of styles.meta.styles) {
    const detail = await fetch(
      `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${style.node_id}`,
      { headers: { 'X-Figma-Token': FIGMA_TOKEN } }
    );
    const node = await detail.json();
    tokens[style.name] = node;
  }
  return tokens;
}
```

Tools like Figma2Code, Locofy, and Anima convert Figma designs to production-ready code automatically. While the output always needs human review, these tools handle the boilerplate: basic layouts, spacing, typography, and color application. They save significant time on the mechanical aspects of implementation."""),
        ("Syncing Components with Storybook",
         """Keeping Figma designs and Storybook documentation in sync is a common challenge. When a designer updates a component in Figma, the Storybook stories should reflect the change. Several tools automate this synchronization.

The Figma-addon for Storybook embeds Figma frames directly in Storybook stories. Developers see the design reference alongside the code implementation without switching tools. This visual comparison catches discrepancies immediately during development.

```tsx
// Button.stories.tsx with Figma integration
export default {
  title: 'Components/Button',
  component: Button,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/xxx/Button',
    },
  },
};
```

For deeper integration, tools like Specify extract design tokens and assets from Figma and push them to your codebase through CI/CD pipelines. When a designer modifies a color or spacing value in Figma, Specify detects the change and creates a pull request updating the corresponding design token files. This automation ensures code and design never drift apart."""),
        ("Responsive Design in Figma",
         """Figma supports responsive design through constraints and Auto Layout. Constraints define how elements resize when their parent frame changes size. An element can be pinned to the left, right, top, bottom, center, or stretched to fill. These constraints map directly to CSS positioning and flexbox properties.

Auto Layout frames respond to content changes and viewport resizing. Set a frame's horizontal resizing to "Hug contents" for intrinsic sizing (like inline-flex) or "Fill container" for stretching (like flex: 1). Vertical resizing options include "Hug contents," "Fill container," and a fixed height. These settings translate to CSS flex-grow, flex-shrink, and fixed height properties.

Designers create responsive layouts by building separate frames for different breakpoints: mobile (375px), tablet (768px), and desktop (1440px). Each breakpoint frame contains the same components arranged differently. Developers implement this with CSS media queries or container queries, using the breakpoint-specific layouts as reference. The component structure stays the same; only the layout and sizing change across breakpoints."""),
        ("Version Control and Branching",
         """Figma's branching feature mirrors Git workflows for design files. Designers create branches to experiment with new ideas without affecting the main file. They make changes, request reviews, and merge back to main when approved. This workflow prevents half-baked designs from confusing developers who reference the main file for implementation.

For teams without Figma Organization plans, version control uses naming conventions and file duplication. The main file stays in a designated project. Experimental work happens in copies named with the branch convention: "Design System v2 - Exploratory." When a design direction is approved, changes get applied to the main file with clear documentation of what changed.

Commit messages in Figma branches should describe changes in developer-friendly language. Instead of "Updated button," write "Button: changed primary variant background from blue-500 to blue-600 for WCAG AA contrast ratio on white backgrounds." This specificity helps developers understand the rationale behind changes and implement them correctly."""),
    ]
))

print(f"Written blog 1222-1223")

# Blog 1224
check("accessibility-wcag-complete-developer-guide")
blogs.append(blog_generator.write_blog(
    "WCAG Accessibility: The Complete Developer Guide",
    "accessibility-wcag-complete-developer-guide",
    "2019-04-22",
    "Master web accessibility: WCAG 2.2 guidelines, ARIA patterns, testing tools, and building inclusive interfaces that work for everyone.",
    ["Accessibility", "WCAG", "ARIA", "Frontend"],
    "design",
    [
        ("Why Accessibility Matters",
         """Web accessibility ensures that websites and applications are usable by everyone, including people with disabilities. Over 1 billion people worldwide live with some form of disability. Inaccessible websites exclude these users from accessing information, services, and opportunities. Beyond the moral imperative, accessibility has legal implications: the ADA, Section 508, and the European Accessibility Act all require digital accessibility.

Accessibility also improves the experience for all users. Captions help people in noisy environments. Keyboard navigation helps power users. High contrast helps anyone using a screen in sunlight. Clear structure helps search engines understand your content. These benefits make accessibility a feature that improves your product for everyone, not just people with disabilities.

The Web Content Accessibility Guidelines (WCAG) provide the internationally recognized standard for web accessibility. WCAG 2.2 defines success criteria organized under four principles: Perceivable, Operable, Understandable, and Robust (POUR). Each criterion has a conformance level: A (minimum), AA (recommended), and AAA (enhanced). Most legal requirements and organizational policies target AA conformance."""),
        ("Semantic HTML: The Foundation",
         """Semantic HTML is the single most impactful accessibility improvement you can make. Using the correct HTML elements conveys meaning to assistive technologies without any additional ARIA attributes. A <nav> element tells screen readers this is navigation. A <button> element is focusable and activatable by keyboard. A <table> with <th> and <td> elements conveys data relationships.

```html
<!-- Bad: div soup with no semantic meaning -->
<div class="header">
  <div class="nav">
    <div class="link" onclick="navigate('/')">Home</div>
    <div class="link" onclick="navigate('/about')">About</div>
  </div>
</div>

<!-- Good: semantic HTML with clear structure -->
<header>
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/about">About</a></li>
    </ul>
  </nav>
</header>
```

The semantic version provides keyboard accessibility for free: links are focusable and activatable with Enter. Screen readers announce "navigation, list, two items" giving users a clear mental model. The non-semantic version requires JavaScript for click handling, tabIndex management, and ARIA attributes to achieve the same accessibility. Start with semantic HTML and add ARIA only when the built-in semantics are insufficient."""),
        ("ARIA: When and How to Use It",
         """ARIA (Accessible Rich Internet Applications) attributes supplement HTML semantics when native elements cannot express the full meaning of a component. The first rule of ARIA is: don't use ARIA if a native HTML element provides the semantics you need. A <button> is always better than <div role="button">.

When you do need ARIA, use it correctly. The aria-label attribute provides an accessible name when visible text is insufficient. The aria-describedby attribute links an element to a description. The aria-live attribute announces dynamic content changes. The aria-expanded attribute communicates toggle state. Roles, states, and properties work together to create a complete accessible experience.

```tsx
// React component with proper ARIA
function Disclosure({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = useId();

  return (
    <div>
      <button
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span aria-hidden="true">{isOpen ? '▼' : '▶'}</span>
        {title}
      </button>
      <div
        id={contentId}
        role="region"
        aria-label={title}
        hidden={!isOpen}
      >
        {children}
      </div>
    </div>
  );
}
```

Common ARIA patterns include tabs, accordions, modals, menus, comboboxes, and tree views. The WAI-ARIA Authoring Practices Guide provides the expected keyboard interactions and ARIA attributes for each pattern. Follow these patterns exactly; assistive technology users have learned these conventions and expect consistent behavior."""),
        ("Keyboard Navigation Patterns",
         """Every interactive element must be operable by keyboard alone. This means all functionality available through a mouse must also be available through keyboard. Focus must be visible, logical, and manageable. The Tab key moves focus between interactive elements. Arrow keys navigate within composite widgets like menus, tabs, and toolbars. Enter and Space activate buttons and links. Escape closes modals and menus.

Focus management is critical for single-page applications. When a modal opens, focus must move into the modal. When it closes, focus must return to the triggering element. When content changes due to route navigation, focus should move to the new content's heading or the main content area. Without focus management, keyboard users get lost when the page content changes under them.

```tsx
// Focus trap for modal dialogs
function useFocusTrap(ref, isActive) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const focusable = ref.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    function handleKeyDown(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, ref]);
}
```

Skip navigation links let keyboard users bypass repetitive content. Add a visually hidden link at the top of the page that becomes visible on focus and jumps to the main content area. This saves keyboard users from tabbing through dozens of navigation links on every page."""),
        ("Color Contrast and Visual Design",
         """Color contrast is one of the most common accessibility failures. WCAG requires a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text (AA level). Enhanced contrast (AAA level) requires 7:1 for normal text and 4.5:1 for large text. These ratios ensure text is readable by people with low vision and in various lighting conditions.

Never convey information through color alone. A form field with a red border to indicate an error must also include an icon, text description, or aria-invalid attribute. A chart that uses color to distinguish data series must also use patterns, labels, or tooltips. Color-blindness affects approximately 8% of men and 0.5% of women; they need redundant visual cues.

```css
/* Accessible error state with multiple cues */
.form-field--error {
  border-color: #EF4444;           /* visual cue 1: color */
  border-width: 2px;               /* visual cue 2: thickness */
  background-image: url('alert.svg'); /* visual cue 3: icon */
  background-position: right 12px center;
  background-repeat: no-repeat;
}

.form-field--error::after {
  content: 'Error: ' attr(data-error-msg);
  color: #EF4444;
  font-size: 0.875rem;
  display: block;
  margin-top: 4px;
}
```

Tools like axe DevTools, WAVE, and Lighthouse automatically check color contrast ratios. Integrate these checks into your development workflow: run axe in CI/CD pipelines, add contrast checks to your design review process, and use browser extensions during development."""),
        ("Testing Accessibility",
         """Accessibility testing combines automated tools, manual testing, and assistive technology testing. No single approach catches all issues. Automated tools find about 30-40% of accessibility problems: missing alt text, color contrast failures, missing form labels, and duplicate IDs. Manual testing catches the rest: keyboard traps, focus management issues, screen reader announcement quality, and interaction patterns.

```bash
# Automated testing with axe-core
npm install @axe-core/react axe-playwright

# Playwright accessibility test
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

Manual keyboard testing checklist: Tab through every page verifying logical focus order. Ensure all interactive elements receive visible focus. Test that modals trap focus correctly. Verify skip navigation links work. Check that custom widgets follow expected keyboard patterns. Test with screen magnification at 200% and 400% zoom. Ensure content reflows without horizontal scrolling.

Screen reader testing with NVDA (Windows), VoiceOver (macOS/iOS), or TalkBack (Android) reveals how real users experience your content. Listen to your page without looking at the screen. Are headings meaningful? Do images have descriptive alt text? Do form fields have clear labels? Are live regions announcing updates appropriately? This experience builds empathy and reveals issues that automated tools cannot detect."""),
        ("Accessible Forms and Validation",
         """Forms are the most common source of accessibility issues. Every form input needs an associated label, either through a <label> element with a for attribute matching the input's id, or by wrapping the input in a <label> element. Placeholder text is not a substitute for labels; it disappears when the user starts typing and has insufficient contrast in many browsers.

Error handling must be accessible. When validation errors occur, focus should move to an error summary at the top of the form. Each error should be linked to its corresponding field. The field should have aria-invalid="true" and aria-describedby pointing to the error message. Screen readers announce these attributes so users know exactly which fields need attention.

```html
<form>
  <div class="error-summary" role="alert" tabindex="-1">
    <h2>Please fix 2 errors</h2>
    <ul>
      <li><a href="#email">Email is required</a></li>
      <li><a href="#password">Password must be 8+ characters</a></li>
    </ul>
  </div>

  <div>
    <label for="email">Email address</label>
    <input
      type="email"
      id="email"
      aria-invalid="true"
      aria-describedby="email-error"
      required
    />
    <span id="email-error" class="error" role="alert">
      Email is required
    </span>
  </div>
</form>
```

Inline validation should wait until the user has finished interacting with a field, not trigger on every keystroke. Announce validation results using aria-live regions so screen reader users receive feedback without losing their place in the form."""),
        ("Building an Accessibility Culture",
         """Sustainable accessibility requires organizational commitment, not just individual effort. Start by establishing accessibility standards: define your target WCAG conformance level, create accessible component guidelines, and document testing procedures. Make these standards part of your definition of done so accessibility is not an afterthought.

Train your entire team: designers learn accessible color palettes and focus states, developers learn semantic HTML and ARIA patterns, QA testers learn keyboard and screen reader testing, and product managers learn to include accessibility requirements in user stories. Everyone has a role in accessibility.

Integrate accessibility into your CI/CD pipeline. Run axe-core or pa11y on every pull request. Block merges that introduce accessibility regressions. Use Storybook's accessibility addon for component-level testing. Track accessibility metrics over time: number of violations, conformance level progress, and user-reported issues. Celebrate improvements and address trends promptly."""),
    ]
))

print(f"Written blog 1224")
