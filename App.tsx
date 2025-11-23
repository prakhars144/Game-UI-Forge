import React, { useState } from 'react';
import { Controls } from './components/Controls';
import { Preview } from './components/Preview';
import { AppState, INITIAL_STATE, ToolType } from './types';

function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const setTool = (tool: ToolType) => {
    setState(prev => ({ ...prev, tool }));
  };

  const updateConfig = (key: string, value: any) => {
    setState(prev => ({
      ...prev,
      [prev.tool]: {
        ...prev[prev.tool],
        [key]: value
      }
    }));
  };

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen w-full bg-slate-900 text-slate-200 overflow-hidden">
      <Controls state={state} updateConfig={updateConfig} setTool={setTool} />
      <Preview state={state} />
    </div>
  );
}

export default App;