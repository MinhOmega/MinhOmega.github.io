#!/usr/bin/env python3
"""Generate 100 frontend blogs (621-720) in two passes to manage file size."""
import sys
import os
sys.path.insert(0, '/home/minhvnq/Desktop/Web/MinhOmega.github.io')
import blog_generator as gen

# Part 1: blogs 621-670 (first 50)
blogs_part1 = [
    ("React useEffect Cleanup and Memory Leak Prevention", "react-useeffect-cleanup-and-memory-leak-prevention", "2019-02-15",
     "Master React useEffect cleanup: prevent memory leaks with proper cleanup functions, AbortController, and subscription patterns.",
     ["React", "Hooks", "JavaScript", "Performance"], "frontend",
     [("Understanding the useEffect Lifecycle", """The useEffect hook is one of React's most powerful and commonly used hooks, but its cleanup mechanism is often misunderstood or completely overlooked. When you return a cleanup function from useEffect, React calls it when the component unmounts or before the effect runs again due to dependency changes. This cleanup phase is critical for preventing memory leaks, canceling network requests, unsubscribing from event listeners, and clearing timers.

Consider a component that subscribes to a WebSocket connection. Without proper cleanup, each time the component re-renders and the effect re-runs, a new WebSocket connection opens while the old one remains active. Over time, this creates dozens or even hundreds of orphaned connections, consuming memory and bandwidth. The cleanup function ensures that only one connection exists at any time.

```jsx
import { useEffect, useState } from 'react';

function useWebSocket(url) {
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const ws = new WebSocket(url);
    
    ws.onmessage = (event) => {
      setMessages(prev => [...prev, JSON.parse(event.data)]);
    };
    
    // Cleanup: close the WebSocket when effect re-runs or component unmounts
    return () => {
      ws.close();
    };
  }, [url]); // Re-run only if url changes
  
  return messages;
}
```

The dependency array plays a crucial role in determining when cleanup runs. If you omit the dependency array entirely, the effect runs after every render, and the cleanup runs before every re-render. If you provide an empty array, the effect runs once after mount, and cleanup runs once on unmount. With specific dependencies, cleanup runs before each re-execution triggered by dependency changes.

Understanding this lifecycle is essential for building robust React applications. A common mistake is forgetting to include all reactive values in the dependency array, which leads to stale closures where the cleanup function references outdated values. The ESLint rule exhaustive-deps helps catch these issues during development."""),
      
      ("AbortController for Fetch Requests", """One of the most common sources of memory leaks in React applications is unmanaged fetch requests. When a user navigates away from a page while a fetch is still in progress, the component unmounts, but the fetch promise continues running. When it resolves, it tries to update state on an unmounted component, leading to the famous "Can't perform a React state update on an unmounted component" warning and potential memory leaks.

The AbortController API provides a clean solution for canceling fetch requests. By creating an AbortController instance and passing its signal to the fetch options, you can abort the request when the component unmounts or when a new request should supersede the previous one.

```jsx
function useFetchData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    setLoading(true);
    setError(null);

    fetch(url, { signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!signal.aborted) {
          setData(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}
```

Notice how we check `signal.aborted` before updating state and filter out `AbortError` from the catch block. This prevents the state-update-on-unmounted-component warning and ensures clean error handling. Modern libraries like Axios and TanStack Query also support AbortController natively.

For more complex scenarios like search-as-you-type, where rapid input changes trigger many requests, AbortController prevents race conditions where an older, slower response overwrites a newer one. Each time the search term changes, the previous request is aborted before a new one begins."""),
      
      ("Event Listener Cleanup Patterns", """Event listeners are another frequent source of memory leaks in React applications. When you add an event listener in useEffect but forget to remove it in the cleanup function, the listener persists even after the component unmounts. This keeps a reference to the component's closure in memory, preventing garbage collection of the entire component tree.

The pattern for safe event listener management always follows the same structure: add the listener in the effect body, and remove it in the cleanup function. The function reference must be identical for both addEventListener and removeEventListener, which means you should define the handler as a named function rather than an inline arrow function.

```jsx
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    
    // Cleanup uses the exact same function reference
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty deps: only run on mount/unmount

  return size;
}
```

For event listeners attached to DOM elements accessed via refs, the pattern is similar but requires the ref to be populated. Use a callback ref or ensure the ref is available before attaching listeners. When dealing with third-party libraries that have their own event subscription APIs, always check the documentation for unsubscribe or destroy methods, and call them in your cleanup function.

Passive event listeners, specified via `{ passive: true }` in the options, improve scroll performance but don't affect cleanup semantics. You still need to remove them in the cleanup function. Some modern React patterns avoid manual event listeners entirely by using event handler props or libraries like @tanstack/react-query that manage subscriptions internally."""),
      
      ("Timer and Interval Cleanup in React", """Timers created with setTimeout and setInterval are among the most overlooked sources of memory leaks. When a component sets up a timer in useEffect without clearing it in the cleanup function, the timer continues firing after the component unmounts. The callback function holds references to the component's closure, preventing garbage collection and potentially causing errors when it tries to update unmounted state.

The cleanup pattern for timers is straightforward: store the timer ID returned by setTimeout or setInterval, and pass it to clearTimeout or clearInterval in the cleanup function. The timer ID is a numeric value that uniquely identifies the timer in the browser's timer queue.

```jsx
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
}
```

The debounce hook above demonstrates a clean pattern: each time `value` or `delay` changes, the previous timer is cleared and a new one is created. This ensures only the last value in a rapid sequence triggers the debounced update. Without cleanup, every keystroke would create a new timer, and all of them would eventually fire, causing a cascade of state updates.

For setInterval, the cleanup is equally important. A common pattern is a polling mechanism that fetches data at regular intervals. The cleanup ensures that when the component unmounts or the polling URL changes, the old interval stops rather than continuing to fire requests to a stale endpoint.

```jsx
function usePolling(url, interval = 5000) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      const res = await fetch(url);
      const json = await res.json();
      if (!cancelled) setData(json);
    }

    fetchData(); // Initial fetch
    const id = setInterval(fetchData, interval);

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [url, interval]);

  return data;
}
```"""),

      ("Subscription Cleanup and Observer Patterns", """Modern web applications frequently subscribe to observable data sources: RxJS streams, Firebase listeners, Supabase realtime channels, Redux stores, and browser APIs like IntersectionObserver and MutationObserver. Each subscription creates a reference from the external source back to your component, and without proper cleanup, these references persist indefinitely.

The universal pattern for managing subscriptions in useEffect follows the subscribe-then-unsubscribe approach. The subscription call returns an unsubscribe function or an object with an unsubscribe method, which you store and call in the cleanup function.

```jsx
function useSupabaseRealtime(table, filter) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const channel = supabase
      .channel(`realtime-${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        (payload) => {
          setRecords(prev => {
            switch (payload.eventType) {
              case 'INSERT':
                return [...prev, payload.new];
              case 'UPDATE':
                return prev.map(r => r.id === payload.new.id ? payload.new : r);
              case 'DELETE':
                return prev.filter(r => r.id !== payload.old.id);
              default:
                return prev;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter]);

  return records;
}
```

IntersectionObserver and MutationObserver follow a similar pattern but use a `disconnect()` method instead of `unsubscribe()`. The key insight is that you should always create the observer inside the effect body and disconnect it in the cleanup function, rather than creating a singleton observer outside the effect.

When working with RxJS subscriptions, the cleanup pattern involves calling `subscription.unsubscribe()` or using the `takeUntil` operator with a destroy subject. The subject-based approach is particularly elegant because you can share a single destroy subject across multiple subscriptions in a component, unsubscribing from all of them simultaneously when the component unmounts."""),

      ("Custom Hooks for Resource Cleanup", """Custom hooks encapsulate resource management logic and ensure consistent cleanup behavior across your application. By abstracting the subscribe-unsubscribe or create-destroy pattern into a reusable hook, you eliminate the risk of forgetting cleanup in individual components and create a single source of truth for resource management.

A well-designed resource hook manages the full lifecycle: initialization, state synchronization, error handling, and cleanup. It handles edge cases like rapid remounting in React Strict Mode, where effects run twice during development, and it gracefully handles errors that occur during cleanup itself.

```jsx
function useAbortableEffect(effectFn, deps) {
  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    async function run() {
      try {
        await effectFn(controller.signal, () => cancelled);
      } catch (err) {
        if (!cancelled && err.name !== 'AbortError') {
          console.error('Effect error:', err);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, deps);
}
```

The pattern of combining a cancellation flag with an AbortController provides defense in depth. The AbortController handles network request cancellation, while the flag handles general cleanup logic that doesn't support abort signals. This dual approach ensures that no side effect persists after unmount regardless of the timing of asynchronous operations.

For complex components with multiple resources, consider creating a composite cleanup hook that manages all resources together. This approach ensures a consistent cleanup order and makes it easy to reason about resource lifecycle. The composite hook can also expose a forceCleanup method for testing purposes, allowing tests to verify that cleanup handles all resources correctly without waiting for component unmount."""),

      ("React Strict Mode and Double Effects", """React 18's Strict Mode intentionally double-invokes effects during development to help developers identify missing cleanup functions. This behavior simulates the effect of a component mounting, unmounting, and remounting in rapid succession, which happens in production during hot reloading, route transitions, and Suspense boundary fallbacks. If your effects don't clean up properly, Strict Mode exposes the issue immediately.

The double-invocation pattern works as follows: React mounts the component, runs all effects, unmounts the component (running all cleanup functions), then immediately remounts and runs all effects again. This means your effect body runs twice and your cleanup runs once between the two executions. If any resource isn't properly cleaned up, you'll see duplicated subscriptions, doubled network requests, or stale state.

```jsx
// This component works correctly in Strict Mode
function useDocumentTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}
```

Without the cleanup that restores the previous title, Strict Mode would set the title, then the cleanup would not run between the two effect executions, and the second execution would set it again. While this specific case is benign, the pattern demonstrates why cleanup matters: in production, if a component remounts due to an error boundary recovery, the cleanup ensures no side effect persists from the previous mount.

To make your effects Strict Mode compatible, always ensure that your effect can be cleanly torn down and re-established. Avoid side effects that cannot be undone, like incrementing a global counter or appending to a persistent array without corresponding decrement or removal in cleanup. If you must perform an irreversible side effect, use a ref to track whether the effect has already been executed and skip the irreversible part on re-execution."""),

      ("Cleanup with React Router Navigation", """When users navigate between routes in a React Router application, components unmount and new ones mount. Any subscriptions, timers, or connections established in useEffect must be cleaned up during unmount, but the timing and behavior can be surprising if you're not careful with dependency arrays and router-specific patterns.

A common issue occurs with data fetching tied to route parameters. When a user navigates from /users/1 to /users/2, the component doesn't unmount and remount—it re-renders with new params. The useEffect dependencies must include the route parameter to trigger cleanup and re-fetch. If the param is missing from the dependency array, the effect runs once and never re-fetches, showing stale data.

```jsx
function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(`/api/users/${userId}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        if (err.name !== 'AbortError') setLoading(false);
      });

    return () => controller.abort();
  }, [userId]); // userId in deps ensures re-fetch on navigation

  if (loading) return <Spinner />;
  return <Profile user={user} />;
}
```

The AbortController cleanup is especially important here because route transitions happen quickly. If a user clicks through several user profiles rapidly, each navigation aborts the previous request, preventing race conditions where an older, slower response overwrites newer data. Without abort, the UI might flash between different users' data as responses arrive out of order.

For WebSocket connections tied to routes, cleanup ensures the connection closes when navigating away. The connection should be established with the route parameter in the dependency array, and the cleanup function should close the socket. This pattern is common in real-time dashboards, chat rooms, and collaborative editing interfaces where each route represents a different room or document."""),
    ]),

    ("CSS Custom Scrollbar Styling Guide", "css-custom-scrollbar-styling-guide", "2019-03-10",
     "Style scrollbars with CSS: WebKit scrollbar pseudo-elements, Firefox scrollbar-width, and cross-browser scrollbar design patterns.",
     ["CSS", "Scrollbar", "UI", "Design"], "frontend",
     [("WebKit Scrollbar Pseudo-Elements", """WebKit-based browsers (Chrome, Safari, Edge) provide a comprehensive set of pseudo-elements for styling scrollbars. The scrollbar itself has three main parts: the track (the background groove), the thumb (the draggable handle), and buttons (the arrow buttons at each end). Each part has corresponding pseudo-elements that accept standard CSS properties like background-color, border-radius, and box-shadow.

The ::-webkit-scrollbar pseudo-element targets the entire scrollbar container. You can set its width and height to control the scrollbar dimensions. The ::-webkit-scrollbar-track targets the track area, ::-webkit-scrollbar-thumb targets the draggable thumb, and ::-webkit-scrollbar-button targets the arrow buttons. For a modern, minimal look, most developers hide the buttons entirely and style only the track and thumb.

```css
/* Custom scrollbar for WebKit browsers */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  transition: background 0.2s ease;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}

::-webkit-scrollbar-corner {
  background: transparent;
}
```

The :horizontal and :vertical pseudo-classes allow you to style horizontal and vertical scrollbars differently. This is useful for scrollable containers that might need a thicker horizontal scrollbar for easier horizontal scrolling, or a thinner vertical scrollbar that doesn't interfere with content layout. You can also use ::-webkit-scrollbar-track-piece to style the portion of the track not covered by the thumb, enabling split-track designs."""),
      
      ("Firefox Scrollbar Styling", """Firefox takes a different approach to scrollbar styling with a more limited but standardized set of properties. The scrollbar-color property sets the colors of the thumb and track respectively, while scrollbar-width accepts three values: auto, thin, and none. Unlike WebKit's pseudo-elements, Firefox doesn't support granular styling of individual scrollbar parts or hover states.

```css
/* Firefox scrollbar styling */
.scrollable-container {
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
  scrollbar-width: thin;
}

/* For a completely hidden scrollbar that still scrolls */
.hidden-scrollbar {
  scrollbar-width: none;
}
```

The scrollbar-width property is particularly useful for creating compact layouts where a full-width scrollbar would waste space. The thin value creates a narrow scrollbar similar to macOS's default thin scrollbar, while none hides the scrollbar entirely while preserving scroll functionality. Users can still scroll via mouse wheel, trackpad gestures, keyboard, and touch.

When building cross-browser scrollbar styles, apply Firefox properties first, then add WebKit pseudo-elements. Browsers ignore properties they don't understand, so this approach works without feature detection. However, the visual appearance will differ between Firefox and WebKit since their styling capabilities aren't identical. For pixel-perfect consistency, consider overlay scrollbars."""),
      
      ("Overlay Scrollbar Techniques", """Overlay scrollbars appear on top of content rather than occupying space in the layout, making them ideal for maximizing content area and achieving a cleaner visual design. Modern operating systems (macOS, iOS, Windows with touchscreen) default to overlay scrollbars that fade in during scrolling and fade out when idle. You can replicate this behavior in CSS and JavaScript for a consistent cross-platform experience.

The overflow: overlay property (now deprecated in favor of overflow: auto with overlay pseudo-element) was once the standard way to create overlay scrollbars. Today, the recommended approach combines overflow: auto with CSS properties that prevent scrollbar layout impact, or uses JavaScript libraries that provide custom overlay scrollbar implementations with advanced features like dynamic sizing and fade animations.

```css
/* Modern overlay scrollbar approach */
.overlay-scrollbar {
  overflow: auto;
  overscroll-behavior: contain;
}

/* Hide default scrollbar while maintaining scrollability */
.overlay-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
  background: transparent;
}

/* Custom overlay scrollbar using pseudo-elements */
.overlay-scrollbar::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 6px;
  height: var(--thumb-height, 30%);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 3px;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.overlay-scrollbar.scrolling::after {
  opacity: 1;
}
```

JavaScript is needed to calculate the thumb height and position based on the scroll ratio and to manage the scrolling class toggle. The thumb height should be proportional to the viewport size relative to the total scroll height, calculated as `(clientHeight / scrollHeight) * clientHeight`. The thumb position follows `(scrollTop / (scrollHeight - clientHeight)) * (clientHeight - thumbHeight)`."""),
      
      ("Scrollbar Design Patterns", """Scrollbar design varies significantly across applications and design systems. Understanding the three main patterns—always visible, auto-hide, and context-aware—helps you choose the right approach for your interface. Each pattern has trade-offs between discoverability, aesthetics, and accessibility.

Always-visible scrollbars are the default on Windows and Linux. They provide clear visual feedback about scroll position and content length, making them the most accessible option. However, they consume layout space and can feel heavy in minimalist designs. The track takes up 15-17 pixels on most systems, which can be significant in narrow sidebars or compact layouts.

```css
/* Design system scrollbar tokens */
:root {
  --scrollbar-size: 8px;
  --scrollbar-track: var(--color-surface-secondary);
  --scrollbar-thumb: var(--color-text-tertiary);
  --scrollbar-thumb-hover: var(--color-text-secondary);
  --scrollbar-thumb-active: var(--color-text-primary);
  --scrollbar-radius: 999px;
  --scrollbar-transition: background-color 0.15s ease;
}

.scrollbar-styled {
  overflow: auto;
}

.scrollbar-styled::-webkit-scrollbar {
  width: var(--scrollbar-size);
  height: var(--scrollbar-size);
}

.scrollbar-styled::-webkit-scrollbar-track {
  background: var(--scrollbar-track);
}

.scrollbar-styled::-webkit-scrollbar-thumb {
  background: var(--scrollbar-thumb);
  border-radius: var(--scrollbar-radius);
  transition: var(--scrollbar-transition);
}

.scrollbar-styled::-webkit-scrollbar-thumb:hover {
  background: var(--scrollbar-thumb-hover);
}
```

Auto-hide scrollbars, common on macOS and mobile, appear only during active scrolling and fade out after a delay. This maximizes content space and creates a cleaner aesthetic but can cause discoverability issues—users might not realize content is scrollable. To mitigate this, ensure sufficient visual cues like content clipping, gradient fade, or scroll indicators.

Context-aware scrollbars adapt their appearance based on the container type. Full-page scrollbars might be always visible and wide, while sidebar scrollbars are thin and auto-hiding, and modal scrollbars match the modal's design tokens. Using CSS custom properties for scrollbar tokens makes it easy to adapt scrollbar styling across different contexts."""),
      
      ("Accessible Scrollbar Design", """Scrollbar accessibility goes beyond visual styling. Users with motor impairments rely on scrollbars as a primary navigation method, and users with low vision need scrollbars that meet contrast ratio requirements. The WCAG guidelines don't prescribe specific scrollbar styles, but the general principles of accessible interactive elements apply: sufficient size for touch/click targets, adequate contrast, and predictable behavior.

The minimum click target size for scrollbars should be at least 24x24 pixels, with 44x44 pixels being the recommended touch target size on mobile. This means your custom scrollbar thumb should be at least 24 pixels wide or tall, depending on orientation. If you're using a thin scrollbar for aesthetic reasons, ensure the scrollable container also supports alternative scroll methods like mouse wheel, trackpad gestures, and keyboard navigation.

```css
/* Accessible scrollbar with adequate touch targets */
@media (pointer: coarse) {
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-thumb {
    min-height: 44px;
    background: rgba(0, 0, 0, 0.3);
  }
}

/* High contrast mode adjustments */
@media (forced-colors: active) {
  ::-webkit-scrollbar-thumb {
    background: ButtonText;
  }

  ::-webkit-scrollbar-track {
    background: ButtonFace;
  }
}
```

The prefers-reduced-motion media query should also influence scrollbar behavior. If a user has requested reduced motion, avoid smooth scrolling animations and transition effects on scrollbar elements. Instead, use instant scroll behavior and static scrollbar appearances.

```css
@media (prefers-reduced-motion: reduce) {
  .scrollable-container {
    scroll-behavior: auto;
  }

  ::-webkit-scrollbar-thumb {
    transition: none;
  }
}
```

Always ensure that scrollable containers are keyboard-accessible. Users should be able to tab into a scrollable container and use arrow keys, Page Up/Down, Home, and End to navigate. Setting tabindex="0" on scrollable divs makes them focusable, and CSS :focus-visible styles should provide clear visual feedback."""),
    ]),

    ("JavaScript Optional Chaining and Nullish Coalescing", "javascript-optional-chaining-and-nullish-coalescing", "2019-04-05",
     "Master optional chaining ?. and nullish coalescing ??. Safe property access, function calls, and default values in JavaScript.",
     ["JavaScript", "ES2020", "Syntax", "TypeScript"], "frontend",
     [("Optional Chaining Basics", """Optional chaining (?.) is a JavaScript operator introduced in ES2020 that simplifies accessing deeply nested object properties without worrying about null or undefined intermediate values. Before optional chaining, developers relied on verbose conditional checks, logical AND short-circuiting, or libraries like Lodash's _.get() to safely navigate object hierarchies.

The operator works by short-circuiting the entire chain when it encounters a nullish value (null or undefined). Instead of throwing a TypeError, it returns undefined. This behavior makes it ideal for accessing API response data, configuration objects, and any data structure where the shape isn't guaranteed.

```javascript
// Before optional chaining
const streetName = user && user.address && user.address.street && user.address.street.name;

// With optional chaining
const streetName = user?.address?.street?.name;

// Also works with bracket notation
const value = obj?.['dynamic-key']?.nested;

// Optional chaining with function calls
const result = someObj?.method?.();

// Optional chaining with array access
const firstItem = arr?.[0]?.name;
```

Optional chaining works with three main access patterns: property access (obj?.prop), computed property access (obj?.[expr]), and function calls (obj?.method()). Each pattern short-circuits independently, so `obj?.method?.()` checks both that obj exists and that obj.method is callable before invoking it.

A common mistake is overusing optional chaining where it's not needed. If you know that a particular intermediate value will always exist (because it's defined by your own code, not an external API), don't chain through it. Excessive optional chaining can mask bugs by silently returning undefined instead of throwing errors that would reveal structural problems in your data."""),
      
      ("Nullish Coalescing Default Values", """The nullish coalescing operator (??) provides a clean way to specify default values that only apply when the left operand is null or undefined. Unlike the logical OR operator (||), which treats all falsy values (0, '', false, NaN, null, undefined) as triggers for the default, ?? only triggers on null and undefined. This distinction is critical when 0, empty string, or false are valid values that should not be replaced with defaults.

```javascript
// Using || — problematic for falsy values
const count = userInput || 10;  // 0 becomes 10!

// Using ?? — only null/undefined trigger default
const count = userInput ?? 10;  // 0 stays as 0

// Practical example: API pagination
const page = params.page ?? 1;
const limit = params.limit ?? 20;
const offset = params.offset ?? 0;

// Configuration with meaningful falsy values
const config = {
  debug: false,       // explicitly false, not undefined
  timeout: 0,         // 0 means no timeout
  retries: 0,         // 0 means no retries
  prefix: '',         // empty string is valid
};

const debug = config.debug ?? true;       // false, not true
const timeout = config.timeout ?? 5000;   // 0, not 5000
const prefix = config.prefix ?? 'app';   // '', not 'app'
```

The combination of optional chaining and nullish coalescing creates a powerful pattern for safely accessing nested properties with fallback values: `user?.settings?.theme ?? 'light'`. This reads as "get the user's theme setting, defaulting to 'light' if any part of the chain is missing."

Nullish coalescing cannot be directly combined with logical operators like || and && in the same expression without explicit parentheses. JavaScript requires parentheses to disambiguate: `a ?? b || c` is a syntax error, but `(a ?? b) || c` and `a ?? (b || c)` are valid. This restriction prevents confusion about operator precedence."""),
      
      ("Optional Chaining with TypeScript", """TypeScript has deep integration with optional chaining, using it to narrow types and provide better inference. When you use optional chaining in TypeScript, the type system automatically narrows the result to exclude the nullish branch of the type. If the left operand has type T | null | undefined, the result of ?. has type T | undefined (note: always undefined, never null, because the operator returns undefined for both null and undefined inputs).

```typescript
interface User {
  name: string;
  address?: {
    street: string;
    city: string;
    geo?: {
      lat: number;
      lng: number;
    };
  };
  getProfile?: () => Profile;
}

function displayLocation(user: User): string {
  // Type: string | undefined (because address might be undefined)
  const city = user.address?.city;

  // Type: number | undefined (geo might be undefined too)
  const lat = user.address?.geo?.lat;

  // Type: Profile | undefined (getProfile might be undefined)
  const profile = user.getProfile?.();

  // Combine with nullish coalescing for guaranteed string
  return city ?? 'Unknown city';
}
```

TypeScript also provides the non-null assertion operator (!) which removes null and undefined from a type. However, optional chaining is generally preferred because it handles the runtime case gracefully instead of asserting at compile time. The non-null assertion is appropriate when you have external knowledge that a value is never null, but optional chaining is safer when dealing with potentially missing data.

In strict TypeScript configurations (strictNullChecks: true), optional chaining becomes essential for type-safe code. Without it, you'd need explicit type guards or discriminated unions to access potentially undefined properties, which adds boilerplate. Optional chaining combined with nullish coalescing provides concise, type-safe access patterns that reduce the need for explicit type narrowing."""),
      
      ("Optional Chaining Performance Considerations", """While optional chaining dramatically improves code readability, understanding its performance characteristics helps you make informed decisions about where to use it. The ?. operator compiles to conditional checks in the JavaScript engine, which are extremely fast on modern V8, SpiderMonkey, and JavaScriptCore engines. The performance difference between optional chaining and manual null checks is negligible in virtually all real-world applications.

The compiled output of optional chaining is straightforward. `a?.b` compiles to something equivalent to `a == null ? undefined : a.b`, and `a?.b?.c` compiles to nested checks. Modern JavaScript engines optimize these patterns at the bytecode level, often producing the same or better machine code than hand-written conditional checks.

```javascript
// What optional chaining compiles to (simplified)
const streetName = user?.address?.street?.name;

// Roughly equivalent to:
const streetName =
  user == null ? undefined :
  user.address == null ? undefined :
  user.address.street == null ? undefined :
  user.address.street.name;
```

One area where optional chaining can cause subtle issues is in conjunction with assignment. You cannot use optional chaining on the left side of an assignment: `obj?.prop = value` is a syntax error. This is by design because the semantics of conditional assignment are ambiguous—should the assignment be skipped if the object is null, or should it throw? If you need conditional assignment, use explicit null checks.

For extremely hot code paths (called millions of times in tight loops), benchmark optional chaining against manual checks. In practice, the readability benefits far outweigh any microperformance differences. The engine's branch predictor handles these simple null checks efficiently, and the JIT compiler often eliminates them entirely when type information is available."""),
    ]),

    ("React Performance Profiler and Optimization", "react-performance-profiler-and-optimization", "2019-05-01",
     "Use React Profiler to identify performance bottlenecks: measuring render times, detecting unnecessary re-renders, and applying targeted optimizations.",
     ["React", "Performance", "DevTools", "Optimization"], "frontend",
     [("React DevTools Profiler", """The React DevTools Profiler is the primary tool for identifying performance bottlenecks in React applications. Unlike general-purpose browser performance tools, the Profiler understands React's component tree and rendering model, providing insights specific to how React updates the DOM. It records every render cycle, showing which components re-rendered, why they re-rendered, and how long each render took.

To use the Profiler, open React DevTools in your browser, switch to the Profiler tab, click the record button, perform the interaction you want to analyze, and stop recording. The flame graph view shows the component tree as a timeline, where wider bars indicate longer render times. The ranked chart view sorts components by render duration, making it easy to find the most expensive renders.

```jsx
// Wrap components with Profiler for programmatic measurements
import { Profiler } from 'react';

function onRenderCallback(
  id,           // The "id" of the Profiler tree
  phase,        // "mount" or "update"
  actualDuration, // Time spent rendering the committed update
  baseDuration,   // Estimated time to render without memoization
  startTime,      // When React began rendering this update
  commitTime,     // When React committed this update
) {
  if (actualDuration > 16) { // Longer than one frame (60fps)
    console.warn(`Slow render: ${id} took ${actualDuration.toFixed(2)}ms`);
  }
}

function App() {
  return (
    <Profiler id="App" onRender={onRenderCallback}>
      <Header />
      <Profiler id="Main" onRender={onRenderCallback}>
        <Dashboard />
      </Profiler>
      <Footer />
    </Profiler>
  );
}
```

The Profiler's "why did this render?" feature is particularly valuable. When you select a component in the profiler recording, it shows the exact reason for re-rendering: state change, prop change, parent re-render, or context change. This information guides your optimization efforts—if a component re-renders because its parent re-renders but its props haven't changed, memoization (React.memo) can help. If it re-renders because a context value changed, you might need to split the context."""),
      
      ("React.memo and Memoization", """React.memo is a higher-order component that memoizes the rendered output of a functional component. It performs a shallow comparison of the component's props before re-rendering, skipping the render entirely if all props are referentially equal. This is most effective for components that receive complex props from frequently re-rendering parents but rarely actually need to update.

```jsx
const ExpensiveList = React.memo(function ExpensiveList({ items, onItemClick }) {
  console.log('ExpensiveList rendered');
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} onClick={() => onItemClick(item.id)}>
          {item.name}: {item.value}
        </li>
      ))}
    </ul>
  );
});

// Custom comparison function for complex props
const UserCard = React.memo(function UserCard({ user, theme }) {
  return (
    <div className={`card ${theme}`}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if name or email changed, ignore other user fields
  return (
    prevProps.user.name === nextProps.user.name &&
    prevProps.user.email === nextProps.user.email &&
    prevProps.theme === nextProps.theme
  );
});
```

React.memo's shallow comparison means that new object references trigger re-renders even if the object's contents are identical. This is why inline objects and arrow functions in JSX often defeat memoization: `{style={{ color: 'red' }}` creates a new object on every render, and `{onClick={() => handleClick(id)}` creates a new function reference.

To get the most from React.memo, combine it with useMemo for object/array props and useCallback for function props. But be careful not to memoize everything indiscriminately—memoization has overhead (the comparison itself and memory for cached values), and it only helps when the component actually re-renders unnecessarily. Profile first, then optimize."""),
      
      ("useMemo and useCallback Best Practices", """useMemo and useCallback are React hooks that cache computed values and function references between renders. useMemo caches the result of an expensive computation, recomputing only when dependencies change. useCallback caches a function reference, which is essentially useMemo for functions. Both hooks serve one primary purpose in optimization: preventing unnecessary re-renders of child components and avoiding expensive recalculations.

```jsx
function Dashboard({ users, filters }) {
  // useMemo: avoid recalculating on every render
  const filteredUsers = useMemo(() => {
    console.log('Filtering users...');
    return users.filter(user => {
      return (
        user.age >= filters.minAge &&
        user.role === filters.role &&
        user.active === filters.active
      );
    });
  }, [users, filters]);

  // useCallback: stable function reference for child components
  const handleUserClick = useCallback((userId) => {
    navigate(`/users/${userId}`);
  }, [navigate]);

  // useMemo for expensive derived data
  const stats = useMemo(() => {
    return {
      total: filteredUsers.length,
      active: filteredUsers.filter(u => u.active).length,
      avgAge: filteredUsers.reduce((sum, u) => sum + u.age, 0) / filteredUsers.length,
    };
  }, [filteredUsers]);

  return (
    <div>
      <Stats data={stats} />
      <UserList users={filteredUsers} onUserClick={handleUserClick} />
    </div>
  );
}
```

A common anti-pattern is wrapping every value and function in useMemo/useCallback "just in case." These hooks have their own cost: they allocate memory for the cached value, compute the dependency comparison on every render, and add cognitive overhead. For simple computations (string concatenation, basic arithmetic, creating small objects), the computation itself is cheaper than the memoization overhead.

Use useMemo when the computation is genuinely expensive (sorting large arrays, complex filtering, generating derived data structures) or when the result is passed to a memoized child component. Use useCallback when passing functions to memoized children or as dependencies to other hooks. Don't use either for values that are cheap to compute and aren't passed to memoized components."""),
      
      ("Virtualization for Large Lists", """Rendering thousands of DOM elements simultaneously causes severe performance degradation. Each DOM node consumes memory, layout calculations become expensive, and the browser must composite and paint all elements even if most are off-screen. Virtualization solves this by rendering only the items currently visible in the viewport, recycling DOM nodes as the user scrolls.

The most popular virtualization libraries are react-window and its successor react-virtuoso. react-window provides FixedSizeList for uniform item heights and VariableSizeList for variable heights. react-virtuoso offers automatic height measurement, grouped items, and more flexible layouts.

```jsx
import { FixedSizeList } from 'react-window';

function VirtualizedList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style} className="list-row">
      <div className="row-content">
        <h4>{items[index].name}</h4>
        <p>{items[index].description}</p>
      </div>
    </div>
  );

  return (
    <FixedSizeList
      height={600}        // Viewport height
      itemCount={items.length}
      itemSize={72}        // Row height in pixels
      width="100%"
      overscanCount={5}    // Extra items to render above/below viewport
    >
      {Row}
    </FixedSizeList>
  );
}
```

The overscanCount property controls how many extra items are rendered above and below the visible area. A higher overscan reduces the chance of seeing blank areas during fast scrolling but increases memory usage and initial render time. For most applications, 5-10 overscan items provide a good balance.

Variable-height virtualization is more complex because the library needs to know or estimate each item's height before rendering. react-window's VariableSizeList requires you to provide an itemSize function that returns the height for each index. For truly dynamic content where heights aren't known in advance, react-virtuoso measures items after rendering and adjusts the scroll position accordingly."""),
      
      ("Bundle Size and Code Splitting", """Bundle size directly impacts initial load performance. A large JavaScript bundle takes longer to download, parse, and execute, delaying the time to interactive (TTI). Code splitting breaks your application into smaller chunks loaded on demand, reducing the initial payload. React supports code splitting through React.lazy and dynamic imports, while build tools like webpack, Vite, and Turbopack handle the chunk creation.

React.lazy enables component-level code splitting with a clean API. It takes a function that returns a dynamic import() and returns a component that loads the imported module on first render. Combined with Suspense, you can show a loading indicator while the chunk loads.

```jsx
import { lazy, Suspense } from 'react';

// Route-level code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

Beyond route-level splitting, you can split at the component level for heavy components like rich text editors, chart libraries, and code editors. The key is identifying which components are large (use bundle analyzer tools like webpack-bundle-analyzer or source-map-explorer) and which are rarely used on initial load.

Prefetching improves the perceived performance of lazy-loaded chunks. By adding a prefetch hint when the user is likely to navigate to a lazy route (hovering over a link, completing a form step), you can load the chunk in the background before the navigation occurs. Libraries like @loadable/component provide built-in prefetch support, or you can use the native link rel="prefetch" tag."""),
    ]),

    ("CSS Grid Layout Complete Tutorial", "css-grid-layout-complete-tutorial", "2019-08-05",
     "Master CSS Grid: grid-template, placement, auto-flow, subgrid, and responsive grid patterns for modern web layouts.",
     ["CSS", "Grid", "Layout", "Responsive Design"], "frontend",
     [("Grid Fundamentals and Terminology", """CSS Grid Layout is a two-dimensional layout system that revolutionized how we build web layouts. Unlike Flexbox, which works in one dimension at a time (either row or column), Grid handles both dimensions simultaneously, making it ideal for page-level layouts, card grids, dashboards, and any design that requires precise alignment across rows and columns.

A Grid container establishes a grid formatting context for its children. You define the grid structure on the container using properties like grid-template-columns, grid-template-rows, and grid-template-areas. Children of the grid container become grid items that you can place explicitly using grid-column and grid-grid-row, or let the browser place them automatically according to the grid's flow rules.

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: 20px;
  min-height: 100vh;
}

/* Grid items automatically fill cells left-to-right, top-to-bottom */
.grid-item {
  padding: 1rem;
  background: var(--color-surface);
  border-radius: 8px;
}

/* Explicit placement */
.grid-header {
  grid-column: 1 / -1; /* Span all columns */
}

.grid-sidebar {
  grid-row: 2 / 3; /* Specific row */
}

.grid-footer {
  grid-column: 1 / -1;
}
```

The fr unit is Grid's fractional unit, representing a fraction of the available space in the grid container. `1fr 2fr 1fr` divides the space into four parts, giving the middle column twice the space of the side columns. The fr unit distributes remaining space after fixed-size tracks (px, em, rem) are allocated, making it ideal for responsive layouts without media queries."""),
      
      ("Named Grid Areas", """Grid template areas provide a visual, declarative way to define layouts that reads like ASCII art. You name grid areas using the grid-template-areas property, then assign items to those areas with the grid-area property. This approach makes complex layouts self-documenting and easy to modify—you can see the entire layout structure at a glance in the CSS.

```css
.dashboard-layout {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "sidebar main    aside"
    "footer  footer  footer";
  grid-template-columns: 250px 1fr 300px;
  grid-template-rows: 64px 1fr 48px;
  min-height: 100vh;
  gap: 0;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.aside   { grid-area: aside; }
.footer  { grid-area: footer; }

/* Responsive: stack vertically on mobile */
@media (max-width: 768px) {
  .dashboard-layout {
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "aside"
      "footer";
    grid-template-columns: 1fr;
    grid-template-rows: 64px 1fr auto auto 48px;
  }
}
```

Named areas make responsive redesign trivial. You simply redefine the grid-template-areas for each breakpoint, reassigning named areas to different positions. Items automatically move to their new positions, and the browser handles the reflow. This is far cleaner than toggling display properties or using absolute positioning for layout changes.

Empty cells in the grid area template are represented by a period (.). You can use multiple periods to represent empty cells: `". header ."` creates a header that only spans the middle column. Named areas must form rectangles—you can't create L-shaped or T-shaped areas. If you need non-rectangular placement, use explicit line-based positioning instead."""),
      
      ("Auto-Placement and Implicit Grids", """Grid auto-placement is a powerful feature that automatically positions items in the grid without explicit row or column assignments. The grid-auto-flow property controls the placement algorithm: row fills items left-to-right, wrapping to new rows; column fills top-to-bottom, wrapping to new columns; dense backfills gaps left by larger items.

```css
.photo-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  grid-auto-flow: dense;
  gap: 8px;
}

/* Featured photos span multiple cells */
.photo-featured {
  grid-column: span 2;
  grid-row: span 2;
}

.photo-wide {
  grid-column: span 2;
}

.photo-tall {
  grid-row: span 2;
}
```

The dense packing algorithm is particularly useful for photo galleries and masonry-like layouts. Without dense, a wide item at the end of a row creates a gap in the next row because the algorithm won't move smaller items backward to fill it. With dense, the algorithm scans forward and backward, placing items in any available gap that fits them. This creates a tighter layout but can change the visual order from the DOM order, which may affect accessibility.

Implicit rows and columns are created when items are placed outside the explicitly defined grid. The grid-auto-rows and grid-auto-columns properties control the size of these implicit tracks. Setting `grid-auto-rows: min-content` makes implicit rows as tall as their content, while `grid-auto-rows: 1fr` distributes remaining space equally among implicit rows."""),
      
      ("Responsive Grid Patterns", """CSS Grid excels at responsive layouts without media queries, thanks to functions like minmax(), repeat() with auto-fill and auto-fit, and the min() and max() functions. These tools create fluid grids that adapt to available space automatically, reducing the need for breakpoint-based responsive design.

The auto-fill keyword creates as many columns as fit in the container, leaving empty tracks if there's extra space. auto-fit is similar but collapses empty tracks to zero width, causing items to stretch and fill the available space.

```css
/* auto-fill: maintains minimum column count */
.grid-auto-fill {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

/* auto-fit: items stretch to fill space */
.grid-auto-fit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

/* Combining Grid with clamp for fluid sizing */
.fluid-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(250px, 100%), 1fr)
  );
  gap: clamp(1rem, 2vw, 2rem);
}
```

The min() function in `minmax(min(250px, 100%), 1fr)` prevents overflow on very narrow screens by ensuring the minimum column width never exceeds the container width. This eliminates the horizontal scrollbar that can occur when minmax's minimum value is larger than the viewport.

Container queries take responsive grids further by making the grid responsive to the container's width rather than the viewport's. This enables truly reusable grid components that adapt to their context—a card grid in a wide main content area shows more columns than the same grid in a narrow sidebar, without any parent-level CSS coordination."""),
    ]),

    ("TypeScript Strict Mode Configuration Guide", "typescript-strict-mode-configuration-guide", "2019-08-25",
     "Configure TypeScript strict mode: all strict flags explained, migration strategies, and incremental adoption patterns for existing projects.",
     ["TypeScript", "Configuration", "Type Safety", "Best Practices"], "frontend",
     [("Understanding Strict Mode Flags", """TypeScript's strict mode is a compilation flag that enables a suite of type-checking behaviors designed to catch common errors at compile time rather than runtime. When you set `strict: true` in your tsconfig.json, it activates several individual flags that collectively make the type system more rigorous and your code more reliable.

The strict flag enables the following individual checks: strictNullChecks (null and undefined are not assignable to other types), strictFunctionTypes (function parameter types are checked contravariantly), strictBindCallApply (bind, call, and apply have correct types), strictPropertyInitialization (class properties must be initialized in constructor), noImplicitAny (disallow implicit any types), noImplicitThis (flag implicit this expressions with any type), and alwaysStrict (emit "use strict" in JS output).

```json
{
  "compilerOptions": {
    "strict": true,
    // Equivalent to enabling all of these:
    // "strictNullChecks": true,
    // "strictFunctionTypes": true,
    // "strictBindCallApply": true,
    // "strictPropertyInitialization": true,
    // "noImplicitAny": true,
    // "noImplicitThis": true,
    // "alwaysStrict": true
  }
}
```

strictNullChecks is arguably the most impactful individual flag. Without it, null and undefined are assignable to every type, meaning the type system cannot prevent null reference errors—the most common category of runtime crashes in JavaScript. With strictNullChecks enabled, you must explicitly handle the possibility of null or undefined at every point where it could occur, using optional chaining, nullish coalescing, or explicit null checks.

strictFunctionTypes changes how function parameters are checked. Without it, TypeScript uses covariant parameter checking (less strict), which allows a function accepting a supertype to be assigned where a function accepting a subtype is expected. With strict mode, parameters are checked contravariantly (more strict), which is mathematically correct and prevents subtle type unsafety in callback-heavy code."""),
      
      ("Migrating to Strict Mode", """Migrating an existing codebase to strict mode can be daunting—the initial error count often reaches into the hundreds or thousands. The key to a successful migration is incremental adoption: enable strict flags one at a time, fix all errors for that flag, then move to the next. This approach keeps the codebase in a working state throughout the migration and makes each change set reviewable.

Start with noImplicitAny, as it catches the most common source of type errors: parameters and variables without type annotations that TypeScript infers as any. An any type silently disables all type checking for that value, so fixing implicit any is the highest-leverage strict mode change.

```typescript
// Before: implicit any
function processUser(user) {  // Error: Parameter 'user' implicitly has an 'any' type
  return user.name.toUpperCase();
}

// After: explicit type
interface User {
  name: string;
  email: string;
}

function processUser(user: User) {
  return user.name.toUpperCase();
}

// For cases where the type is truly unknown
function processInput(input: unknown) {
  if (typeof input === 'string') {
    return input.toUpperCase();
  }
  throw new Error('Expected string input');
}
```

Next, enable strictNullChecks. This is the most disruptive change because it requires every function that can return null or undefined to have a return type that includes null | undefined, and every variable that might be null to be checked before use. The migration typically involves adding null checks, optional chaining, and non-null assertions (sparingly) throughout the codebase.

For large codebases, use TypeScript's `// @ts-expect-error` directive to suppress strict mode errors temporarily, then create a tracking issue to fix them over time. Unlike `// @ts-ignore`, @ts-expect-error will produce an error when the suppression is no longer needed, ensuring you clean up all suppressions eventually. Prioritize fixing errors in critical code paths first, then work through the remaining suppressions in subsequent PRs."""),
      
      ("Strict Property Initialization", """The strictPropertyInitialization flag requires all class properties to be definitely assigned in the constructor. This prevents a common bug where a class method accesses a property that hasn't been initialized yet, resulting in undefined when the code expects a concrete value. TypeScript analyzes all code paths through the constructor to verify that every property receives a value.

```typescript
class UserService {
  private db: Database;          // Error: Property 'db' has no initializer
  private logger: Logger;        // Error: Property 'logger' has no initializer
  private cache: Map<string, User>;

  constructor(config: Config) {
    this.cache = new Map();      // OK: initialized in constructor
    // db and logger not initialized!
  }
}
```

There are several ways to handle this. The most straightforward is to initialize all properties in the constructor. For dependency injection patterns where properties are set externally, use the definite assignment assertion (!) to tell TypeScript that the property will be assigned before it's accessed.

```typescript
class UserService {
  private db!: Database;         // Definite assignment assertion
  private logger!: Logger;
  private cache: Map<string, User>;

  constructor(config: Config) {
    this.cache = new Map();
  }

  // Called by dependency injection framework before any method
  initialize(db: Database, logger: Logger) {
    this.db = db;
    this.logger = logger;
  }
}
```

The definite assignment assertion (!) is a compile-time directive only—it generates no JavaScript code and performs no runtime checks. Use it sparingly and only when you're certain the property will be initialized through external means (dependency injection, lifecycle hooks, or factory patterns). Overuse of ! defeats the purpose of strict property initialization by disabling the safety check.

For properties that have sensible defaults, initialize them inline. For optional properties, use the optional modifier (?). For lazy-initialized properties, use getter patterns that throw if the property hasn't been set, providing a clear error message instead of a cryptic undefined access error."""),
    ]),
]

# Write first batch
print(f"Writing batch 1 ({len(blogs_part1)} blogs)...")
for title, slug, date, desc, tags, category, sections in blogs_part1:
    gen.write_blog(title, slug, date, desc, tags, category, sections)
print(f"Batch 1 done. Total blogs: {len(os.listdir(gen.DIR))}")
