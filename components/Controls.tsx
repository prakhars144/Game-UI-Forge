import React from 'react';
import { AppState, ToolType } from '../types';

interface ControlsProps {
  state: AppState;
  updateConfig: (key: string, value: any) => void;
  setTool: (t: ToolType) => void;
}

const ControlSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="mb-6 border-b border-slate-700 pb-4 last:border-0">
    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">{title}</h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const InputGroup = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs text-slate-400">{label}</label>
    {children}
  </div>
);

const TextInput = ({ value, onChange, type = "text" }: { value: string | number, onChange: (v: string) => void, type?: string }) => (
  <input 
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="bg-slate-850 border border-slate-700 rounded px-2 py-1.5 text-sm text-white focus:border-brand-500 focus:outline-none w-full"
  />
);

const ColorInput = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
  <div className="flex items-center gap-2">
    <input 
      type="color" 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="h-8 w-8 bg-transparent cursor-pointer rounded overflow-hidden flex-shrink-0" 
    />
    <TextInput value={value} onChange={onChange} />
  </div>
);

const RangeInput = ({ value, onChange, min, max, step = 1 }: { value: number, onChange: (v: number) => void, min: number, max: number, step?: number }) => (
    <div className="flex items-center gap-2">
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step}
            value={value} 
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="flex-1 h-4 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500 touch-pan-x"
        />
        <span className="text-xs text-slate-300 w-8 text-right">{value}</span>
    </div>
);

const SelectInput = ({ value, onChange, options }: { value: string, onChange: (v: string) => void, options: string[] }) => (
    <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="bg-slate-850 border border-slate-700 rounded px-2 py-1.5 text-sm text-white focus:border-brand-500 focus:outline-none w-full capitalize"
    >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
);

const Checkbox = ({ checked, onChange, label }: { checked: boolean, onChange: (v: boolean) => void, label: string }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none py-1">
        <input 
            type="checkbox" 
            checked={checked} 
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-brand-600 bg-slate-700 border-slate-600 rounded focus:ring-brand-500 focus:ring-2" 
        />
        <span className="text-sm text-slate-300">{label}</span>
    </label>
);

