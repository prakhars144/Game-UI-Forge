import { 
  ButtonConfig, 
  HealthBarConfig, 
  PanelConfig, 
  CrosshairConfig, 
  SlotConfig, 
  BadgeConfig,
  SliderConfig
} from '../types';

// Helper: Custom shape paths
const drawPath = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, shape: string) => {
  ctx.beginPath();
  if (shape === 'rect') {
    ctx.rect(x, y, w, h);
  } else if (shape === 'round') {
    // Simple rounded rect
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  } else if (shape === 'chamfer') {
    const c = r; // use radius as chamfer size
    ctx.moveTo(x + c, y);
    ctx.lineTo(x + w - c, y);
    ctx.lineTo(x + w, y + c);
    ctx.lineTo(x + w, y + h - c);
    ctx.lineTo(x + w - c, y + h);
    ctx.lineTo(x + c, y + h);
    ctx.lineTo(x, y + h - c);
    ctx.lineTo(x, y + c);
    ctx.closePath();
  } else if (shape === 'slash') {
    const skew = h * 0.4;
    ctx.moveTo(x + skew, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w - skew, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
  }
};

const drawNoise = (ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) => {
    if (amount <= 0) return;
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        // Only apply noise to non-transparent pixels
        if (data[i+3] > 0) {
            const val = (Math.random() - 0.5) * amount * 255;
            data[i] += val;
            data[i+1] += val;
            data[i+2] += val;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

export const drawButton = (ctx: CanvasRenderingContext2D, config: ButtonConfig) => {
  const { width, height, bgColor, borderColor, borderWidth, borderRadius, style, shadowBlur, shadowColor } = config;

  ctx.clearRect(0, 0, width + 40, height + 40);
  ctx.save();
  ctx.translate(20, 20);

  if (shadowBlur > 0 && style !== 'flat' && style !== 'pixel') {
    ctx.shadowBlur = shadowBlur;
    ctx.shadowColor = shadowColor;
  }

  // Path definition
  drawPath(ctx, 0, 0, width, height, borderRadius, style === 'cyber' ? 'chamfer' : 'round');
  
  // Fill
  if (style === 'glossy') {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, bgColor);
    grad.addColorStop(0.5, bgColor);
    grad.addColorStop(1, '#000000'); // slight darken at bottom
    ctx.fillStyle = grad;
  } else if (style === 'neomorphism') {
    ctx.fillStyle = bgColor;
  } else {
    ctx.fillStyle = bgColor;
  }
  ctx.fill();

  // Shadow reset
  ctx.shadowBlur = 0;

  // Style Specifics
  if (style === 'glossy') {
    ctx.save();
    ctx.clip();
    const shine = ctx.createLinearGradient(0, 0, 0, height/2);
    shine.addColorStop(0, "rgba(255,255,255,0.6)");
    shine.addColorStop(1, "rgba(255,255,255,0.05)");
    ctx.fillStyle = shine;
    ctx.fillRect(0, 0, width, height/2);
    ctx.restore();
  }

  if (style === 'neomorphism') {
      // Light top-left, Dark bottom-right (simulated via border/shadows)
      ctx.shadowColor = "rgba(255,255,255,0.5)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = -4;
      ctx.shadowOffsetY = -4;
      ctx.stroke(); // subtle stroke
      
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;
      ctx.stroke();
      
      ctx.shadowColor = "transparent"; // clear
  }

  if (style === 'cyber') {
      // High tech lines
      ctx.strokeStyle = "rgba(255,255,255,0.5)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(10, height - 5);
      ctx.lineTo(width - 10, height - 5);
      ctx.stroke();
  }

  // Border
  if (borderWidth > 0 && style !== 'neomorphism') {
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
  }

  // Text
  if (config.showText) {
      ctx.font = `${config.fontWeight} ${config.fontSize}px ${config.fontFamily === 'pixel' ? '"Press Start 2P", cursive' : 'Inter, sans-serif'}`;
      ctx.fillStyle = config.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      if (style === 'pixel' || style === 'cyber') {
          ctx.shadowColor = "black";
          ctx.shadowBlur = 0; // Hard shadow
          ctx.fillText(config.text, width / 2 + 2, height / 2 + 2);
      }
      ctx.shadowBlur = 0;
      ctx.fillText(config.text, width / 2, height / 2 + (config.fontFamily === 'pixel' ? config.fontSize * 0.1 : 0));
  }

  ctx.restore();
};

export const drawHealthBar = (ctx: CanvasRenderingContext2D, config: HealthBarConfig) => {
  const { width, height, value, bgColor, fillColorStart, fillColorEnd, borderColor, borderWidth, borderRadius, segments, segmentGap, shape, drawMode } = config;
  
  const pad = 10;
  ctx.clearRect(0, 0, width + pad * 2, height + pad * 2);
  ctx.save();
  ctx.translate(pad, pad);

  // Define the path for the bar shape
  const createShape = () => drawPath(ctx, 0, 0, width, height, borderRadius, shape);

  // Draw Background (Frame)
  if (drawMode !== 'fill') {
      createShape();
      ctx.fillStyle = bgColor;
      ctx.fill();
  }

  // Draw Fill
  if (drawMode !== 'frame' && value > 0) {
      ctx.save();
      createShape();
      ctx.clip(); // Clip to shape

      // Calculate fill width based on value
      // For slashed shapes, simple width clipping works roughly okay, but for perfection we'd skew the fill too.
      // Since we clip to the path, just drawing a rect over the area works.
      const fillW = (width * value) / 100;

      // Gradient
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, fillColorStart);
      grad.addColorStop(1, fillColorEnd);
      ctx.fillStyle = grad;

      if (segments > 0) {
          const segWidth = width / segments;
          for (let i = 0; i < segments; i++) {
              const segX = i * segWidth;
              if (segX < fillW) {
                  // Draw individual segment rects, but let the clip handle the shape
                  // To simulate gaps, we reduce width
                  ctx.fillRect(segX + segmentGap/2, -10, segWidth - segmentGap, height + 20);
              }
          }
      } else {
          ctx.fillRect(0, 0, fillW, height);
      }
      
      // Add gloss reflection to fill
      ctx.fillStyle = "rgba(255,255,255,0.15)";
      ctx.fillRect(0, 0, width, height * 0.4);

      ctx.restore();
  }

  // Draw Border (on top)
  if (drawMode !== 'fill' && borderWidth > 0) {
      createShape();
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = borderColor;
      ctx.stroke();
  }
  
  // Noise Overlay
  if (config.noise > 0) {
      drawNoise(ctx, width + pad*2, height + pad*2, config.noise);
  }

  // Text
  if (config.showText && drawMode !== 'fill') { // Usually don't want text on fill-only export
      ctx.font = "bold 14px Inter, sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "black";
      ctx.shadowBlur = 3;
      ctx.fillText(`${value}%`, width / 2, height / 2);
  }

  ctx.restore();
};

export const drawPanel = (ctx: CanvasRenderingContext2D, config: PanelConfig) => {
  const { width, height, bgColor, bgOpacity, borderColor, borderWidth, borderRadius, style, headerHeight, pattern, patternOpacity, glow, glowColor } = config;
  
  const pad = glow ? 20 : 5;
  ctx.clearRect(0, 0, width + pad * 2, height + pad * 2);
  ctx.save();
  ctx.translate(pad, pad);

  if (glow) {
    ctx.shadowBlur = 20;
    ctx.shadowColor = glowColor;
  }

  const createBodyPath = () => {
     ctx.beginPath();
     if (style === 'tech') {
        const c = 20;
        ctx.moveTo(0, c);
        ctx.lineTo(c, 0);
        ctx.lineTo(width - c, 0);
        ctx.lineTo(width, c);
        ctx.lineTo(width, height - c);
        ctx.lineTo(width - c, height);
        ctx.lineTo(c, height);
        ctx.lineTo(0, height - c);
     } else {
        // Standard rounded
        ctx.roundRect(0, 0, width, height, borderRadius);
     }
     ctx.closePath();
  }

  createBodyPath();
  
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : `0,0,0`;
  }
  ctx.fillStyle = `rgba(${hexToRgb(bgColor)}, ${bgOpacity})`;
  ctx.fill();

  // Pattern
  if (pattern !== 'none') {
     ctx.save();
     createBodyPath();
     ctx.clip();
     ctx.fillStyle = `rgba(255,255,255,${patternOpacity})`;
     if (pattern === 'grid') {
         const s = 20;
         for(let x=0; x<width; x+=s) ctx.fillRect(x, 0, 1, height);
         for(let y=0; y<height; y+=s) ctx.fillRect(0, y, width, 1);
     } else if (pattern === 'scanlines') {
         for(let y=0; y<height; y+=4) ctx.fillRect(0, y, width, 1);
     } else if (pattern === 'dots') {
         const s = 15;
         for(let x=0; x<width; x+=s) {
             for(let y=0; y<height; y+=s) {
                 ctx.beginPath();
                 ctx.arc(x, y, 1, 0, Math.PI*2);
                 ctx.fill();
             }
         }
     }
     ctx.restore();
  }

  ctx.shadowBlur = 0; // Off for details

  // Window Title Bar
  if (style === 'window' && headerHeight > 0) {
      ctx.save();
      createBodyPath();
      ctx.clip();
      ctx.fillStyle = `rgba(0,0,0,0.3)`;
      ctx.fillRect(0, 0, width, headerHeight);
      // Close button simulation
      ctx.beginPath();
      ctx.arc(width - 20, headerHeight/2, 6, 0, Math.PI*2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.restore();
      
      // Separator
      ctx.beginPath();
      ctx.moveTo(0, headerHeight);
      ctx.lineTo(width, headerHeight);
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      ctx.stroke();
  }

  // Border
  if (borderWidth > 0) {
    ctx.lineWidth = borderWidth;
    ctx.strokeStyle = borderColor;
    
    if (style === 'double') {
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      createBodyPath(); // Re-trace
      ctx.stroke();
    } else {
      ctx.stroke();
    }
    
    if (style === 'tech') {
        // Tech accents
        ctx.strokeStyle = glowColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 40); ctx.lineTo(0, 20); ctx.lineTo(20, 0); ctx.lineTo(40, 0);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(width, height - 40); ctx.lineTo(width, height - 20); ctx.lineTo(width - 20, height); ctx.lineTo(width - 40, height);
        ctx.stroke();
    }
  }

  ctx.restore();
};

