import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pagesConfig } from '@/pages.config';
import { useAuth } from '@/lib/AuthContext';

export default function NavigationTracker() {
  const location = useLocation();
  const { Pages, mainPage } = pagesConfig;
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    try {
      const path = location.pathname.replace('/', '');
      const pageName =
        path && Pages[path]
          ? path
          : mainPage ?? Object.keys(Pages)[0];

      // Tracking intentionally disabled (Base44 removed)
      // This hook now exists only to avoid breaking imports
      if (isAuthenticated && pageName) {
        // no-op
      }
    } catch (err) {
      // Never block rendering
      console.warn('NavigationTracker disabled:', err);
    }
  }, [location, isAuthenticated, Pages, mainPage]);

  return null;
}