export const Controls: React.FC<ControlsProps> = ({ state, updateConfig, setTool }) => {
  const tool = state.tool;
  const config = state[tool] as any;

  // Helper to create type-safe updaters
  const update = (key: string, val: any) => updateConfig(key, val);

  const renderToolSpecifics = () => {
    switch(tool) {
      case 'button':
        return (
          <>
            <ControlSection title="Style">
                <InputGroup label="Preset">
                    <SelectInput value={config.style} options={['flat', 'glossy', 'pixel', 'cyber', 'neomorphism']} onChange={(v) => update('style', v)} />
                </InputGroup>
                <Checkbox label="Show Text" checked={config.showText} onChange={(v) => update('showText', v)} />
            </ControlSection>
            {config.showText && (
                <ControlSection title="Typography">
                    <InputGroup label="Text">
                        <TextInput value={config.text} onChange={(v) => update('text', v)} />
                    </InputGroup>
                    <InputGroup label="Font">
                        <SelectInput value={config.fontFamily} options={['sans', 'pixel']} onChange={(v) => update('fontFamily', v)} />
                    </InputGroup>
                    <InputGroup label="Size">
                        <RangeInput value={config.fontSize} min={10} max={60} onChange={(v) => update('fontSize', v)} />
                    </InputGroup>
                    <InputGroup label="Weight">
                        <SelectInput value={config.fontWeight} options={['normal', 'bold']} onChange={(v) => update('fontWeight', v)} />
                    </InputGroup>
                    <InputGroup label="Color">
                        <ColorInput value={config.textColor} onChange={(v) => update('textColor', v)} />
                    </InputGroup>
                </ControlSection>
            )}
            <ControlSection title="Appearance">
                <InputGroup label="Background Color">
                    <ColorInput value={config.bgColor} onChange={(v) => update('bgColor', v)} />
                </InputGroup>
                <InputGroup label="Border Color">
                    <ColorInput value={config.borderColor} onChange={(v) => update('borderColor', v)} />
                </InputGroup>
                <InputGroup label="Border Width">
                    <RangeInput value={config.borderWidth} min={0} max={10} onChange={(v) => update('borderWidth', v)} />
                </InputGroup>
                <InputGroup label="Border Radius">
                    <RangeInput value={config.borderRadius} min={0} max={50} onChange={(v) => update('borderRadius', v)} />
                </InputGroup>
                <InputGroup label="Shadow Blur">
                    <RangeInput value={config.shadowBlur} min={0} max={50} onChange={(v) => update('shadowBlur', v)} />
                </InputGroup>
            </ControlSection>
          </>
        );
      case 'healthbar':
        return (
            <>
              <ControlSection title="Engine Export">
                  <InputGroup label="Draw Mode">
                      <SelectInput value={config.drawMode} options={['full', 'frame', 'fill']} onChange={(v) => update('drawMode', v)} />
                  </InputGroup>
                  <p className="text-[10px] text-slate-500 italic">Select 'Frame' or 'Fill' to download parts separately for game engines.</p>
              </ControlSection>
              <ControlSection title="Shape & Style">
                  <InputGroup label="Shape">
                      <SelectInput value={config.shape} options={['rect', 'round', 'chamfer', 'slash']} onChange={(v) => update('shape', v)} />
                  </InputGroup>
                  <InputGroup label="Percentage (Preview)">
                      <RangeInput value={config.value} min={0} max={100} onChange={(v) => update('value', v)} />
                  </InputGroup>
                  <Checkbox label="Show Text Overlay" checked={config.showText} onChange={(v) => update('showText', v)} />
              </ControlSection>
              <ControlSection title="Colors">
                  <InputGroup label="Background (Frame)">
                      <ColorInput value={config.bgColor} onChange={(v) => update('bgColor', v)} />
                  </InputGroup>
                  <InputGroup label="Fill Start">
                      <ColorInput value={config.fillColorStart} onChange={(v) => update('fillColorStart', v)} />
                  </InputGroup>
                  <InputGroup label="Fill End">
                      <ColorInput value={config.fillColorEnd} onChange={(v) => update('fillColorEnd', v)} />
                  </InputGroup>
                  <InputGroup label="Border">
                      <ColorInput value={config.borderColor} onChange={(v) => update('borderColor', v)} />
                  </InputGroup>
              </ControlSection>
              <ControlSection title="Details">
                  <InputGroup label="Noise Texture">
                      <RangeInput value={config.noise} min={0} max={0.5} step={0.01} onChange={(v) => update('noise', v)} />
                  </InputGroup>
                  <InputGroup label="Segments">
                      <RangeInput value={config.segments} min={0} max={20} onChange={(v) => update('segments', v)} />
                  </InputGroup>
                  <InputGroup label="Segment Gap">
                      <RangeInput value={config.segmentGap} min={1} max={10} onChange={(v) => update('segmentGap', v)} />
                  </InputGroup>
              </ControlSection>
            </>
        );
      case 'panel':
        return (
            <>
              <ControlSection title="Structure">
                  <InputGroup label="Style">
                      <SelectInput value={config.style} options={['solid', 'double', 'ridge', 'tech', 'window']} onChange={(v) => update('style', v)} />
                  </InputGroup>
                  <InputGroup label="Pattern">
                      <SelectInput value={config.pattern} options={['none', 'grid', 'dots', 'scanlines']} onChange={(v) => update('pattern', v)} />
                  </InputGroup>
                  {config.style === 'window' && (
                      <InputGroup label="Header Height">
                          <RangeInput value={config.headerHeight} min={20} max={80} onChange={(v) => update('headerHeight', v)} />
                      </InputGroup>
                  )}
              </ControlSection>
              <ControlSection title="Colors">
                  <InputGroup label="Background">
                      <ColorInput value={config.bgColor} onChange={(v) => update('bgColor', v)} />
                  </InputGroup>
                  <InputGroup label="Opacity">
                      <RangeInput value={config.bgOpacity} min={0} max={1} step={0.1} onChange={(v) => update('bgOpacity', v)} />
                  </InputGroup>
                  <InputGroup label="Border Color">
                      <ColorInput value={config.borderColor} onChange={(v) => update('borderColor', v)} />
                  </InputGroup>
              </ControlSection>
              <ControlSection title="Effects">
                  <Checkbox label="Outer Glow" checked={config.glow} onChange={(v) => update('glow', v)} />
                  <InputGroup label="Corner Radius">
                      <RangeInput value={config.borderRadius} min={0} max={50} onChange={(v) => update('borderRadius', v)} />
                  </InputGroup>
              </ControlSection>
            </>
        );
      case 'crosshair':
        return (
            <>
              <ControlSection title="Design">
                  <InputGroup label="Type">
                      <SelectInput value={config.type} options={['cross', 'dot', 'circle', 't-shape', 'chevron', 'sniper']} onChange={(v) => update('type', v)} />
                  </InputGroup>
                  <InputGroup label="Color">
                      <ColorInput value={config.color} onChange={(v) => update('color', v)} />
                  </InputGroup>
                  <InputGroup label="Thickness">
                      <RangeInput value={config.thickness} min={1} max={10} onChange={(v) => update('thickness', v)} />
                  </InputGroup>
              </ControlSection>
              <ControlSection title="Outline">
                   <InputGroup label="Width">
                      <RangeInput value={config.outlineWidth} min={0} max={5} onChange={(v) => update('outlineWidth', v)} />
                   </InputGroup>
                   <InputGroup label="Color">
                      <ColorInput value={config.outlineColor} onChange={(v) => update('outlineColor', v)} />
                   </InputGroup>
                   <Checkbox label="Shadow" checked={config.shadow} onChange={(v) => update('shadow', v)} />
              </ControlSection>
            </>
        );
      case 'slot':
        return (
            <>
              <ControlSection title="Style">
                  <SelectInput value={config.style} options={['simple', 'mmo', 'scifi']} onChange={(v) => update('style', v)} />
              </ControlSection>
              <ControlSection title="Rarity">
                  <SelectInput value={config.rarityColor} options={['none', '#ffffff', '#22c55e', '#3b82f6', '#a855f7', '#eab308']} onChange={(v) => update('rarityColor', v)} />
              </ControlSection>
              <ControlSection title="Content">
                  <Checkbox label="Show Hotkey" checked={config.showHotkey} onChange={(v) => update('showHotkey', v)} />
                  {config.showHotkey && (
                      <TextInput value={config.hotkeyText} onChange={(v) => update('hotkeyText', v)} />
                  )}
              </ControlSection>
            </>
        );
      case 'badge':
        return (
            <>
              <ControlSection title="Design">
                  <InputGroup label="Shape">
                      <SelectInput value={config.shape} options={['shield', 'circle', 'hexagon', 'diamond', 'star']} onChange={(v) => update('shape', v)} />
                  </InputGroup>
                  <Checkbox label="Ribbon" checked={config.ribbon} onChange={(v) => update('ribbon', v)} />
              </ControlSection>
              <ControlSection title="Colors">
                  <InputGroup label="Primary">
                      <ColorInput value={config.primaryColor} onChange={(v) => update('primaryColor', v)} />
                  </InputGroup>
                  <InputGroup label="Secondary">
                      <ColorInput value={config.secondaryColor} onChange={(v) => update('secondaryColor', v)} />
                  </InputGroup>
                  <InputGroup label="Border">
                      <ColorInput value={config.borderColor} onChange={(v) => update('borderColor', v)} />
                  </InputGroup>
              </ControlSection>
              <ControlSection title="Text">
                  <TextInput value={config.iconText} onChange={(v) => update('iconText', v)} />
              </ControlSection>
            </>
        );
      case 'slider':
        return (
          <>
            <ControlSection title="Export Mode">
                 <SelectInput value={config.drawMode} options={['combined', 'track', 'thumb']} onChange={(v) => update('drawMode', v)} />
                 <p className="text-[10px] text-slate-500 italic">Select 'Track' or 'Thumb' to export parts separately.</p>
            </ControlSection>
            <ControlSection title="Layout">
                <InputGroup label="Orientation">
                    <SelectInput value={config.type} options={['horizontal', 'vertical']} onChange={(v) => update('type', v)} />
                </InputGroup>
                <InputGroup label="Value (Preview)">
                    <RangeInput value={config.value} min={0} max={100} onChange={(v) => update('value', v)} />
                </InputGroup>
            </ControlSection>
            <ControlSection title="Track">
                <InputGroup label="Color">
                    <ColorInput value={config.trackColor} onChange={(v) => update('trackColor', v)} />
                </InputGroup>
                <InputGroup label="Fill Color">
                    <ColorInput value={config.fillColor} onChange={(v) => update('fillColor', v)} />
                </InputGroup>
                <InputGroup label="Border Width">
                    <RangeInput value={config.trackBorderWidth} min={0} max={5} onChange={(v) => update('trackBorderWidth', v)} />
                </InputGroup>
                <InputGroup label="Radius">
                    <RangeInput value={config.trackRadius} min={0} max={20} onChange={(v) => update('trackRadius', v)} />
                </InputGroup>
            </ControlSection>
            <ControlSection title="Thumb">
                <InputGroup label="Shape">
                    <SelectInput value={config.thumbShape} options={['circle', 'rect', 'pill', 'diamond']} onChange={(v) => update('thumbShape', v)} />
                </InputGroup>
                <InputGroup label="Size">
                    <RangeInput value={config.thumbSize} min={10} max={50} onChange={(v) => update('thumbSize', v)} />
                </InputGroup>
                <InputGroup label="Color">
                    <ColorInput value={config.thumbColor} onChange={(v) => update('thumbColor', v)} />
                </InputGroup>
            </ControlSection>
          </>
        )
      default:
        return null;
    }
  };

  return (
    <div className="w-full md:w-80 bg-slate-900 border-t border-r-0 md:border-t-0 md:border-r border-slate-700 h-[45vh] md:h-screen flex flex-col font-sans z-10 relative shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-xl">
      {/* Tool Selector */}
      <div className="p-4 border-b border-slate-700 shrink-0 overflow-x-auto scrollbar-hide">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block sticky left-0">Select Element</label>
        <div className="flex md:grid md:grid-cols-4 gap-2 pb-1 md:pb-0 min-w-max md:min-w-0">
            {['healthbar', 'button', 'panel', 'slider', 'crosshair', 'slot', 'badge'].map((t) => (
                <button 
                    key={t}
                    onClick={() => setTool(t as ToolType)}
                    className={`text-[10px] p-2 rounded border truncate transition-all active:scale-95 ${state.tool === t ? 'bg-brand-600 border-brand-500 text-white' : 'bg-slate-800 border-slate-600 text-slate-400 hover:bg-slate-700'}`}
                    title={t}
                >
                    {t}
                </button>
            ))}
        </div>
      </div>

      {/* Dynamic Controls */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <ControlSection title="Canvas Size">
             <InputGroup label="Width">
                 <RangeInput value={config.width} min={20} max={800} onChange={(v) => update('width', v)} />
             </InputGroup>
             <InputGroup label="Height">
                 <RangeInput value={config.height} min={20} max={600} onChange={(v) => update('height', v)} />
             </InputGroup>
        </ControlSection>

        {renderToolSpecifics()}
        
        {/* Spacer for bottom scrolling */}
        <div className="h-8 md:h-0"></div>
      </div>
    </div>
  );
};