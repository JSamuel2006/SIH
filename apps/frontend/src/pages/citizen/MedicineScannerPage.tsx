import React, { useState, useEffect, useRef } from 'react';
import {
  Scan,
  Upload,
  Camera,
  RotateCw,
  Sun,
  ShieldAlert,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Plus,
  Compass,
  FileText,
  Search,
  BookOpen,
  Info,
  Check,
  Copy,
  Trash2,
  Download,
  AlertTriangle
} from 'lucide-react';
import CitizenLayout from '../../layouts/CitizenLayout';

interface MedicineScannerInfo {
  medicineName: string;
  genericName: string;
  manufacturer: string;
  strength: string;
  medicineCategory: string;
  prescriptionRequired: boolean;
  uses: string;
  dosage: string;
  administrationMethod: string;
  sideEffects: string[];
  warnings: string[];
  pregnancySafety: string;
  breastfeedingSafety: string;
  childrenSafety: string;
  elderlySafety: string;
  drugInteractions: string[];
  foodInteractions: string[];
  storageInstructions: string;
  expiryGuidance: string;
  emergencyWarnings: string;
  confidenceScore: number;
  medicalDisclaimer: string;
}

interface ScanHistoryItem {
  id: string;
  timestamp: string;
  medicineName: string;
  confidence: number;
  data: MedicineScannerInfo;
  previewUrl?: string;
  detectedText?: string;
}

