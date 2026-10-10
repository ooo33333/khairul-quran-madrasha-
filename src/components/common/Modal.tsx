import React, { useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isDestructive?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'lg',
  isDestructive = false,
}) => {
  const { t } = useApp();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Container */}
      <div className="relative z-10 flex min-h-full items-center justify-center p-4 text-center pointer-events-none">
        <div
          className={`relative w-full ${maxWidthClass} pointer-events-auto transform overflow-hidden rounded-xl bg-white text-left align-middle shadow-2xl transition-all border border-slate-200`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              {isDestructive && (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                </div>
              )}
              <div>
                <h3 className="text-base font-semibold text-slate-900">{t(title)}</h3>
                {subtitle && <p className="text-xs text-slate-500 mt-0.5">{t(subtitle)}</p>}
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-6 py-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