export const drawCrosshair = (ctx: CanvasRenderingContext2D, config: CrosshairConfig) => {
    const { width, height, type, color, thickness, gap, length, dotSize, outlineColor, outlineWidth, shadow } = config;
    const cx = width / 2;
    const cy = height / 2;
    
    ctx.clearRect(0, 0, width, height);
    
    if (shadow) {
        ctx.shadowBlur = 4;
        ctx.shadowColor = "black";
    }

    const stroke = (x1: number, y1: number, x2: number, y2: number) => {
        if (outlineWidth > 0) {
            ctx.save();
            ctx.shadowBlur = 0;
            ctx.lineWidth = thickness + outlineWidth * 2;
            ctx.strokeStyle = outlineColor;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.restore();
        }
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }

    if (type === 'dot' || dotSize > 0) {
        if (outlineWidth > 0) {
            ctx.fillStyle = outlineColor;
            ctx.beginPath();
            ctx.arc(cx, cy, dotSize + outlineWidth, 0, Math.PI*2);
            ctx.fill();
        }
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, dotSize, 0, Math.PI*2);
        ctx.fill();
    }

    if (type === 'cross' || type === 't-shape') {
        if (type !== 't-shape') stroke(cx, cy - gap, cx, cy - gap - length); // Top
        stroke(cx, cy + gap, cx, cy + gap + length); // Bottom
        stroke(cx - gap, cy, cx - gap - length, cy); // Left
        stroke(cx + gap, cy, cx + gap + length, cy); // Right
    } else if (type === 'circle') {
        ctx.beginPath();
        ctx.arc(cx, cy, gap + length, 0, Math.PI*2);
        if (outlineWidth > 0) {
             ctx.lineWidth = thickness + outlineWidth*2;
             ctx.strokeStyle = outlineColor;
             ctx.stroke();
        }
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.stroke();
    } else if (type === 'chevron') {
        // Sci-fi chevron
        const s = gap + 5;
        const l = length;
        ctx.beginPath();
        ctx.moveTo(cx - s - l, cy); ctx.lineTo(cx - s, cy);
        ctx.moveTo(cx + s, cy); ctx.lineTo(cx + s + l, cy);
        ctx.moveTo(cx, cy - s - l); ctx.lineTo(cx, cy - s);
        
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.stroke();
        
        // Triangle
        ctx.beginPath();
        ctx.moveTo(cx - 4, cy + s);
        ctx.lineTo(cx + 4, cy + s);
        ctx.lineTo(cx, cy + s + 6);
        ctx.fillStyle = color;
        ctx.fill();
    } else if (type === 'sniper') {
         ctx.lineWidth = 1;
         ctx.strokeStyle = outlineColor;
         ctx.beginPath();
         ctx.moveTo(0, cy); ctx.lineTo(width, cy);
         ctx.moveTo(cx, 0); ctx.lineTo(cx, height);
         ctx.stroke();
         
         ctx.lineWidth = thickness;
         ctx.strokeStyle = color;
         ctx.beginPath();
         ctx.arc(cx, cy, width * 0.4, 0, Math.PI * 2);
         ctx.stroke();
         
         // dots on axes
         for(let i=1; i<5; i++) {
             const d = (width * 0.4) / 5 * i;
             ctx.beginPath(); ctx.arc(cx + d, cy, 2, 0, Math.PI*2); ctx.fill();
             ctx.beginPath(); ctx.arc(cx - d, cy, 2, 0, Math.PI*2); ctx.fill();
         }
    }
};

