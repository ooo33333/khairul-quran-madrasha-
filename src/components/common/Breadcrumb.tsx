import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavigationSection, SubNavigationItem } from '../../types';

interface BreadcrumbProps {
  sectionTitle: string;
  subItemTitle?: string;
  sectionKey?: NavigationSection;
  subItemKey?: SubNavigationItem;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  sectionTitle,
  subItemTitle,
  sectionKey,
  subItemKey,
}) => {
  const { setActiveNav, t } = useApp();

  return (
    <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-3" aria-label="Breadcrumb">
      <button
        onClick={() => setActiveNav('dashboard')}
        className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors font-medium"
      >
        <Home className="h-3.5 w-3.5" />
        <span>{t('Home')}</span>
      </button>

      {sectionTitle && (
        <>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          {subItemTitle ? (
            <button
              onClick={() => sectionKey && setActiveNav(sectionKey, subItemKey)}
              className="text-slate-500 hover:text-slate-900 transition-colors"
            >
              {t(sectionTitle)}
            </button>
          ) : (
            <span className="font-semibold text-slate-800">{t(sectionTitle)}</span>
          )}
        </>
      )}

      {subItemTitle && (
        <>
          <ChevronRight className="h-3 w-3 text-slate-400" />
          <span className="font-semibold text-slate-800">{t(subItemTitle)}</span>
        </>
      )}
    </nav>
  );
};
