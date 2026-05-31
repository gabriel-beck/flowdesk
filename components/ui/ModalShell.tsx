"use client";

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
}

export function ModalShell({ isOpen, onClose, children, maxWidth = "max-w-lg" }: ModalShellProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
      />

      {/* Desktop — centered modal */}
      <div
        className={`hidden md:flex fixed inset-0 z-50 items-center justify-center p-4`}
        onClick={onClose}
      >
        <div
          className={`w-full ${maxWidth} rounded-2xl flex flex-col overflow-hidden`}
          style={{
            background: "var(--fd-bg-surface)",
            border: "1px solid var(--fd-border)",
            maxHeight: "85vh",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>
      </div>

      {/* Mobile — bottom sheet */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col rounded-t-2xl overflow-hidden"
        style={{
          background: "var(--fd-bg-surface)",
          border: "1px solid var(--fd-border)",
          maxHeight: "92vh",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background: "var(--fd-border-strong)" }} />
        </div>
        {children}
      </div>
    </>
  );
}
