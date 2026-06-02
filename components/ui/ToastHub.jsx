

import { CheckCircle, AlertTriangle } from "lucide-react";

const ToastHub = ({ toasts }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`shadow-xl rounded-xl p-4 flex items-center gap-3 pointer-events-auto transition-all animate-fade-in text-white ${
            toast.type === "success"
              ? "bg-[#198754]"
              : toast.type === "warning"
              ? "bg-[#dc3545]"
              : ""
          }`}
          style={!toast.type || toast.type === "info" ? { background: "var(--color-primary)" } : {}}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 shrink-0" />
          )}
          <p className="text-sm font-medium">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};

export default ToastHub;
