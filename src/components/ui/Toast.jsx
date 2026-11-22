import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useApp } from '../../store/AppContext';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
};

function Toast({ toast }) {
  const { actions } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => actions.removeToast(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id]);

  return (
    <div className={`toast toast-${toast.type}`}>
      {icons[toast.type] || icons.info}
      <span className="toast-message">{toast.message}</span>
      <button onClick={() => actions.removeToast(toast.id)} className="toast-close">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { state } = useApp();
  if (!state.toasts.length) return null;

  return (
    <div className="toast-container">
      {state.toasts.map(t => <Toast key={t.id} toast={t} />)}
    </div>
  );
}
