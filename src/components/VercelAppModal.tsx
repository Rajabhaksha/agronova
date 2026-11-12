import React from "react";
import { X, ExternalLink, Globe } from "lucide-react";

interface VercelAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelAppModal: React.FC<VercelAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const vercelUrl = "https://agrinova-indol.vercel.app/";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
            <div>
              <div className="text-xs font-semibold text-white">AgriNova Production App</div>
              <div className="text-[11px] font-mono text-emerald-400 truncate max-w-sm">
                {vercelUrl}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={vercelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Iframe */}
        <div className="flex-1 bg-stone-950 relative">
          <iframe
            src={vercelUrl}
            title="AgriNova Production App"
            className="w-full h-full border-0 bg-stone-900"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
          />
        </div>

        {/* Modal Footer Note */}
        <div className="px-5 py-2.5 bg-stone-950 border-t border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
          <span>Supporting 500 farmers · 200 active transactions · Vercel deployment</span>
          <span className="font-mono text-stone-400">React.js + MySQL Platform</span>
        </div>
      </div>
    </div>
  );
};
