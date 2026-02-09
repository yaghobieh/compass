import { useMemo, useCallback } from 'react';
import { useRouter } from './CompassContext';
import type { RouteConfig, RouteSearchResult } from '../../types';

type UseRouteSearchReturn = {
  searchRoutes: (query: string) => RouteSearchResult[];
  allRoutes: RouteConfig[];
  flatRoutes: RouteConfig[];
};

const flattenRoutes = (routes: RouteConfig[], parentPath = ''): RouteConfig[] => {
  return routes.reduce<RouteConfig[]>((acc, route) => {
    const fullPath = parentPath + route.path;
    acc.push({ ...route, path: fullPath });
    
    if (route.children) {
      acc.push(...flattenRoutes(route.children, fullPath));
    }
    
    return acc;
  }, []);
};

const fuzzyMatch = (text: string, query: string): { score: number; matches: string[] } => {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  const matches: string[] = [];
  let score = 0;

  if (textLower === queryLower) {
    return { score: 100, matches: [text] };
  }

  if (textLower.includes(queryLower)) {
    score = 80;
    matches.push(text);
  }

  if (textLower.startsWith(queryLower)) {
    score = 90;
    matches.push(text);
  }

  const words = textLower.split(/[\s\-_\/]+/);
  for (const word of words) {
    if (word.startsWith(queryLower)) {
      score = Math.max(score, 70);
      matches.push(word);
    }
  }

  let queryIndex = 0;
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }

  if (queryIndex === queryLower.length) {
    score = Math.max(score, 50);
  }

  return { score, matches };
};

export const useRouteSearch = (): UseRouteSearchReturn => {
  const router = useRouter();

  const allRoutes = useMemo(() => router.getRoutes(), [router]);

  const flatRoutes = useMemo(() => flattenRoutes(allRoutes), [allRoutes]);

  const searchRoutes = useCallback(
    (query: string): RouteSearchResult[] => {
      if (!query.trim()) {
        return flatRoutes.map((route) => ({
          route,
          score: 0,
          matches: [],
        }));
      }

      const results: RouteSearchResult[] = [];

      for (const route of flatRoutes) {
        const pathMatch = fuzzyMatch(route.path, query);
        const nameMatch = route.name ? fuzzyMatch(route.name, query) : { score: 0, matches: [] };
        const titleMatch = route.meta?.title
          ? fuzzyMatch(route.meta.title, query)
          : { score: 0, matches: [] };

        const bestScore = Math.max(pathMatch.score, nameMatch.score, titleMatch.score);

        if (bestScore > 0) {
          results.push({
            route,
            score: bestScore,
            matches: [...new Set([...pathMatch.matches, ...nameMatch.matches, ...titleMatch.matches])],
          });
        }
      }

      return results.sort((a, b) => b.score - a.score);
    },
    [flatRoutes]
  );

  return {
    searchRoutes,
    allRoutes,
    flatRoutes,
  };
};

export const CommandPalette = ({
  isOpen,
  onClose: _onClose,
  onSelect: _onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (route: RouteConfig) => void;
}) => {
  if (!isOpen) return null;
  return null;
};

