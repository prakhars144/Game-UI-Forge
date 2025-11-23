import React, { useEffect, useRef } from 'react';
import { AppState } from '../types';
import { drawButton, drawHealthBar, drawPanel, drawCrosshair, drawSlot, drawBadge, drawSlider } from '../utils/drawUtils';
import { Download, Grid, Moon, Sun, Monitor } from 'lucide-react';

interface PreviewProps {
  state: AppState;
}

export const Preview: React.FC<PreviewProps> = ({ state }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgPattern, setBgPattern] = React.useState<'dark' | 'light' | 'grid'>('grid');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get specific config based on tool
    const config = state[state.tool] as any;
    
    // Add padding
    const pad = 20; 
    canvas.width = config.width + pad * 2;
    canvas.height = config.height + pad * 2;

    // Drawing Logic based on tool
    switch(state.tool) {
        case 'button':
            drawButton(ctx, state.button);
            break;
        case 'healthbar':
            drawHealthBar(ctx, state.healthbar);
            break;
        case 'panel':
            drawPanel(ctx, state.panel);
            break;
        case 'crosshair':
            drawCrosshair(ctx, state.crosshair);
            break;
        case 'slot':
            drawSlot(ctx, state.slot);
            break;
        case 'badge':
            drawBadge(ctx, state.badge);
            break;
        case 'slider':
            drawSlider(ctx, state.slider);
            break;
    }

  }, [state]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    // Useful naming for export
    const mode = (state[state.tool] as any).drawMode || 'full';
    link.download = `gameui_${state.tool}_${mode}_${Date.now()}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const getBgClass = () => {
      switch(bgPattern) {
          case 'dark': return 'bg-slate-900';
          case 'light': return 'bg-slate-200';
          case 'grid': return 'bg-grid-pattern'; 
          default: return 'bg-slate-800';
      }
  };

  return (
    <div className="flex-1 flex flex-col h-[55vh] md:h-screen overflow-hidden bg-slate-950 relative">
        {/* Toolbar */}
        <div className="h-14 border-b border-slate-800 flex items-center justify-between px-3 md:px-6 bg-slate-900 shadow-md z-20 shrink-0">
            <div className="flex items-center gap-2 overflow-hidden">
                 <Monitor className="text-brand-500 shrink-0" size={20} />
                 <h1 className="font-pixel text-slate-200 text-xs md:text-sm tracking-widest truncate">UI FORGE <span className="hidden sm:inline text-xs text-slate-500 font-sans normal-case ml-2 opacity-50">Offline Generator</span></h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4 shrink-0">
                <div className="flex bg-slate-800 rounded p-1 border border-slate-700">
                    <button onClick={() => setBgPattern('grid')} className={`p-1.5 rounded transition-colors ${bgPattern==='grid' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`} title="Grid"><Grid size={16}/></button>
                    <button onClick={() => setBgPattern('dark')} className={`p-1.5 rounded transition-colors ${bgPattern==='dark' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`} title="Dark"><Moon size={16}/></button>
                    <button onClick={() => setBgPattern('light')} className={`p-1.5 rounded transition-colors ${bgPattern==='light' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`} title="Light"><Sun size={16}/></button>
                </div>
                <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-3 py-1.5 md:px-4 md:py-2 rounded text-xs md:text-sm font-bold transition-all shadow-lg shadow-brand-900/20 active:translate-y-0.5"
                >
                    <Download size={16} className="md:w-[18px] md:h-[18px]" />
                    <span className="hidden sm:inline">Download</span>
                </button>
            </div>
        </div>

        {/* Workspace */}
        <div ref={containerRef} className={`flex-1 flex items-center justify-center overflow-auto p-4 md:p-8 ${getBgClass()} relative`}>
            {/* Checkerboard background for transparency simulation if grid */}
            {bgPattern === 'grid' && (
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{
                         backgroundImage: `linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)`,
                         backgroundSize: '20px 20px',
                         backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                     }}
                />
            )}
            
            <div className="relative group max-w-full max-h-full flex items-center justify-center">
                 <div className="absolute -inset-4 bg-slate-800/50 rounded-lg -z-10 opacity-0 group-hover:opacity-100 transition-opacity border border-slate-700/50 pointer-events-none" />
                 {/* The actual canvas */}
                 <canvas ref={canvasRef} className="max-w-full max-h-full drop-shadow-2xl object-contain" />
                 
                 {/* Dimensions Label */}
                 <div className="absolute -top-8 left-0 text-[10px] text-slate-500 font-mono bg-slate-900/80 px-2 py-0.5 rounded border border-slate-700">
                     {(state[state.tool] as any).width}px × {(state[state.tool] as any).height}px
                 </div>
            </div>
        </div>
    </div>
  );
};