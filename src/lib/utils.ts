import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(ms: number): string {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toFixed(2).padStart(5, '0')}`;
  }
  return seconds.toFixed(2);
}

export function formatDistance(cm: number): string {
  const meters = cm / 100;
  return `${meters.toFixed(2)}m`;
}

export function formatHeight(cm: number): string {
  const feet = Math.floor(cm / 30.48);
  const inches = Math.round((cm % 30.48) / 2.54);
  return `${feet}'${inches}"`;
}

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return date.toLocaleDateString();
}

export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    rookie: 'bg-gray-400',
    varsity: 'bg-emerald-500',
    elite: 'bg-blue-500',
    'all-state': 'bg-purple-500',
    national: 'bg-amber-500',
    'world-class': 'bg-red-500',
  };
  return colors[tier] || colors.rookie;
}

export function getTierTextColor(tier: string): string {
  const colors: Record<string, string> = {
    rookie: 'text-gray-600',
    varsity: 'text-emerald-600',
    elite: 'text-blue-600',
    'all-state': 'text-purple-600',
    national: 'text-amber-600',
    'world-class': 'text-red-600',
  };
  return colors[tier] || colors.rookie;
}

export function getRankChangeIndicator(change: number): { icon: string; color: string } {
  if (change > 0) return { icon: '↑', color: 'text-emerald-500' };
  if (change < 0) return { icon: '↓', color: 'text-red-500' };
  return { icon: '-', color: 'text-gray-400' };
}
