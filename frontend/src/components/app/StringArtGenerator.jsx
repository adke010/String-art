import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Play, 
  Square, 
  Download, 
  Settings, 
  RefreshCw, 
  Image as ImageIcon, 
  Sliders, 
  Move, 
  ZoomIn, 
  ZoomOut, 
  History, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Clock, 
  CheckCircle, 
  PlayCircle, 
  Hash, 
  Home,
  Sparkles
} from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';

const StringArtGenerator = ({ onBack }) => {
  // --- Configuration States ---
  const [numLines, setNumLines] = useState(4000);
  const [numPins, setNumPins] = useState(288);
  const [diameterCm, setDiameterCm] = useState(50);
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);

  // --- Processing States ---
  const [imageSrc, setImageSrc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stringSequence, setStringSequence] = useState([]);
  const [statusMessage, setStatusMessage] = useState("Sube una imagen para comenzar");

  // --- History & Guide States ---
  const [history, setHistory] = useState([]);
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);

  // --- Interaction States ---
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragOver, setIsDragOver] = useState(false);

  const imageObjectRef = useRef(null);

  // --- Refs ---
  const editorCanvasRef = useRef(null);
  const displayCanvasRef = useRef(null);
  const guideCanvasRef = useRef(null);
  const processingRef = useRef(null);

  // Constants
  const CANVAS_SIZE = 600;
  const PROCESSING_SIZE = 500;
  const STRING_OPACITY = 0.5;
  const PHYSICAL_THREAD_THICKNESS_CM = 0.035;

  useEffect(() => {
    const savedStep = localStorage.getItem('stringArtGuideStep');
    if (savedStep) setGuideStep(parseInt(savedStep));
  }, []);

  useEffect(() => {
    localStorage.setItem('stringArtGuideStep', guideStep);
  }, [guideStep]);

  const processFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          imageObjectRef.current = img;
          setImageSrc(event.target.result);
          const scale = Math.max(PROCESSING_SIZE / img.width, PROCESSING_SIZE / img.height);
          const x = (PROCESSING_SIZE - img.width * scale) / 2;
          const y = (PROCESSING_SIZE - img.height * scale) / 2;
          setTransform({ x, y, scale });
          setStatusMessage("Arrastra y haz zoom para ajustar");
          setProgress(0);
          setStringSequence([]);
          setHistory([]);
          setGuideStep(0);
          stopProcessing();
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e) => processFile(e.target.files[0]);
  const handleDragOverFile = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeaveFile = (e) => { e.preventDefault(); setIsDragOver(false); };
  const handleDropFile = (e) => { 
    e.preventDefault(); 
    setIsDragOver(false); 
    if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]); 
  };

  useEffect(() => {
    if (!imageObjectRef.current || !editorCanvasRef.current) return;
    const canvas = editorCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageObjectRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.filter = `grayscale(100%) brightness(${100 + brightness}%) contrast(${100 + contrast}%)`;
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);
    ctx.drawImage(img, 0, 0);
    ctx.restore();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.rect(0, 0, PROCESSING_SIZE, PROCESSING_SIZE);
    ctx.arc(PROCESSING_SIZE / 2, PROCESSING_SIZE / 2, PROCESSING_SIZE / 2, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.strokeStyle = 'hsl(350, 89%, 60%)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(PROCESSING_SIZE / 2, PROCESSING_SIZE / 2, (PROCESSING_SIZE / 2) - 2, 0, Math.PI * 2);
    ctx.stroke();
  }, [brightness, contrast, transform, imageSrc]);

  const handleMouseDown = (e) => {
    if (!imageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging || !imageSrc) return;
    e.preventDefault();
    setTransform(prev => ({ ...prev, x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }));
  };
  
  const handleMouseUp = () => setIsDragging(false);
  
  const handleWheel = (e) => {
    if (!imageSrc) return;
    e.preventDefault();
    const scaleFactor = 0.05;
    const delta = e.deltaY > 0 ? -scaleFactor : scaleFactor;
    const newScale = Math.max(0.1, transform.scale + delta);
    setTransform(prev => ({ ...prev, scale: newScale }));
  };

  const stopProcessing = () => {
    if (processingRef.current) {
      clearTimeout(processingRef.current);
      processingRef.current = null;
    }
    setIsProcessing(false);
  };

  const startWeaving = async () => {
    if (!imageSrc) return;
    stopProcessing();
    setIsProcessing(true);
    setStatusMessage("Calculando rutas de hilo...");
    setProgress(0);
    
    const sourceCanvas = editorCanvasRef.current;
    const sourceCtx = sourceCanvas.getContext('2d');
    const imgData = sourceCtx.getImageData(0, 0, PROCESSING_SIZE, PROCESSING_SIZE);
    const pixels = imgData.data;
    const size = PROCESSING_SIZE;
    
    const pins = [];
    const center = size / 2;
    const radius = (size / 2) - 2;
    for (let i = 0; i < numPins; i++) {
      const angle = (2 * Math.PI * i) / numPins;
      pins.push({ 
        x: Math.round(center + radius * Math.cos(angle)), 
        y: Math.round(center + radius * Math.sin(angle)) 
      });
    }
    
    const displayCanvas = displayCanvasRef.current;
    displayCanvas.width = CANVAS_SIZE;
    displayCanvas.height = CANVAS_SIZE;
    const ctx = displayCanvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.fillStyle = '#ddd';
    const displayScale = CANVAS_SIZE / size;
    pins.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x * displayScale, p.y * displayScale, 1.5, 0, Math.PI * 2);
      ctx.fill();
    });
    
    const physicalRatio = PHYSICAL_THREAD_THICKNESS_CM / (diameterCm || 50);
    const calculatedLineWidth = CANVAS_SIZE * physicalRatio;
    ctx.lineWidth = Math.max(0.15, calculatedLineWidth);
    ctx.strokeStyle = `rgba(0, 0, 0, ${STRING_OPACITY})`;
    
    let currentPin = 0;
    let sequence = [0];
    let lineCount = 0;
    const errorMatrix = new Int32Array(size * size);
    for (let i = 0; i < pixels.length; i += 4) {
      errorMatrix[i / 4] = 255 - pixels[i];
    }
    
    const step = () => {
      const linesPerFrame = 25;
      for (let batch = 0; batch < linesPerFrame; batch++) {
        if (lineCount >= numLines) {
          finishProcessing(sequence);
          return;
        }
        
        let bestPin = -1;
        let maxLineWeight = -1;
        const minDistance = 15;
        
        for (let nextPin = 0; nextPin < numPins; nextPin++) {
          const distance = Math.abs(nextPin - currentPin);
          if (distance < minDistance || distance > numPins - minDistance) continue;
          if (nextPin === currentPin) continue;
          
          const p1 = pins[currentPin];
          const p2 = pins[nextPin];
          let x0 = p1.x, y0 = p1.y, x1 = p2.x, y1 = p2.y;
          let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
          let sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1;
          let err = dx - dy;
          let lineWeight = 0;
          let pixelCount = 0;
          
          while (true) {
            const idx = y0 * size + x0;
            if (idx >= 0 && idx < errorMatrix.length) {
              lineWeight += errorMatrix[idx];
              pixelCount++;
            }
            if (x0 === x1 && y0 === y1) break;
            let e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
          }
          
          const score = lineWeight / (pixelCount || 1);
          if (score > maxLineWeight) {
            maxLineWeight = score;
            bestPin = nextPin;
          }
        }
        
        if (bestPin !== -1) {
          const p1 = pins[currentPin];
          const p2 = pins[bestPin];
          let x0 = p1.x, y0 = p1.y, x1 = p2.x, y1 = p2.y;
          let dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
          let sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1;
          let err = dx - dy;
          const subtractionValue = 50;
          
          while (true) {
            const idx = y0 * size + x0;
            if (idx >= 0 && idx < errorMatrix.length) {
              errorMatrix[idx] = Math.max(0, errorMatrix[idx] - subtractionValue);
            }
            if (x0 === x1 && y0 === y1) break;
            let e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
          }
          
          ctx.beginPath();
          ctx.moveTo(p1.x * displayScale, p1.y * displayScale);
          ctx.lineTo(p2.x * displayScale, p2.y * displayScale);
          ctx.stroke();
          
          sequence.push(bestPin);
          currentPin = bestPin;
          lineCount++;
        } else {
          finishProcessing(sequence);
          return;
        }
      }
      setProgress(Math.round((lineCount / numLines) * 100));
      processingRef.current = setTimeout(step, 0);
    };
    
    step();
  };

  const finishProcessing = (finalSequence) => {
    setIsProcessing(false);
    setProgress(100);
    setStatusMessage("¡Arte completado!");
    setStringSequence(finalSequence);
    
    if (displayCanvasRef.current) {
      const newItem = {
        id: Date.now(),
        thumbnail: displayCanvasRef.current.toDataURL('image/jpeg', 0.5),
        config: { numLines, numPins, diameterCm, brightness, contrast },
        sequence: [...finalSequence],
        date: new Date().toLocaleTimeString()
      };
      setHistory(prev => [newItem, ...prev].slice(0, 6));
    }
  };

  const restoreFromHistory = (item) => {
    if (isProcessing) return;
    setNumLines(item.config.numLines);
    setNumPins(item.config.numPins);
    setDiameterCm(item.config.diameterCm);
    setBrightness(item.config.brightness);
    setContrast(item.config.contrast);
    setStringSequence(item.sequence);
    setStatusMessage(`Restaurado versión de ${item.date}`);
    
    setTimeout(() => {
      const canvas = displayCanvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const size = PROCESSING_SIZE;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      
      const pins = [];
      const center = size / 2;
      const radius = (size / 2) - 2;
      for (let i = 0; i < item.config.numPins; i++) {
        const angle = (2 * Math.PI * i) / item.config.numPins;
        pins.push({ 
          x: Math.round(center + radius * Math.cos(angle)), 
          y: Math.round(center + radius * Math.sin(angle)) 
        });
      }
      
      const displayScale = CANVAS_SIZE / size;
      ctx.fillStyle = '#ddd';
      pins.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x * displayScale, p.y * displayScale, 1.5, 0, Math.PI * 2);
        ctx.fill();
      });
      
      const physicalRatio = PHYSICAL_THREAD_THICKNESS_CM / (item.config.diameterCm || 50);
      const calculatedLineWidth = CANVAS_SIZE * physicalRatio;
      ctx.lineWidth = Math.max(0.15, calculatedLineWidth);
      ctx.strokeStyle = `rgba(0, 0, 0, ${STRING_OPACITY})`;
      ctx.beginPath();
      
      if (item.sequence.length > 0) {
        const p0 = pins[item.sequence[0]];
        ctx.moveTo(p0.x * displayScale, p0.y * displayScale);
        for (let i = 1; i < item.sequence.length; i++) {
          const p = pins[item.sequence[i]];
          if (p) ctx.lineTo(p.x * displayScale, p.y * displayScale);
        }
      }
      ctx.stroke();
    }, 100);
  };

  const downloadInstructions = () => {
    const content = `INSTRUCCIONES DE STRING ART 2026\n===================================\nFecha: ${new Date().toLocaleDateString()}\nConfiguración:\n- Líneas: ${numLines}\n- Pines: ${numPins}\n- Diámetro: ${diameterCm}cm\n\nSecuencia de pines:\n${stringSequence.join(' → ')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'string-art-instrucciones.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!showGuide || !guideCanvasRef.current || stringSequence.length === 0) return;
    
    const canvas = guideCanvasRef.current;
    const ctx = canvas.getContext('2d');
    const size = 300;
    canvas.width = size;
    canvas.height = size;
    
    const center = size / 2;
    const radius = (size / 2) - 10;
    
    ctx.clearRect(0, 0, size, size);
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    const getPinCoords = (pinIdx) => {
      const angle = (2 * Math.PI * pinIdx) / numPins;
      return { 
        x: center + radius * Math.cos(angle), 
        y: center + radius * Math.sin(angle) 
      };
    };
    
    const currentPinIdx = stringSequence[guideStep];
    const nextPinIdx = stringSequence[guideStep + 1];
    
    if (currentPinIdx !== undefined && nextPinIdx !== undefined) {
      const p1 = getPinCoords(currentPinIdx);
      const p2 = getPinCoords(nextPinIdx);
      
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.strokeStyle = 'hsl(var(--accent))';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(p1.x, p1.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(var(--muted-foreground))';
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(p2.x, p2.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'hsl(var(--accent))';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }, [showGuide, guideStep, stringSequence, numPins]);

  const getTimeRemaining = () => {
    const remainingLines = Math.max(0, stringSequence.length - guideStep);
    const secondsPerLine = 7;
    const totalSeconds = remainingLines * secondsPerLine;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes} min`;
  };
  
  const nextStep = () => {
    if (guideStep < stringSequence.length - 2) setGuideStep(prev => prev + 1);
  };
  
  const prevStep = () => {
    if (guideStep > 0) setGuideStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-rose-200">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border-b border-border p-4 shadow-sm sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="hover:bg-muted"
            >
              <Home size={20} />
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 text-accent ${isProcessing ? 'animate-spin' : ''}`} />
              <h1 className="text-xl font-bold tracking-tight hidden sm:block">Editor</h1>
            </div>
          </div>
          
          <Badge variant="secondary" className="font-medium">
            {isProcessing ? `Tejiendo... ${progress}%` : statusMessage}
          </Badge>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Control Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card p-6 rounded-2xl shadow-sm border border-border space-y-8 h-fit"
        >
          {/* 1. Upload & Edit Image */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <ImageIcon size={16} /> 1. Imagen Fuente
            </h2>
            
            <div
              className={`relative group w-full aspect-square border-2 border-dashed rounded-xl bg-muted/30 overflow-hidden cursor-move transition-colors duration-300
                ${isDragOver ? 'border-accent bg-accent/10' : 'border-border hover:border-muted-foreground/50'}`}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDragOver={handleDragOverFile}
              onDragLeave={handleDragLeaveFile}
              onDrop={handleDropFile}
            >
              <canvas
                ref={editorCanvasRef}
                width={PROCESSING_SIZE}
                height={PROCESSING_SIZE}
                className={`w-full h-full object-contain ${!imageSrc ? 'hidden' : 'block'}`}
              />

              {!imageSrc && (
                <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                  <Upload className={`w-8 h-8 mb-2 transition-colors ${isDragOver ? 'text-accent' : 'text-muted-foreground'}`} />
                  <p className={`text-sm font-medium transition-colors ${isDragOver ? 'text-accent' : 'text-muted-foreground'}`}>
                    {isDragOver ? '¡Suelta la imagen aquí!' : 'Haz clic o arrastra imagen'}
                  </p>
                </label>
              )}
              
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />

              {imageSrc && (
                <div className="absolute bottom-2 right-2 flex gap-2 z-20">
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="h-8 w-8"
                    onClick={() => setTransform(t => ({ ...t, scale: t.scale * 1.1 }))}
                  >
                    <ZoomIn size={16} />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="secondary"
                    className="h-8 w-8"
                    onClick={() => setTransform(t => ({ ...t, scale: Math.max(0.1, t.scale * 0.9) }))}
                  >
                    <ZoomOut size={16} />
                  </Button>
                </div>
              )}

              {imageSrc && (
                <div className="absolute top-2 right-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <span className="bg-foreground/60 text-primary-foreground text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1">
                    <Move size={10} /> Arrastra para mover
                  </span>
                </div>
              )}
            </div>

            {imageSrc && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Brillo</label>
                  <Slider
                    value={[brightness]}
                    onValueChange={(v) => setBrightness(v[0])}
                    min={-50}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">Contraste</label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(v) => setContrast(v[0])}
                    min={-50}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>

          <hr className="border-border" />

          {/* 2. Configuration */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Sliders size={16} /> 2. Configuración
            </h2>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Cantidad de Líneas</label>
                <span className="text-sm font-bold text-accent">{numLines.toLocaleString()}</span>
              </div>
              <Slider
                value={[numLines]}
                onValueChange={(v) => setNumLines(v[0])}
                min={1000}
                max={10000}
                step={500}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Tamaño (cm)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={diameterCm}
                    onChange={(e) => setDiameterCm(e.target.value)}
                    className="input-field pr-10"
                  />
                  <span className="absolute right-3 top-3 text-muted-foreground text-xs">cm</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">Pines (Clavos)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={numPins}
                    onChange={(e) => setNumPins(parseInt(e.target.value) || 0)}
                    className="input-field pr-10"
                  />
                  <Settings className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </div>

          {/* 3. Actions */}
          <div className="pt-4 flex flex-col gap-3">
            {!isProcessing ? (
              <Button
                onClick={startWeaving}
                disabled={!imageSrc}
                size="lg"
                className={`w-full gap-2 font-bold ${imageSrc ? 'btn-primary' : ''}`}
              >
                <Play className="w-5 h-5" /> GENERAR ARTE
              </Button>
            ) : (
              <Button
                onClick={stopProcessing}
                size="lg"
                variant="destructive"
                className="w-full gap-2 font-bold"
              >
                <Square className="w-5 h-5 fill-current" /> DETENER
              </Button>
            )}

            <AnimatePresence>
              {stringSequence.length > 0 && !isProcessing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col gap-2"
                >
                  <Button
                    onClick={() => setShowGuide(true)}
                    size="lg"
                    className="w-full gap-2 btn-accent"
                  >
                    <PlayCircle className="w-5 h-5" /> INICIAR EN LIENZO
                  </Button>
                  <Button
                    onClick={downloadInstructions}
                    size="lg"
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <Download className="w-5 h-5" /> Descargar TXT
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Canvas Area */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 flex flex-col gap-6"
        >
          {/* Canvas Display */}
          <div className="bg-muted/50 rounded-2xl p-6 border border-border shadow-inner-soft relative flex flex-col items-center justify-center flex-grow min-h-[500px]">
            <div className="canvas-frame transform transition-all duration-500 hover:shadow-xl">
              <canvas
                ref={displayCanvasRef}
                className="w-full h-auto max-w-[500px] aspect-square bg-card relative z-10"
              />

              {!imageSrc && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-card/80 pointer-events-none">
                  <p className="text-muted-foreground font-medium">Vista previa del lienzo</p>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-md mt-6"
              >
                <Progress value={progress} className="h-2" />
              </motion.div>
            )}

            {/* Quick Info */}
            <div className="mt-6 grid grid-cols-3 gap-8 text-center w-full max-w-md">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {isProcessing || stringSequence.length > 0 ? (stringSequence.length || 0).toLocaleString() : 0}
                </p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Líneas</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{diameterCm} cm</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Diámetro</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">Normal</p>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Grosor</p>
              </div>
            </div>
          </div>

          {/* History */}
          <AnimatePresence>
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-card rounded-2xl p-4 border border-border shadow-sm"
              >
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <History size={16} /> Historial Reciente
                </h3>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {history.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => restoreFromHistory(item)}
                      className="flex-shrink-0 cursor-pointer group relative"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-border group-hover:border-accent transition-colors">
                        <img src={item.thumbnail} alt="History" className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                        <RotateCcw className="text-primary-foreground w-6 h-6" />
                      </div>
                      <div className="mt-1 text-[10px] text-center text-muted-foreground font-medium">
                        {item.config.numLines.toLocaleString()} L<br />
                        {item.date}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuide && stringSequence.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card w-full max-w-4xl h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl"
            >
              {/* Guide Header */}
              <div className="bg-muted border-b border-border p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 text-accent rounded-full flex items-center justify-center font-bold">
                    <Hash size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Modo Constructor</h2>
                    <p className="text-xs text-muted-foreground">Progreso guardado automáticamente</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowGuide(false)}
                >
                  <X size={24} />
                </Button>
              </div>

              {/* Guide Body */}
              <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2">
                {/* Left - Visualizer */}
                <div className="bg-muted flex flex-col items-center justify-center p-8 relative">
                  <div className="bg-card p-4 rounded-full shadow-xl border-4 border-card mb-6">
                    <canvas ref={guideCanvasRef} className="w-64 h-64 md:w-80 md:h-80" />
                  </div>
                  <div className="absolute bottom-6 flex items-center gap-2 glass px-4 py-2 rounded-full">
                    <Clock size={16} className="text-accent" />
                    <span className="text-sm font-semibold text-muted-foreground">Restante: {getTimeRemaining()}</span>
                  </div>
                </div>

                {/* Right - Instructions */}
                <div className="p-8 flex flex-col justify-center items-center text-center bg-card relative">
                  <div className="mb-8 w-full">
                    <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-2">Conectar</h3>
                    <div className="flex items-center justify-center gap-6">
                      <div className="text-center opacity-50 scale-90">
                        <p className="text-sm text-muted-foreground mb-1">Desde</p>
                        <p className="text-4xl font-bold text-muted-foreground">{stringSequence[guideStep]}</p>
                      </div>
                      <ArrowRight className="text-accent w-8 h-8 animate-pulse" />
                      <div className="text-center scale-110">
                        <p className="text-sm text-accent font-bold mb-1">Hacia Pin</p>
                        <p className="text-7xl font-black text-foreground tabular-nums tracking-tighter">
                          {stringSequence[guideStep + 1]}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full max-w-xs mb-8">
                    <div className="flex justify-between text-xs font-semibold text-muted-foreground mb-2">
                      <span>Inicio</span>
                      <span>Paso {guideStep + 1} de {stringSequence.length - 1}</span>
                    </div>
                    <Progress value={((guideStep + 1) / (stringSequence.length - 1)) * 100} className="h-4" />
                  </div>

                  {/* Controls */}
                  <div className="flex gap-4 w-full max-w-sm">
                    <Button
                      onClick={prevStep}
                      disabled={guideStep === 0}
                      variant="outline"
                      size="lg"
                      className="flex-1 gap-2"
                    >
                      <ArrowLeft /> Anterior
                    </Button>
                    <Button
                      onClick={nextStep}
                      disabled={guideStep >= stringSequence.length - 2}
                      size="lg"
                      className="flex-[2] gap-2 btn-primary"
                    >
                      SIGUIENTE <ArrowRight />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StringArtGenerator;