export const drawSlot = (ctx: CanvasRenderingContext2D, config: SlotConfig) => {
    const { width, height, bgColor, borderColor, borderWidth, borderRadius, rarityColor, innerShadow, showHotkey, hotkeyText, style } = config;

    ctx.clearRect(0, 0, width + 10, height + 10);
    ctx.save();
    ctx.translate(5, 5);

    // Background
    if (style === 'mmo') {
        drawPath(ctx, 0, 0, width, height, borderRadius, 'rect');
        // Beveled look
        const grad = ctx.createLinearGradient(0,0,0,height);
        grad.addColorStop(0, '#334155');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fill();
        // Inset
        ctx.fillStyle = bgColor;
        ctx.fillRect(4, 4, width - 8, height - 8);
    } else if (style === 'scifi') {
        drawPath(ctx, 0, 0, width, height, borderRadius, 'chamfer');
        ctx.fillStyle = bgColor;
        ctx.fill();
    } else {
        drawPath(ctx, 0, 0, width, height, borderRadius, 'round');
        ctx.fillStyle = bgColor;
        ctx.fill();
    }

    // Rarity Glow
    if (rarityColor !== 'none') {
        ctx.save();
        if (style === 'scifi') drawPath(ctx, 0, 0, width, height, borderRadius, 'chamfer');
        else drawPath(ctx, 0, 0, width, height, borderRadius, 'round');
        ctx.clip();
        
        const grad = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width * 0.7);
        grad.addColorStop(0, `${rarityColor}00`);
        grad.addColorStop(1, `${rarityColor}88`);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
    }

    // Border
    if (borderWidth > 0) {
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        if (style === 'scifi') drawPath(ctx, 0, 0, width, height, borderRadius, 'chamfer');
        else drawPath(ctx, 0, 0, width, height, borderRadius, 'round');
        ctx.stroke();
    }

    // Inner Shadow
    if (innerShadow) {
        ctx.shadowBlur = 10;
        ctx.shadowColor = "black";
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        if (style === 'scifi') drawPath(ctx, 0, 0, width, height, borderRadius, 'chamfer');
        else drawPath(ctx, 0, 0, width, height, borderRadius, 'round');
        ctx.stroke();
        ctx.shadowBlur = 0;
    }

    // Hotkey
    if (showHotkey) {
        const keySize = 20;
        const pad = 2;
        ctx.fillStyle = "#000000";
        // Bottom right corner for hotkey usually
        ctx.beginPath();
        ctx.rect(width - keySize - pad, height - keySize - pad, keySize, keySize);
        ctx.fill();
        
        ctx.fillStyle = "#ffffff";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(hotkeyText, width - keySize/2 - pad, height - keySize/2 - pad + 1);
    }
    
    ctx.restore();
};

