export type ToolType = 'button' | 'healthbar' | 'panel' | 'crosshair' | 'slot' | 'badge' | 'slider';

export interface BaseConfig {
  width: number;
  height: number;
  scale: number;
}

export interface ButtonConfig extends BaseConfig {
  text: string;
  showText: boolean;
  fontFamily: 'sans' | 'pixel';
  fontSize: number;
  fontWeight: 'normal' | 'bold';
  bgColor: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  style: 'flat' | 'glossy' | 'cyber' | 'pixel' | 'neomorphism';
  shadowColor: string;
  shadowBlur: number;
}

export interface HealthBarConfig extends BaseConfig {
  value: number; // 0-100
  bgColor: string;
  fillColorStart: string;
  fillColorEnd: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  segments: number; // 0 for continuous
  segmentGap: number;
  showText: boolean;
  shape: 'rect' | 'round' | 'chamfer' | 'slash';
  drawMode: 'full' | 'frame' | 'fill'; // Crucial for game engines
  noise: number; // Texture noise
}

export interface PanelConfig extends BaseConfig {
  bgColor: string;
  bgOpacity: number;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  style: 'solid' | 'double' | 'ridge' | 'tech' | 'window';
  headerHeight: number;
  pattern: 'none' | 'grid' | 'dots' | 'scanlines' | 'noise';
  patternOpacity: number;
  glow: boolean;
  glowColor: string;
}

export interface CrosshairConfig extends BaseConfig {
  type: 'cross' | 'dot' | 'circle' | 't-shape' | 'chevron' | 'sniper';
  color: string;
  thickness: number;
  gap: number;
  length: number; // size of lines
  dotSize: number;
  outlineColor: string;
  outlineWidth: number;
  shadow: boolean;
}

export interface SlotConfig extends BaseConfig {
  rarityColor: string;
  bgColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  innerShadow: boolean;
  showHotkey: boolean;
  hotkeyText: string;
  style: 'simple' | 'mmo' | 'scifi';
}

export interface BadgeConfig extends BaseConfig {
  shape: 'shield' | 'circle' | 'hexagon' | 'diamond' | 'star';
  primaryColor: string;
  secondaryColor: string;
  iconText: string;
  borderColor: string;
  borderWidth: number;
  ribbon: boolean;
}

export interface SliderConfig extends BaseConfig {
  value: number; // 0-100 preview
  type: 'horizontal' | 'vertical';
  trackColor: string;
  trackBorderColor: string;
  trackBorderWidth: number;
  trackRadius: number;
  fillColor: string;
  thumbColor: string;
  thumbBorderColor: string;
  thumbBorderWidth: number;
  thumbSize: number; // Diameter or width
  thumbShape: 'circle' | 'rect' | 'pill' | 'diamond';
  drawMode: 'combined' | 'track' | 'thumb';
}

// Union type for all configs
export type AppState = {
  tool: ToolType;
  button: ButtonConfig;
  healthbar: HealthBarConfig;
  panel: PanelConfig;
  crosshair: CrosshairConfig;
  slot: SlotConfig;
  badge: BadgeConfig;
  slider: SliderConfig;
};

export const INITIAL_STATE: AppState = {
  tool: 'healthbar',
  button: {
    width: 200,
    height: 60,
    scale: 1,
    text: "START",
    showText: true,
    fontFamily: 'pixel',
    fontSize: 24,
    fontWeight: 'bold',
    bgColor: "#3b82f6",
    textColor: "#ffffff",
    borderColor: "#1e3a8a",
    borderWidth: 4,
    borderRadius: 4,
    style: 'glossy',
    shadowColor: "#000000",
    shadowBlur: 0,
  },
  healthbar: {
    width: 300,
    height: 32,
    scale: 1,
    value: 100,
    bgColor: "#1e293b",
    fillColorStart: "#22c55e",
    fillColorEnd: "#15803d",
    borderColor: "#0f172a",
    borderWidth: 4,
    borderRadius: 2,
    segments: 10,
    segmentGap: 4,
    showText: false,
    shape: 'slash',
    drawMode: 'full',
    noise: 0,
  },
  panel: {
    width: 400,
    height: 300,
    scale: 1,
    bgColor: "#0f172a",
    bgOpacity: 0.95,
    borderColor: "#3b82f6",
    borderWidth: 2,
    borderRadius: 8,
    style: 'window',
    headerHeight: 40,
    pattern: 'grid',
    patternOpacity: 0.1,
    glow: true,
    glowColor: "#3b82f6",
  },
  crosshair: {
    width: 64, 
    height: 64,
    scale: 1,
    type: 'cross',
    color: "#00ff00",
    thickness: 2,
    gap: 4,
    length: 8,
    dotSize: 2,
    outlineColor: "#000000",
    outlineWidth: 1,
    shadow: true,
  },
  slot: {
    width: 64,
    height: 64,
    scale: 1,
    rarityColor: "#eab308", 
    bgColor: "#0f172a",
    borderColor: "#475569",
    borderWidth: 2,
    borderRadius: 4,
    innerShadow: true,
    showHotkey: true,
    hotkeyText: "Q",
    style: 'mmo',
  },
  badge: {
    width: 100,
    height: 100,
    scale: 1,
    shape: 'shield',
    primaryColor: "#ef4444",
    secondaryColor: "#991b1b",
    iconText: "10",
    borderColor: "#fbbf24",
    borderWidth: 4,
    ribbon: true,
  },
  slider: {
    width: 300,
    height: 40, // Height of track area mainly
    scale: 1,
    value: 50,
    type: 'horizontal',
    trackColor: "#1e293b",
    trackBorderColor: "#475569",
    trackBorderWidth: 2,
    trackRadius: 10,
    fillColor: "#3b82f6",
    thumbColor: "#ffffff",
    thumbBorderColor: "#94a3b8",
    thumbBorderWidth: 1,
    thumbSize: 24,
    thumbShape: 'circle',
    drawMode: 'combined',
  }
};