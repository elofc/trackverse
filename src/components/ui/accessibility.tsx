"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Accessibility preferences context
type AccessibilityPreferences = {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: "normal" | "large" | "xlarge";
  screenReaderMode: boolean;
};

type AccessibilityContextType = {
  preferences: AccessibilityPreferences;
  setPreferences: (prefs: Partial<AccessibilityPreferences>) => void;
  announceToScreenReader: (message: string, priority?: "polite" | "assertive") => void;
};

const defaultPreferences: AccessibilityPreferences = {
  reducedMotion: false,
  highContrast: false,
  fontSize: "normal",
  screenReaderMode: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferencesState] = useState<AccessibilityPreferences>(defaultPreferences);
  const [announcement, setAnnouncement] = useState<{ message: string; priority: "polite" | "assertive" } | null>(null);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("accessibility-preferences");
    if (saved) {
      try {
        setPreferencesState({ ...defaultPreferences, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to load accessibility preferences");
      }
    }

    // Check system preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setPreferencesState((prev) => ({ ...prev, reducedMotion: true }));
    }

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => {
      setPreferencesState((prev) => ({ ...prev, reducedMotion: e.matches }));
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Save preferences to localStorage
  const setPreferences = (prefs: Partial<AccessibilityPreferences>) => {
    setPreferencesState((prev) => {
      const updated = { ...prev, ...prefs };
      localStorage.setItem("accessibility-preferences", JSON.stringify(updated));
      return updated;
    });
  };

  // Announce to screen reader
  const announceToScreenReader = (message: string, priority: "polite" | "assertive" = "polite") => {
    setAnnouncement({ message, priority });
    // Clear after announcement
    setTimeout(() => setAnnouncement(null), 1000);
  };

  // Apply font size to document
  useEffect(() => {
    const root = document.documentElement;
    switch (preferences.fontSize) {
      case "large":
        root.style.fontSize = "18px";
        break;
      case "xlarge":
        root.style.fontSize = "20px";
        break;
      default:
        root.style.fontSize = "16px";
    }
  }, [preferences.fontSize]);

  // Apply high contrast mode
  useEffect(() => {
    if (preferences.highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [preferences.highContrast]);

  return (
    <AccessibilityContext.Provider value={{ preferences, setPreferences, announceToScreenReader }}>
      {children}
      
      {/* Screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement?.priority === "polite" && announcement.message}
      </div>
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement?.priority === "assertive" && announcement.message}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
}

// Skip to main content link
export function SkipToMain() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-orange-500 focus:text-white focus:rounded-lg focus:outline-none"
    >
      Skip to main content
    </a>
  );
}

// Keyboard navigation hook
export function useKeyboardNavigation(
  items: HTMLElement[] | null,
  options: {
    loop?: boolean;
    orientation?: "horizontal" | "vertical" | "both";
    onSelect?: (index: number) => void;
  } = {}
) {
  const { loop = true, orientation = "vertical", onSelect } = options;
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length === 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const isVertical = orientation === "vertical" || orientation === "both";
      const isHorizontal = orientation === "horizontal" || orientation === "both";

      let newIndex = focusedIndex;

      if ((e.key === "ArrowDown" && isVertical) || (e.key === "ArrowRight" && isHorizontal)) {
        e.preventDefault();
        newIndex = focusedIndex + 1;
        if (newIndex >= items.length) {
          newIndex = loop ? 0 : items.length - 1;
        }
      } else if ((e.key === "ArrowUp" && isVertical) || (e.key === "ArrowLeft" && isHorizontal)) {
        e.preventDefault();
        newIndex = focusedIndex - 1;
        if (newIndex < 0) {
          newIndex = loop ? items.length - 1 : 0;
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        newIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        newIndex = items.length - 1;
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect?.(focusedIndex);
        return;
      }

      if (newIndex !== focusedIndex) {
        setFocusedIndex(newIndex);
        items[newIndex]?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [items, focusedIndex, loop, orientation, onSelect]);

  return { focusedIndex, setFocusedIndex };
}

// Focus trap for modals
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstElement?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [containerRef, isActive]);
}

// Visually hidden but accessible to screen readers
export function VisuallyHidden({ children }: { children: ReactNode }) {
  return <span className="sr-only">{children}</span>;
}

// Accessible icon button
type IconButtonProps = {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
};

export function IconButton({ icon, label, onClick, className, disabled }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={className}
    >
      {icon}
    </button>
  );
}

// Accessible progress bar
type ProgressBarProps = {
  value: number;
  max?: number;
  label: string;
  className?: string;
  showValue?: boolean;
};

export function AccessibleProgressBar({
  value,
  max = 100,
  label,
  className,
  showValue = false,
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100);

  return (
    <div className={className}>
      <div className="flex justify-between mb-1">
        <span className="text-sm text-zinc-400">{label}</span>
        {showValue && <span className="text-sm text-white">{percentage}%</span>}
      </div>
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        className="h-2 bg-zinc-800 rounded-full overflow-hidden"
      >
        <div
          className="h-full bg-orange-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Accessible toggle switch
type ToggleSwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  disabled?: boolean;
};

export function AccessibleToggle({
  checked,
  onChange,
  label,
  description,
  disabled,
}: ToggleSwitchProps) {
  const id = `toggle-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="flex items-center justify-between">
      <div>
        <label htmlFor={id} className="text-white font-medium cursor-pointer">
          {label}
        </label>
        {description && <p className="text-zinc-500 text-sm">{description}</p>}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative w-11 h-6 rounded-full transition-colors
          ${checked ? "bg-orange-500" : "bg-zinc-700"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        <span
          className={`
            absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform
            ${checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}

// Accessibility settings panel
export function AccessibilitySettings() {
  const { preferences, setPreferences } = useAccessibility();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Accessibility</h2>

      <div className="space-y-4">
        <AccessibleToggle
          checked={preferences.reducedMotion}
          onChange={(checked) => setPreferences({ reducedMotion: checked })}
          label="Reduce Motion"
          description="Minimize animations and transitions"
        />

        <AccessibleToggle
          checked={preferences.highContrast}
          onChange={(checked) => setPreferences({ highContrast: checked })}
          label="High Contrast"
          description="Increase color contrast for better visibility"
        />

        <AccessibleToggle
          checked={preferences.screenReaderMode}
          onChange={(checked) => setPreferences({ screenReaderMode: checked })}
          label="Screen Reader Mode"
          description="Optimize for screen reader usage"
        />

        <div>
          <label className="text-white font-medium block mb-2">Font Size</label>
          <div className="flex gap-2">
            {(["normal", "large", "xlarge"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setPreferences({ fontSize: size })}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors
                  ${preferences.fontSize === size
                    ? "bg-orange-500 text-white"
                    : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }
                `}
              >
                {size === "normal" ? "A" : size === "large" ? "A+" : "A++"}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
