import type { Toast } from '../hooks/useToast'

interface ToasterProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function Toaster({ toasts, onRemove }: ToasterProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[2000] flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-[300px] px-4 py-3 rounded-lg shadow-lg flex items-center justify-between gap-4 animate-in slide-in-from-right ${
            toast.type === 'success'
              ? 'bg-[rgba(76,175,80,0.95)] text-white border border-[#4caf50]'
              : toast.type === 'error'
                ? 'bg-[rgba(244,67,54,0.95)] text-white border border-[#f44336]'
                : 'bg-[rgba(100,108,255,0.95)] text-white border border-[#646cff]'
          }`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}

