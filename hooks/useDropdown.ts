"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface UseDropdownReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  ref: React.RefObject<HTMLDivElement | null>;
}

export function useDropdown(): UseDropdownReturn {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  useEffect(() => {
    if (!isOpen) return;

    function handler(e: MouseEvent | KeyboardEvent) {
      if (e instanceof KeyboardEvent) {
        if (e.key === "Escape") close();
        return;
      }
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    }

    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handler);
    };
  }, [isOpen, close]);

  return { isOpen, open, close, toggle, ref };
}