export const drawBadge = (ctx: CanvasRenderingContext2D, config: BadgeConfig) => {
    // ... existing badge code with minor adjustments if needed
    // Keeping it simple for brevity as requested
    const { width, height, shape, primaryColor, secondaryColor, borderColor, borderWidth, iconText, ribbon } = config;
    
    const cx = width / 2;
    const cy = height / 2;
    const size = Math.min(width, height) / 2 - 10;

    ctx.clearRect(0, 0, width + 20, height + 20);
    ctx.save();
    ctx.translate(10, 10);
    
    ctx.beginPath();
    if (shape === 'circle') ctx.arc(cx, cy, size, 0, Math.PI * 2);
    else if (shape === 'diamond') { ctx.moveTo(cx, cy - size); ctx.lineTo(cx + size, cy); ctx.lineTo(cx, cy + size); ctx.lineTo(cx - size, cy); ctx.closePath(); }
    else if (shape === 'hexagon') { for(let i=0; i<6; i++) { const a = (Math.PI/3)*i; ctx.lineTo(cx + size*Math.cos(a), cy+size*Math.sin(a)); } ctx.closePath(); }
    else if (shape === 'shield') { 
        ctx.moveTo(cx - size * 0.8, cy - size * 0.8);
        ctx.lineTo(cx + size * 0.8, cy - size * 0.8);
        ctx.lineTo(cx + size * 0.8, cy); 
        ctx.quadraticCurveTo(cx + size * 0.8, cy + size, cx, cy + size); 
        ctx.quadraticCurveTo(cx - size * 0.8, cy + size, cx - size * 0.8, cy); 
        ctx.closePath();
    } else if (shape === 'star') {
        const spikes = 5; const outer = size; const inner = size/2;
        let rot = Math.PI / 2 * 3; let x = cx; let y = cy; const step = Math.PI / spikes;
        ctx.moveTo(cx, cy - outer);
        for(let i=0; i<spikes; i++) {
            x = cx + Math.cos(rot) * outer; y = cy + Math.sin(rot) * outer; ctx.lineTo(x, y); rot += step;
            x = cx + Math.cos(rot) * inner; y = cy + Math.sin(rot) * inner; ctx.lineTo(x, y); rot += step;
        }
        ctx.lineTo(cx, cy - outer); ctx.closePath();
    }

    const grad = ctx.createLinearGradient(cx, cy - size, cx, cy + size);
    grad.addColorStop(0, primaryColor);
    grad.addColorStop(1, secondaryColor);
    ctx.fillStyle = grad;
    ctx.fill();

    if (borderWidth > 0) {
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
    }

    if (ribbon) {
        // Simple ribbon at bottom
        ctx.fillStyle = "#b91c1c";
        ctx.beginPath();
        ctx.moveTo(cx - size, cy + size * 0.5);
        ctx.lineTo(cx + size, cy + size * 0.5);
        ctx.lineTo(cx + size + 10, cy + size * 0.8);
        ctx.lineTo(cx, cy + size + 5);
        ctx.lineTo(cx - size - 10, cy + size * 0.8);
        ctx.fill();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px 'Press Start 2P', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;
    ctx.fillText(iconText, cx, cy);

    ctx.restore();
}

export const drawSlider = (ctx: CanvasRenderingContext2D, config: SliderConfig) => {
    const { width, height, type, trackColor, trackBorderColor, trackBorderWidth, trackRadius, fillColor, thumbColor, thumbBorderColor, thumbBorderWidth, thumbSize, thumbShape, value, drawMode } = config;

    ctx.clearRect(0, 0, width + 40, height + 40);
    ctx.save();
    
    // Center logic
    const cx = width / 2;
    const cy = height / 2;
    
    // Determine effective track dimensions based on orientation
    // If combined/track mode, we draw the track.
    // If thumb mode, we just draw thumb (maybe centered for export? or at position?)
    // Game engine export standard: Track image separate, Thumb image separate.
    
    const isVert = type === 'vertical';
    // Track bounds
    const tW = isVert ? 20 : width; // default track thickness if undefined in UI, let's assume 'width' is length, height is thickness
    const tH = isVert ? height : 20; // Actually config.height is canvas height.
    
    // Let's assume config.width/height is the CANVAS size.
    // We want a bar that fills it mostly.
    const pad = thumbSize / 2 + 5;
    const trackW = isVert ? 12 : width - pad*2;
    const trackH = isVert ? height - pad*2 : 12;
    const trackX = (width - trackW) / 2;
    const trackY = (height - trackH) / 2;

    if (drawMode !== 'thumb') {
        // Draw Track
        ctx.beginPath();
        ctx.roundRect(trackX, trackY, trackW, trackH, trackRadius);
        ctx.fillStyle = trackColor;
        ctx.fill();
        if (trackBorderWidth > 0) {
            ctx.lineWidth = trackBorderWidth;
            ctx.strokeStyle = trackBorderColor;
            ctx.stroke();
        }

        // Draw Fill (Progress)
        // Usually sliders have a fill part
        const fillPercent = value / 100;
        ctx.beginPath();
        if (isVert) {
            // Fill from bottom
            const fillH = trackH * fillPercent;
            ctx.roundRect(trackX, trackY + trackH - fillH, trackW, fillH, trackRadius);
        } else {
            const fillW = trackW * fillPercent;
            ctx.roundRect(trackX, trackY, fillW, trackH, trackRadius);
        }
        ctx.fillStyle = fillColor;
        ctx.fill();
    }

    if (drawMode !== 'track') {
        // Calculate Thumb Position
        let thumbX, thumbY;
        if (drawMode === 'thumb') {
            // For export, center the thumb on canvas
            thumbX = width / 2;
            thumbY = height / 2;
        } else {
            const fillPercent = value / 100;
            if (isVert) {
                 thumbX = width / 2;
                 thumbY = (trackY + trackH) - (trackH * fillPercent);
            } else {
                 thumbX = trackX + (trackW * fillPercent);
                 thumbY = height / 2;
            }
        }

        // Draw Thumb
        ctx.beginPath();
        if (thumbShape === 'circle') {
            ctx.arc(thumbX, thumbY, thumbSize/2, 0, Math.PI*2);
        } else if (thumbShape === 'rect') {
            ctx.rect(thumbX - thumbSize/2, thumbY - thumbSize/2, thumbSize, thumbSize);
        } else if (thumbShape === 'pill') {
            const r = isVert ? thumbSize/4 : thumbSize/2;
            const w = isVert ? thumbSize : thumbSize/2;
            const h = isVert ? thumbSize/2 : thumbSize;
            ctx.rect(thumbX - w/2, thumbY - h/2, w, h); // Simplified pill
        } else if (thumbShape === 'diamond') {
             ctx.moveTo(thumbX, thumbY - thumbSize/2);
             ctx.lineTo(thumbX + thumbSize/2, thumbY);
             ctx.lineTo(thumbX, thumbY + thumbSize/2);
             ctx.lineTo(thumbX - thumbSize/2, thumbY);
             ctx.closePath();
        }
        
        ctx.fillStyle = thumbColor;
        ctx.fill();
        
        // Thumb Highlight/3D
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.arc(thumbX - thumbSize/6, thumbY - thumbSize/6, thumbSize/6, 0, Math.PI*2);
        ctx.fill();

        if (thumbBorderWidth > 0) {
            ctx.lineWidth = thumbBorderWidth;
            ctx.strokeStyle = thumbBorderColor;
            ctx.stroke();
        }
    }

    ctx.restore();
}