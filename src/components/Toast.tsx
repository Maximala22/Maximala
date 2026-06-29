"use client";

type ToastProps = {
  message: string;
  visible: boolean;
};

export default function Toast({ message, visible }: ToastProps) {
  if (!visible || !message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-[calc(158px+env(safe-area-inset-bottom,0px))] left-1/2 z-[60] -translate-x-1/2 whitespace-nowrap rounded-full bg-text px-5 py-2.5 text-sm font-semibold text-white shadow-lift"
    >
      {message}
    </div>
  );
}
