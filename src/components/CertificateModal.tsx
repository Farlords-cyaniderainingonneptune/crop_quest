import { Award, CheckCircle, Download, Printer, X } from 'lucide-react';
import { UserProgress } from '../types';
import { sound } from '../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
}

export function CertificateModal({ isOpen, onClose, progress }: Props) {
  if (!isOpen) return null;

  const capstone = progress.capstone;
  const issueDate = capstone?.completedAt
    ? new Date(capstone.completedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto text-stone-200 shadow-2xl p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-stone-800">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Award className="w-4 h-4" /> OFFICIAL CROPQUEST CREDENTIAL
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 text-stone-400 hover:text-stone-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Printable Certificate Frame */}
        <div className="p-8 md:p-12 rounded-xl bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-2 border-amber-600/60 shadow-2xl relative text-center space-y-6">
          <div className="space-y-1">
            <div className="text-xs uppercase font-mono tracking-widest text-amber-400">
              CropQuest: AI & Agri Project Lab
            </div>
            <h1 className="text-2xl md:text-4xl font-bold font-serif text-amber-200 tracking-tight">
              Certificate of Mastery
            </h1>
            <p className="text-xs text-stone-400 italic">
              AI-Enabled Agricultural Product Management & Field Deployment
            </p>
          </div>

          <div className="py-2">
            <span className="text-xs text-stone-400 uppercase tracking-widest font-mono block mb-1">
              This is proudly conferred upon
            </span>
            <div className="text-2xl md:text-3xl font-serif font-bold text-white border-b border-stone-700 pb-2 inline-block min-w-[280px]">
              {progress.learnerName}
            </div>
          </div>

          <p className="text-xs md:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            For successfully completing all rigorous missions in project and product management, farmer empathy, precision AI prompt engineering, computer vision pest monitoring, multi-sensor telemetry, and designing the approved field venture:
          </p>

          <div className="p-3 bg-stone-950/80 border border-amber-600/30 rounded-xl max-w-lg mx-auto">
            <span className="text-[11px] font-mono text-emerald-400 uppercase block">Certified Capstone Venture</span>
            <h3 className="text-base md:text-lg font-bold text-amber-300 font-serif">
              {capstone?.projectName || 'CassavaShield AI'}
            </h3>
            <span className="text-xs text-stone-400">
              {capstone?.regionAndCrop || 'Smallholder Agriculture Initiative'} · Evaluation Score: {capstone?.score || 95}/100
            </span>
          </div>

          <div className="pt-6 border-t border-stone-800 grid grid-cols-2 gap-6 text-xs text-stone-400 max-w-md mx-auto">
            <div>
              <span className="font-mono block text-[10px] text-stone-500 uppercase">Issue Date</span>
              <span className="text-stone-200 font-medium">{issueDate}</span>
            </div>
            <div>
              <span className="font-mono block text-[10px] text-stone-500 uppercase">Verification ID</span>
              <span className="font-mono text-stone-200">CQ-{progress.learnerName.substring(0, 3).toUpperCase()}-2026-X8</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-stone-400">
            Share this milestone on LinkedIn or with agricultural development programs.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
            >
              <Printer className="w-4 h-4" /> Print / Save PDF
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
