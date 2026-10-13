import { useState } from 'react';
import { Sliders, Sparkles, Droplets, Table, Wrench, X } from 'lucide-react';
import { RiceMatrixTool } from './interactive/RiceMatrixTool';
import { PromptLabTool } from './interactive/PromptLabTool';
import { VisionThresholdTool } from './interactive/VisionThresholdTool';
import { IrrigationDecisionTool } from './interactive/IrrigationDecisionTool';
import { sound } from '../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ToolsSandboxModal({ isOpen, onClose }: Props) {
  const [activeTool, setActiveTool] = useState<'rice' | 'prompt' | 'vision' | 'irrigation'>('prompt');

  if (!isOpen) return null;

  const tools = [
    { id: 'prompt', name: 'Agri-Prompt Studio', icon: Sparkles, desc: 'A/B test system prompts & chemical guardrails' },
    { id: 'vision', name: 'Crop Vision Thresholds', icon: Sliders, desc: 'Balance False Positives vs False Negatives' },
    { id: 'irrigation', name: 'Multi-Sensor Irrigation', icon: Droplets, desc: 'Prescriptive IoT soil & weather telemetry' },
    { id: 'rice', name: 'RICE Backlog Matrix', icon: Table, desc: 'Prioritize features before seasonal rains' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col text-stone-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif text-stone-100">
                Agri-Tech Interactive Tools Sandbox
              </h2>
              <p className="text-xs text-stone-400">Freely experiment with the product and AI simulation engines</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-stone-400 hover:text-stone-200 hover:bg-stone-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool Switcher Tabs */}
        <div className="px-5 pt-3 border-b border-stone-800 bg-stone-950 flex items-center gap-2 overflow-x-auto">
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  sound.playClick();
                  setActiveTool(t.id as typeof activeTool);
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-emerald-500 text-emerald-300 bg-emerald-950/30 rounded-t-lg'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t.name}</span>
              </button>
            );
          })}
        </div>

        {/* Tool Playground Content */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1">
          {activeTool === 'prompt' && <PromptLabTool />}
          {activeTool === 'vision' && <VisionThresholdTool />}
          {activeTool === 'irrigation' && <IrrigationDecisionTool />}
          {activeTool === 'rice' && <RiceMatrixTool />}
        </div>
      </div>
    </div>
  );
}
