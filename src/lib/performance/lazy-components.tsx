"use client";

import dynamic from "next/dynamic";
import { ComponentType, ReactNode, useState, useEffect, useRef } from "react";
import { Skeleton, ChartSkeleton, TableSkeleton } from "@/components/ui/skeleton";

// Loading fallback components
function ChartLoading() {
  return <ChartSkeleton height={300} />;
}

function TableLoading() {
  return <TableSkeleton rows={5} cols={4} />;
}

function CardLoading() {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-pulse">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

// Lazy load heavy analytics components
export const LazyPerformanceChart = dynamic(
  () => import("@/components/analytics/performance-chart").then((mod) => mod.PerformanceChart),
  {
    loading: ChartLoading,
    ssr: false,
  }
);

export const LazyTrainingLoadChart = dynamic(
  () => import("@/components/analytics/training-load").then((mod) => mod.TrainingLoadChart),
  {
    loading: ChartLoading,
    ssr: false,
  }
);

export const LazyInjuryRiskGauge = dynamic(
  () => import("@/components/analytics/injury-risk").then((mod) => mod.InjuryRiskCard),
  {
    loading: CardLoading,
    ssr: false,
  }
);

export const LazyPeerComparison = dynamic(
  () => import("@/components/analytics/peer-comparison").then((mod) => mod.PeerComparisonCard),
  {
    loading: ChartLoading,
    ssr: false,
  }
);

export const LazyTeamAnalytics = dynamic(
  () => import("@/components/analytics/team-analytics").then((mod) => mod.TeamAnalyticsDashboard),
  {
    loading: () => (
      <div className="space-y-4">
        <ChartLoading />
        <TableLoading />
      </div>
    ),
    ssr: false,
  }
);

// Note: Video, Recruiting, and Gamification lazy loaders can be added
// when those component modules are created with default exports

// Lazy load integration components
export const LazyIntegrationList = dynamic(
  () => import("@/components/integrations/integration-card").then((mod) => mod.IntegrationList),
  {
    loading: () => (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <CardLoading key={i} />
        ))}
      </div>
    ),
    ssr: false,
  }
);

// Generic lazy loader with custom fallback
export function createLazyComponent<T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T } | T>,
  LoadingComponent: ComponentType = CardLoading
) {
  return dynamic(
    () => importFn().then((mod) => ("default" in mod ? mod.default : mod)),
    {
      loading: () => <LoadingComponent />,
      ssr: false,
    }
  );
}

// Intersection Observer based lazy loading
type LazyLoadProps = {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
};

export function LazyLoad({
  children,
  fallback = <CardLoading />,
  rootMargin = "100px",
  threshold = 0.1,
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return <div ref={ref}>{isVisible ? children : fallback}</div>;
}