export default function MedicineScannerPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [detectedText, setDetectedText] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<MedicineScannerInfo | null>(null);
  const [copied, setCopied] = useState(false);

  // Advanced OCR controls
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [blurDetected, setBlurDetected] = useState(false);
  const [useCamera, setUseCamera] = useState(false);

  // History & Bookmarks
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');

  // Audio Playback
  const [speechState, setSpeechState] = useState<'stopped' | 'playing' | 'paused'>('stopped');
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synth = window.speechSynthesis;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load history from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('arogyaverse_scan_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  }, []);

  // Save history helper
  const saveHistory = (newHistory: ScanHistoryItem[]) => {
    setHistory(newHistory);
    try {
      localStorage.setItem('arogyaverse_scan_history', JSON.stringify(newHistory));
    } catch (e) {
      console.error('Failed to save history', e);
    }
  };

  // Camera Access
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (useCamera && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch((err) => {
          console.error("Camera access failed", err);
          setUseCamera(false);
          setErrorMessage("Failed to access camera. Please upload an image instead.");
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [useCamera]);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.filter = `brightness(${brightness}%)`;
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(video, -canvas.width / 2, -canvas.height / 2);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setPreviewUrl(dataUrl);
        setUseCamera(false);
        setErrorMessage(null);
        
        // Convert base64 dataUrl back to a File object for multer
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const file = new File([blob], "captured-medicine.jpg", { type: "image/jpeg" });
            setSelectedFile(file);
          });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Frontend validation
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrorMessage("Invalid file type. Only PNG, JPG, JPEG, and WEBP images are allowed.");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage("File exceeds 10 MB limit.");
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }

      setErrorMessage(null);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanResult(null);
      setDetectedText(null);
      setBlurDetected(false);
    }
  };

  const startScan = async () => {
    if (!selectedFile) {
      setErrorMessage("Please select or capture a medicine strip image first.");
      return;
    }
    setScanning(true);
    setErrorMessage(null);
    setScanResult(null);
    setDetectedText(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('/api/v1/medicine/analyze', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'An error occurred during analysis.');
      }

      const finalData: MedicineScannerInfo = result.data;
      setScanResult(finalData);
      setDetectedText(result.ocr?.detectedText || '');

      // Store preview URL in history if possible (as a data URI if capture or objectURL placeholder)
      let storedUrl = previewUrl || '';
      if (storedUrl.startsWith('blob:')) {
        // Just store blank or standard icon placeholder to avoid leaking memory on page refresh
        storedUrl = '';
      }

      // Add to history
      const historyItem: ScanHistoryItem = {
        id: `scan-${Date.now()}`,
        timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
        medicineName: finalData.medicineName || 'Unknown Medicine',
        confidence: result.ocr?.confidence || finalData.confidenceScore || 1.0,
        data: finalData,
        previewUrl: storedUrl,
        detectedText: result.ocr?.detectedText
      };
      
      saveHistory([historyItem, ...history]);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Connection failure. Please retry.');
    } finally {
      setScanning(false);
    }
  };

  const handleCopy = () => {
    if (!scanResult) return;
    const text = `Medicine: ${scanResult.medicineName}\nGeneric: ${scanResult.genericName}\nManufacturer: ${scanResult.manufacturer}\nStrength: ${scanResult.strength}\nUses: ${scanResult.uses}\nWarnings: ${scanResult.warnings?.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // TTS Speech Synthesis Controls
  const handlePlay = () => {
    if (!scanResult) return;

    if (speechState === 'paused') {
      synth.resume();
      setSpeechState('playing');
      return;
    }

    synth.cancel(); // cancel any active speech first
    const speechText = `${scanResult.medicineName}. Strength ${scanResult.strength}. Category is ${scanResult.medicineCategory}. Main indication: ${scanResult.uses}. Warnings: ${scanResult.warnings?.join('. ') || 'None'}.`;
    const utterance = new SpeechSynthesisUtterance(speechText);
    utteranceRef.current = utterance;

    utterance.onend = () => {
      setSpeechState('stopped');
    };
    utterance.onerror = () => {
      setSpeechState('stopped');
    };

    setSpeechState('playing');
    synth.speak(utterance);
  };

  const handlePause = () => {
    if (speechState === 'playing') {
      synth.pause();
      setSpeechState('paused');
    }
  };

  const handleStop = () => {
    synth.cancel();
    setSpeechState('stopped');
  };

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      synth.cancel();
    };
  }, []);

  const deleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
  };

  const reopenScan = (item: ScanHistoryItem) => {
    setScanResult(item.data);
    setDetectedText(item.detectedText || '');
    if (item.previewUrl) {
      setPreviewUrl(item.previewUrl);
    } else {
      setPreviewUrl(null);
    }
    setErrorMessage(null);
  };

  // Export Data Helpers
  const downloadJSON = () => {
    if (!scanResult) return;
    const blob = new Blob([JSON.stringify(scanResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scanResult.medicineName.replace(/\s+/g, '_')}_analysis.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = () => {
    if (!scanResult) return;
    const headers = 'Field,Value\n';
    const rows = [
      `"Medicine Name","${scanResult.medicineName}"`,
      `"Generic Name","${scanResult.genericName}"`,
      `"Manufacturer","${scanResult.manufacturer}"`,
      `"Strength","${scanResult.strength}"`,
      `"Category","${scanResult.medicineCategory}"`,
      `"Prescription Required","${scanResult.prescriptionRequired ? 'Yes' : 'No'}"`,
      `"Uses","${scanResult.uses}"`,
      `"Storage Instructions","${scanResult.storageInstructions}"`,
    ].join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scanResult.medicineName.replace(/\s+/g, '_')}_analysis.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    if (!scanResult) return;
    const text = `AROGYAVERSE AI — MEDICINE LABEL SCANNER REPORT
==================================================
Date generated: ${new Date().toLocaleString()}

Medicine Details:
--------------------------------------------------
Medicine Name:       ${scanResult.medicineName}
Generic Name:        ${scanResult.genericName}
Manufacturer:        ${scanResult.manufacturer}
Strength:            ${scanResult.strength}
Medicine Category:   ${scanResult.medicineCategory}
Prescription Needed: ${scanResult.prescriptionRequired ? 'Yes' : 'No'}

Indications & Uses:
--------------------------------------------------
${scanResult.uses}

Instructions & Guidance:
--------------------------------------------------
Dosage:              ${scanResult.dosage}
Administration:      ${scanResult.administrationMethod}
Storage:             ${scanResult.storageInstructions}
Expiry Guidance:     ${scanResult.expiryGuidance}

Precautions & Warnings:
--------------------------------------------------
Side Effects:        ${scanResult.sideEffects?.join(', ') || 'None reported'}
Warnings:            ${scanResult.warnings?.join(', ') || 'None'}
Pregnancy Safety:    ${scanResult.pregnancySafety}
Children Safety:     ${scanResult.childrenSafety}
Elderly Safety:      ${scanResult.elderlySafety}

Interactions:
--------------------------------------------------
Drug Interactions:   ${scanResult.drugInteractions?.join(', ') || 'None reported'}
Food Interactions:   ${scanResult.foodInteractions?.join(', ') || 'None reported'}

Emergency Alert:
--------------------------------------------------
${scanResult.emergencyWarnings || 'None'}

==================================================
Medical Disclaimer:
${scanResult.medicalDisclaimer}
`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scanResult.medicineName.replace(/\s+/g, '_')}_report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <CitizenLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Banner */}
        <header className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Scan className="w-5 h-5 text-blue-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 font-sans">Medicine Safety & Label Scanner</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">Upload a strip or capture a labels directly to view precautions, side effects, and child safety parameters (Never diagnoses or prescribes).</p>
        </header>

        {/* Error notification display */}
        {errorMessage && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-xs text-rose-400 shadow">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Scan History Sidebar Drawer */}
          <aside className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-[450px]">
            <div className="space-y-4 overflow-hidden flex flex-col h-full">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Scan Archive</span>
                <span className="text-[10px] text-blue-400 font-mono">{history.length} Saved</span>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search history..."
                  value={searchHistoryQuery}
                  onChange={(e) => setSearchHistoryQuery(e.target.value)}
                  className="w-full bg-slate-950 text-[11px] text-slate-200 border border-slate-850 rounded-lg pl-8 pr-3 py-1.5 focus:outline-none"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 pr-1 text-xs">
                {history.length === 0 ? (
                  <div className="text-center text-slate-500 py-8 text-[11px]">No scan history yet.</div>
                ) : (
                  history.filter(item => item.medicineName.toLowerCase().includes(searchHistoryQuery.toLowerCase())).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => reopenScan(item)}
                      className="p-2 border border-slate-850 hover:bg-slate-800 rounded-xl cursor-pointer flex justify-between items-center transition"
                    >
                      <div className="truncate flex-1 pr-2">
                        <div className="font-semibold text-slate-200 truncate">{item.medicineName}</div>
                        <span className="text-[9px] text-slate-500">{item.timestamp}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteHistoryItem(item.id); }}
                        className="text-slate-500 hover:text-rose-400 p-1 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Scanner Upload/Capture Panel */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between h-[450px]">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-200">Capture or Upload</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg"
                  title="Rotate"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setUseCamera(!useCamera)}
                  className="p-1.5 bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg flex items-center gap-1 text-[10px] font-semibold"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-400" /> Camera
                </button>
              </div>
            </div>

            {/* Main Preview/Camera Canvas */}
            <div className="flex-1 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between overflow-hidden relative">
              {useCamera ? (
                <div className="w-full h-full relative">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <button
                    onClick={capturePhoto}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-500 text-white rounded-full p-3 shadow-lg transition"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
              ) : previewUrl ? (
                <div className="w-full h-full flex items-center justify-center p-4 bg-slate-950">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ transform: `rotate(${rotation}deg)`, filter: `brightness(${brightness}%)` }}
                    className="max-w-full max-h-56 object-contain transition-transform rounded-lg"
                  />
                </div>
              ) : (
                <label className="w-full h-full hover:border-blue-500 cursor-pointer flex flex-col items-center justify-center bg-slate-950 transition">
                  <Upload className="w-8 h-8 text-slate-500 mb-2" />
                  <span className="text-xs text-slate-400">Drag or click to upload label photo</span>
                  <input type="file" onChange={handleFileChange} accept="image/*" className="hidden" />
                </label>
              )}

              {/* Advanced controls overlay */}
              <div className="absolute top-2 right-2 bg-slate-900/90 border border-slate-800 p-2 rounded-lg flex items-center gap-2 text-[10px]">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-16 h-1 rounded"
                />
              </div>

              {blurDetected && (
                <div className="absolute bottom-2 left-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded text-[9px] font-bold">
                  ⚠️ Image blur detected. Re-capture suggested.
                </div>
              )}
            </div>

            <button
              onClick={startScan}
              disabled={scanning || (!selectedFile && !previewUrl)}
              className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Scan className="w-4 h-4" /> {scanning ? 'Analyzing label via AI OCR...' : 'Scan & Extract Medicine Info'}
            </button>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Results Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-[450px]">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-3 text-xs">
              <h3 className="font-bold text-slate-200">Scanner Report</h3>
              {scanResult && (
                <div className="flex items-center gap-2">
                  <button onClick={handleCopy} className="p-1 text-slate-400 hover:text-slate-200 rounded" title="Copy text">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  
                  {/* TTS Speech Synthesis Controls */}
                  <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                    <button onClick={handlePlay} className={`p-1 rounded ${speechState === 'playing' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'}`} title="Play">
                      <Play className="w-3 h-3" />
                    </button>
                    <button onClick={handlePause} className={`p-1 rounded ${speechState === 'paused' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'}`} title="Pause">
                      <Pause className="w-3 h-3" />
                    </button>
                    <button onClick={handleStop} className="p-1 text-slate-400 hover:text-slate-200 rounded" title="Stop">
                      <Square className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md font-mono font-bold text-[9px]">
                    {Math.round(scanResult.confidenceScore * 100)}% Conf
                  </span>
                </div>
              )}
            </div>

            {scanResult ? (
              <div className="space-y-4 flex-1 text-xs overflow-y-auto pr-1">
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{scanResult.medicineName} ({scanResult.strength})</h4>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Generic: {scanResult.genericName} | Mfg: {scanResult.manufacturer}</span>
                  <span className="text-[10px] text-slate-400 block">Category: {scanResult.medicineCategory} | Rx: {scanResult.prescriptionRequired ? 'Prescription Required' : 'OTC'}</span>
                </div>

                {detectedText && (
                  <div className="p-2 bg-slate-950 rounded-lg border border-slate-850">
                    <span className="text-slate-500 font-semibold block text-[10px]">Detected OCR Text:</span>
                    <p className="text-slate-400 font-mono text-[9px] break-words line-clamp-3">{detectedText}</p>
                  </div>
                )}

                <div>
                  <h5 className="font-bold text-slate-350">Indicated Uses:</h5>
                  <p className="text-slate-400 leading-relaxed mt-0.5">{scanResult.uses}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 bg-slate-950/60 border border-slate-850 rounded-lg">
                    <span className="text-slate-500 font-semibold block text-[10px]">Child Safety</span>
                    <span className="text-slate-300 block mt-0.5">{scanResult.childrenSafety}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950/60 border border-slate-850 rounded-lg">
                    <span className="text-slate-500 font-semibold block text-[10px]">Pregnancy Warning</span>
                    <span className="text-rose-400 block mt-0.5">{scanResult.pregnancySafety}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-500/5 border border-amber-500/20 rounded-lg flex items-start gap-1.5">
                  <Info className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-amber-500 font-semibold block">Informational Dosage</span>
                    <span className="text-slate-300 block mt-0.5">{scanResult.dosage}</span>
                  </div>
                </div>

                {scanResult.emergencyWarnings && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-rose-500 font-semibold block">Emergency warning</span>
                      <span className="text-slate-300 block mt-0.5">{scanResult.emergencyWarnings}</span>
                    </div>
                  </div>
                )}

                {/* Downloads section */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <span className="text-slate-500 text-[10px] font-semibold">Download Report:</span>
                  <button onClick={downloadPDF} className="p-1 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded flex items-center gap-1 text-[10px]">
                    <Download className="w-3 h-3 text-blue-400" /> PDF/Txt
                  </button>
                  <button onClick={downloadJSON} className="p-1 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded flex items-center gap-1 text-[10px]">
                    <Download className="w-3 h-3 text-amber-400" /> JSON
                  </button>
                  <button onClick={downloadCSV} className="p-1 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded flex items-center gap-1 text-[10px]">
                    <Download className="w-3 h-3 text-emerald-400" /> CSV
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs py-8">
                <BookOpen className="w-8 h-8 mb-2 text-slate-600" />
                Upload a strip and scan to view pharmacological safety intelligence.
              </div>
            )}

            <div className="text-[9px] text-slate-500 border-t border-slate-800 pt-2.5 mt-3 flex items-center gap-1 justify-center">
              <span>Verified Sources: IP, NFI, CDSCO Guidelines.</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <footer className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3 text-xs text-amber-300 shadow">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>{scanResult?.medicalDisclaimer || 'ArogyaVerse AI does not recommend or prescribe dosages. This scanner is purely for health education and public safety awareness. Contact a doctor for prescriptions.'}</span>
        </footer>
      </div>
    </CitizenLayout>
  );
}
