import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  AlertTriangle, 
  Volume2, 
  Clock, 
  Gauge, 
  FileText, 
  RotateCcw,
  Bot,
  Zap,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { PresentationDeck, Slide, RehearsalSession, WpmDataPoint, FillerOccurrence, SlidePerformance, TranscriptSegment } from '../../types';

interface LiveRehearsalStudioProps {
  activeDeck: PresentationDeck;
  onFinishSession: (session: RehearsalSession) => void;
  onSwitchDeck: () => void;
}

const COMMON_FILLERS = ['um', 'uh', 'like', 'basically', 'actually', 'you know'];

const SAMPLE_DEMO_SPEECH_STREAM = [
  { word: "Good", time: 0.5, slide: 1 },
  { word: "morning", time: 1.0, slide: 1 },
  { word: "partners.", time: 1.5, slide: 1 },
  { word: "Over", time: 2.3, slide: 1 },
  { word: "420,000", time: 2.8, slide: 1 },
  { word: "warehouses", time: 3.5, slide: 1 },
  { word: "operate", time: 4.1, slide: 1 },
  { word: "under", time: 4.6, slide: 1 },
  { word: "severe", time: 5.2, slide: 1 },
  { word: "constraint.", time: 5.8, slide: 1 },
  { word: "This", time: 7.0, slide: 1 },
  { word: "is", time: 7.4, slide: 1 },
  { word: "an", time: 7.8, slide: 1 },
  { word: "enduring", time: 8.3, slide: 1 },
  { word: "$85B", time: 9.0, slide: 1 },
  { word: "annual", time: 9.6, slide: 1 },
  { word: "deadweight", time: 10.3, slide: 1 },
  { word: "loss.", time: 11.0, slide: 1 },
  { word: "Legacy", time: 13.0, slide: 1 },
  { word: "carriers", time: 13.7, slide: 1 },
  { word: "require", time: 14.3, slide: 1 },
  { word: "magnetic", time: 14.8, slide: 1 },
  { word: "tape,", time: 15.3, slide: 1 },
  { word: "and", time: 16.0, slide: 1 },
  { word: "um...", time: 16.6, slide: 1, isFiller: 'um' },
  { word: "this", time: 17.5, slide: 1 },
  { word: "freezes", time: 18.0, slide: 1 },
  { word: "productivity.", time: 18.8, slide: 1 },
  // Slide 2 transition
  { word: "We", time: 21.0, slide: 2 },
  { word: "built", time: 21.4, slide: 2 },
  { word: "Aura", time: 21.9, slide: 2 },
  { word: "OS:", time: 22.4, slide: 2 },
  { word: "zero-infrastructure", time: 23.2, slide: 2 },
  { word: "spatial", time: 24.1, slide: 2 },
  { word: "intelligence", time: 24.8, slide: 2 },
  { word: "at", time: 25.3, slide: 2 },
  { word: "60", time: 25.8, slide: 2 },
  { word: "frames", time: 26.3, slide: 2 },
  { word: "per", time: 26.7, slide: 2 },
  { word: "second.", time: 27.2, slide: 2 },
  { word: "Deployments", time: 29.0, slide: 2 },
  { word: "take", time: 29.5, slide: 2 },
  { word: "hours,", time: 30.1, slide: 2 },
  { word: "not", time: 30.6, slide: 2 },
  { word: "six", time: 31.0, slide: 2 },
  { word: "months.", time: 31.6, slide: 2 },
  // Slide 3 transition
  { word: "Today", time: 34.0, slide: 3 },
  { word: "we", time: 34.4, slide: 3 },
  { word: "have", time: 34.8, slide: 3 },
  { word: "$3.4M", time: 35.3, slide: 3 },
  { word: "contracted", time: 36.0, slide: 3 },
  { word: "ARR,", time: 36.6, slide: 3 },
  { word: "and", time: 37.2, slide: 3 },
  { word: "basically", time: 37.8, slide: 3, isFiller: 'basically' },
  { word: "Tier", time: 38.6, slide: 3 },
  { word: "one", time: 39.0, slide: 3 },
  { word: "logistics", time: 39.5, slide: 3 },
  { word: "accounts", time: 40.0, slide: 3 },
  { word: "grew", time: 40.5, slide: 3 },
  { word: "140%", time: 41.2, slide: 3 },
  { word: "quarter", time: 41.7, slide: 3 },
  { word: "over", time: 42.1, slide: 3 },
  { word: "quarter.", time: 42.7, slide: 3 }
];

export const LiveRehearsalStudio: React.FC<LiveRehearsalStudioProps> = ({
  activeDeck,
  onFinishSession,
  onSwitchDeck
}) => {
  // Session State
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideElapsedTime, setSlideElapsedTime] = useState(0);

  // Settings & Toggles
  const [useSimulatedMode, setUseSimulatedMode] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [teleprompterSize, setTeleprompterSize] = useState<'normal' | 'large'>('normal');
  const [autoScrollScript, setAutoScrollScript] = useState(true);

  // Real-time Metrics
  const [currentWpm, setCurrentWpm] = useState(138);
  const [audioLevel, setAudioLevel] = useState(0.45); // 0 to 1
  const [totalWordCount, setTotalWordCount] = useState(0);
  const [fillerCounts, setFillerCounts] = useState<Record<string, number>>({
    um: 0,
    uh: 0,
    like: 0,
    basically: 0,
    actually: 0,
    'you know': 0
  });
  const [lastFillerAlert, setLastFillerAlert] = useState<{ word: string; time: number } | null>(null);

  // Streaming Transcript
  const [transcriptSegments, setTranscriptSegments] = useState<string[]>([]);
  const [liveSpokenText, setLiveSpokenText] = useState<string>('');

  // AI Micro-Nudge HUD
  const [coachNudge, setCoachNudge] = useState<{
    type: 'positive' | 'warning' | 'tip';
    message: string;
    timestamp: number;
  }>({
    type: 'positive',
    message: 'Ready to rehearse. Speak naturally into your microphone.',
    timestamp: Date.now()
  });

  // Recorded time series for final session generation
  const recordedWpmTimeline = useRef<WpmDataPoint[]>([]);
  const recordedFillers = useRef<FillerOccurrence[]>([]);
  const slideTimeTrackers = useRef<Record<number, { duration: number; words: number; fillers: number }>>({});
  const fullTranscriptRef = useRef<string>('');

  // Media references
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const speechRecognitionRef = useRef<any>(null);
  const scriptContainerRef = useRef<HTMLDivElement | null>(null);

  const currentSlide: Slide = activeDeck.slides[currentSlideIndex] || activeDeck.slides[0];

  // Helper: Trigger coach nudge
  const triggerCoachNudge = useCallback((type: 'positive' | 'warning' | 'tip', message: string) => {
    setCoachNudge({ type, message, timestamp: Date.now() });
  }, []);

  // Web Audio API initialization
  const startRealAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      mediaStreamRef.current = stream;
      
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      // Start Web Speech API if supported
      initSpeechRecognition();
    } catch (err) {
      console.warn('Microphone permission denied or not available, defaulting to synthesized mode:', err);
      setUseSimulatedMode(true);
      triggerCoachNudge('tip', 'Microphone not available; using Demo Pitch Simulation mode.');
    }
  };

  // Browser Speech Recognition setup
  const initSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = true;
      recognizer.interimResults = true;
      recognizer.lang = 'en-US';

      recognizer.onresult = (event: any) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const phrase = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            handleFinalSpeechChunk(phrase);
          } else {
            interimText += phrase;
          }
        }
        setLiveSpokenText(interimText);
      };

      recognizer.onerror = (e: any) => {
        console.warn('Speech recognition warning:', e.error);
      };

      recognizer.start();
      speechRecognitionRef.current = recognizer;
    } catch (e) {
      console.warn('Could not start speech recognition:', e);
    }
  };

  const handleFinalSpeechChunk = (chunk: string) => {
    const trimmed = chunk.trim();
    if (!trimmed) return;

    setTranscriptSegments(prev => [...prev, trimmed]);
    fullTranscriptRef.current += (fullTranscriptRef.current ? ' ' : '') + trimmed;

    // Word count & WPM estimation
    const words = trimmed.split(/\s+/).filter(Boolean);
    const count = words.length;
    setTotalWordCount(prev => prev + count);

    // Track for current slide
    if (!slideTimeTrackers.current[currentSlide.slideNumber]) {
      slideTimeTrackers.current[currentSlide.slideNumber] = { duration: 0, words: 0, fillers: 0 };
    }
    slideTimeTrackers.current[currentSlide.slideNumber].words += count;

    // Filler word detection
    const lower = trimmed.toLowerCase();
    COMMON_FILLERS.forEach(filler => {
      const regex = new RegExp(`\\b${filler}\\b`, 'gi');
      const matches = lower.match(regex);
      if (matches) {
        const occurrences = matches.length;
        setFillerCounts(prev => ({
          ...prev,
          [filler]: (prev[filler] || 0) + occurrences
        }));
        setLastFillerAlert({ word: filler, time: Date.now() });

        recordedFillers.current.push({
          id: `fill-${Date.now()}-${filler}`,
          word: filler,
          timestampSec: elapsedSec,
          slideNumber: currentSlide.slideNumber,
          contextPhrase: trimmed
        });

        slideTimeTrackers.current[currentSlide.slideNumber].fillers += occurrences;

        triggerCoachNudge('warning', `Filler detected: "${filler}". Try replacing holding sounds with a calm pause.`);
      }
    });
  };

  // Canvas visualizer loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let bars = 28;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let dataArray = new Uint8Array(bars);
      if (analyserRef.current && isRecording && !isPaused && isMicEnabled) {
        analyserRef.current.getByteFrequencyData(dataArray);
        // Compute root mean square for audio level
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / (dataArray.length * 255);
        setAudioLevel(avg);
      } else if (isRecording && !isPaused) {
        // Synthesized audio wave when running simulation
        const time = Date.now() / 200;
        for (let i = 0; i < bars; i++) {
          dataArray[i] = Math.max(20, Math.floor(120 + Math.sin(time + i * 0.4) * 80 + Math.cos(time * 0.7) * 35));
        }
        setAudioLevel(0.48 + Math.sin(Date.now() / 400) * 0.2);
      } else {
        // Idle state wave
        for (let i = 0; i < bars; i++) {
          dataArray[i] = 12;
        }
        setAudioLevel(0.08);
      }

      const barWidth = (canvas.width / bars) - 2;
      for (let i = 0; i < bars; i++) {
        const barHeight = Math.max(4, (dataArray[i] / 255) * (canvas.height - 8));
        const x = i * (barWidth + 2);
        const y = (canvas.height - barHeight) / 2;

        // Gradient from Indigo (#4F46E5) to Purple (#7C3AED)
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        if (audioLevel > 0.85) {
          gradient.addColorStop(0, '#EF4444');
          gradient.addColorStop(1, '#F59E0B');
        } else {
          gradient.addColorStop(0, '#7C3AED');
          gradient.addColorStop(1, '#4F46E5');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRecording, isPaused, isMicEnabled, audioLevel]);

  // Session elapsed timer and WPM sampler
  useEffect(() => {
    let timer: any = null;
    if (isRecording && !isPaused) {
      timer = setInterval(() => {
        setElapsedSec(prev => {
          const next = prev + 1;
          setSlideElapsedTime(sPrev => sPrev + 1);

          // Update current slide tracker
          if (!slideTimeTrackers.current[currentSlide.slideNumber]) {
            slideTimeTrackers.current[currentSlide.slideNumber] = { duration: 0, words: 0, fillers: 0 };
          }
          slideTimeTrackers.current[currentSlide.slideNumber].duration += 1;

          // Estimate dynamic WPM
          if (next % 3 === 0) {
            let dynamicWpm = 138;
            if (useSimulatedMode) {
              // Simulated natural variation
              const base = activeDeck.targetWPM;
              const variance = Math.sin(next / 4) * 16 + (next > 35 && next < 45 ? 24 : 0);
              dynamicWpm = Math.round(base + variance);
            } else {
              const minutes = Math.max(0.2, next / 60);
              const computed = Math.round(totalWordCount / minutes);
              dynamicWpm = computed > 40 ? Math.min(220, computed) : 136;
            }

            setCurrentWpm(dynamicWpm);

            const isRushing = dynamicWpm > 160;
            const isDragging = dynamicWpm < 120;

            recordedWpmTimeline.current.push({
              timestampSec: next,
              wpm: dynamicWpm,
              slideNumber: currentSlide.slideNumber,
              isRushing,
              isDragging
            });

            // Dynamic coach nudges based on pacing
            if (isRushing) {
              triggerCoachNudge('warning', `⚡ Pacing reached ${dynamicWpm} WPM. Take a 1-second pause at the next comma.`);
            } else if (isDragging) {
              triggerCoachNudge('tip', `🐢 Cadence at ${dynamicWpm} WPM. Add forward propulsion to keep audience locked in.`);
            } else if (dynamicWpm >= 135 && dynamicWpm <= 145 && next % 12 === 0) {
              triggerCoachNudge('positive', `🌟 Stellar executive cadence (${dynamicWpm} WPM). Perfectly measured.`);
            }
          }

          return next;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording, isPaused, currentSlide, totalWordCount, useSimulatedMode, activeDeck.targetWPM, triggerCoachNudge]);

  // Demo Pitch Simulation speech stream
  useEffect(() => {
    let simTimer: any = null;
    if (isRecording && !isPaused && useSimulatedMode) {
      let wordIndex = 0;
      simTimer = setInterval(() => {
        if (wordIndex < SAMPLE_DEMO_SPEECH_STREAM.length) {
          const item = SAMPLE_DEMO_SPEECH_STREAM[wordIndex];
          handleFinalSpeechChunk(item.word);
          wordIndex++;

          // Auto advance slide in simulation if stream moves to next slide
          if (item.slide && item.slide > currentSlide.slideNumber && currentSlideIndex < activeDeck.slides.length - 1) {
            handleNextSlide();
          }
        }
      }, 550);
    }
    return () => {
      if (simTimer) clearInterval(simTimer);
    };
  }, [isRecording, isPaused, useSimulatedMode, currentSlideIndex]);

  // Webcam stream management
  useEffect(() => {
    if (isCameraActive) {
      navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.warn('Webcam not permitted or available:', err);
          setIsCameraActive(false);
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
        videoRef.current.srcObject = null;
      }
    }
  }, [isCameraActive]);

  // Auto scroll script notes
  useEffect(() => {
    if (autoScrollScript && scriptContainerRef.current && isRecording && !isPaused) {
      const scrollStep = 0.5;
      const interval = setInterval(() => {
        if (scriptContainerRef.current) {
          scriptContainerRef.current.scrollTop += scrollStep;
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [autoScrollScript, isRecording, isPaused]);

  // Recording control handlers
  const handleStartSession = () => {
    setIsRecording(true);
    setIsPaused(false);
    triggerCoachNudge('positive', `Rehearsing Slide 1: "${currentSlide.title}". Establish early eye contact.`);
    if (!useSimulatedMode) {
      startRealAudio();
    }
  };

  const handlePauseResume = () => {
    setIsPaused(prev => !prev);
    if (!isPaused) {
      triggerCoachNudge('tip', 'Rehearsal paused. Take a breath and review your notes.');
    } else {
      triggerCoachNudge('positive', 'Resumed. Pick up momentum.');
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < activeDeck.slides.length - 1) {
      const nextIdx = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIdx);
      setSlideElapsedTime(0);
      const nextSlide = activeDeck.slides[nextIdx];
      triggerCoachNudge('tip', `Transitioned to Slide ${nextSlide.slideNumber}: ${nextSlide.title}. Target pace: ${nextSlide.recommendedPaceWPM} WPM.`);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      const prevIdx = currentSlideIndex - 1;
      setCurrentSlideIndex(prevIdx);
      setSlideElapsedTime(0);
    }
  };

  const handleFinishSession = () => {
    // Stop streams
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch (e) {}
    }

    // Build Slide Performance objects
    const performances: SlidePerformance[] = activeDeck.slides.map(slide => {
      const tracked = slideTimeTrackers.current[slide.slideNumber] || { duration: 0, words: 0, fillers: 0 };
      const actualDuration = Math.max(5, tracked.duration || Math.round(slide.targetDurationSec * 0.95));
      const words = tracked.words || Math.round((actualDuration / 60) * slide.recommendedPaceWPM);
      const averageWpm = Math.round((words / Math.max(0.1, actualDuration / 60)));
      const fillers = tracked.fillers || 0;
      
      const paceDrift = Math.round(((averageWpm - slide.recommendedPaceWPM) / slide.recommendedPaceWPM) * 100);
      let status: 'Optimal' | 'Rushed' | 'Overtime' | 'Monotone' = 'Optimal';
      let score = 92;

      if (paceDrift > 14) {
        status = 'Rushed';
        score = 84;
      } else if (actualDuration > slide.targetDurationSec * 1.25) {
        status = 'Overtime';
        score = 82;
      } else if (fillers > 2) {
        score = 85;
      }

      return {
        slideNumber: slide.slideNumber,
        slideTitle: slide.title,
        actualDurationSec: actualDuration,
        targetDurationSec: slide.targetDurationSec,
        averageWpm,
        targetWpm: slide.recommendedPaceWPM,
        fillerWordCount: fillers,
        score,
        status,
        pacingDriftPercent: paceDrift,
        aiCoachingNote: fillers > 0 
          ? `Detected ${fillers} verbal hesitations. Slow down transitions.` 
          : `Delivered with high clarity and steady tempo.`
      };
    });

    const totalFillers = Object.values(fillerCounts).reduce((a, b) => a + b, 0);
    const sessionDuration = Math.max(25, elapsedSec);
    const totalWords = Math.max(45, totalWordCount || Math.round((sessionDuration / 60) * 140));
    const avgWpm = Math.round((totalWords / (sessionDuration / 60)));

    // Calculate executive score
    let executiveScore = 90;
    if (avgWpm > 165 || avgWpm < 120) executiveScore -= 8;
    if (totalFillers > 5) executiveScore -= Math.min(15, totalFillers * 2);
    executiveScore = Math.max(65, Math.min(98, executiveScore));

    // Construct synthesized transcript segments if speech was sparse
    const segments: TranscriptSegment[] = transcriptSegments.length > 0 
      ? transcriptSegments.map((t, idx) => ({
          id: `seg-${idx}`,
          text: t,
          timestampSec: Math.round((idx / transcriptSegments.length) * sessionDuration),
          endTimestampSec: Math.round(((idx + 1) / transcriptSegments.length) * sessionDuration),
          slideNumber: Math.min(activeDeck.slides.length, Math.floor((idx / transcriptSegments.length) * activeDeck.slides.length) + 1),
          wpm: avgWpm + (idx % 2 === 0 ? 5 : -5),
          category: t.toLowerCase().includes('um') || t.toLowerCase().includes('like') ? 'filler' : 'normal'
        }))
      : [
          {
            id: 'seg-1',
            text: 'Opening narrative delivered with clear executive presence and problem validation.',
            timestampSec: 0,
            endTimestampSec: 15,
            slideNumber: 1,
            wpm: 136,
            category: 'high-impact'
          },
          {
            id: 'seg-2',
            text: 'Key metric walkthrough was steady, though cadence accelerated slightly during unit economics.',
            timestampSec: 16,
            endTimestampSec: sessionDuration,
            slideNumber: 2,
            wpm: avgWpm,
            category: 'normal'
          }
        ];

    const completedSession: RehearsalSession = {
      id: `session-${Date.now()}`,
      deckId: activeDeck.id,
      deckTitle: activeDeck.title,
      recordedAt: new Date().toISOString(),
      durationSec: sessionDuration,
      totalWords,
      overallScore: executiveScore,
      metrics: {
        averageWpm: avgWpm,
        targetWpm: activeDeck.targetWPM,
        wpmVariance: 14,
        optimalPacingPercentage: avgWpm >= 130 && avgWpm <= 155 ? 86 : 68,
        fillerCount: totalFillers,
        fillerRatePerMinute: Number(((totalFillers / (sessionDuration / 60))).toFixed(2)),
        fillerBreakdown: { ...fillerCounts },
        vocalVarietyScore: 82,
        monotoneRisk: 'Low',
        pauseMasteryScore: 88,
        deliberatePausesCount: Math.round(sessionDuration / 25),
        awkwardPausesCount: Math.max(0, totalFillers - 2),
        clarityScore: 92,
        energyScore: 88
      },
      wpmTimeline: recordedWpmTimeline.current.length > 0 
        ? recordedWpmTimeline.current 
        : [
            { timestampSec: 10, wpm: 135, slideNumber: 1, isRushing: false, isDragging: false },
            { timestampSec: 25, wpm: 142, slideNumber: 1, isRushing: false, isDragging: false },
            { timestampSec: sessionDuration, wpm: avgWpm, slideNumber: currentSlide.slideNumber, isRushing: false, isDragging: false }
          ],
      fillerOccurrences: recordedFillers.current,
      slidePerformances: performances,
      transcriptSegments: segments,
      fullTranscript: fullTranscriptRef.current || `Rehearsal transcript of ${activeDeck.title}.`,
      aiCritique: {
        executiveHeadline: executiveScore >= 90 
          ? 'Commanding, pitch-ready delivery with rhythmic clarity.' 
          : 'Solid foundational pacing with targeted opportunities to eliminate verbal hesitations.',
        summary: `Your rehearsal of "${activeDeck.title}" clocked in at ${Math.floor(sessionDuration / 60)}m ${sessionDuration % 60}s with an average tempo of ${avgWpm} WPM. Pacing stayed consistent with clear inflection.`,
        strengths: [
          'Strong vocal gravitas on core thesis statements.',
          'Fluid slide transitions without awkward dead air.',
          'Clear cadence control on high-stakes slide numbers.'
        ],
        priorityFixes: [
          totalFillers > 0 
            ? `Eliminate ${totalFillers} filler words by embracing silent pauses.` 
            : 'Maintain current zero-filler discipline under investor pressure.',
          'Hold 2-second silence after stating valuation and round size.',
          'Keep breathing through your diaphragm to avoid rushing during traction metrics.'
        ],
        recommendedDrills: [
          {
            id: 'drill-fin-1',
            title: 'The Unflinching Ask Drill',
            targetSkill: 'Power Pauses',
            durationMinutes: 3,
            instructions: [
              'Take a slow breath through your diaphragm.',
              'Deliver the closing ask with a deliberate downward inflection.',
              'Hold 2 full seconds of eye contact in silence.'
            ],
            sampleSentence: 'We are raising fourteen million dollars to scale US deployments and execute our 18-month roadmap.'
          }
        ]
      }
    };

    onFinishSession(completedSession);
  };

  // Cadence speed gauge status
  const getCadenceColor = (wpm: number) => {
    if (wpm < 120) return 'text-sky-600 bg-sky-50 border-sky-200';
    if (wpm >= 130 && wpm <= 155) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (wpm > 155 && wpm <= 170) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  const getCadenceLabel = (wpm: number) => {
    if (wpm < 120) return 'Dragging Tempo';
    if (wpm >= 120 && wpm < 130) return 'Moderate Pace';
    if (wpm >= 130 && wpm <= 155) return 'Optimal Flow (Sweet Spot)';
    if (wpm > 155 && wpm <= 170) return 'Slightly Rushing';
    return 'Severe Rushing!';
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">

      {/* Top Rehearsal Bar: Deck Info, Controls, Live Status */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 sm:p-5 card-shadow flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Deck title and slide position */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-12 h-12 rounded-xl bg-[#eaedff] border border-[#dad7ff] flex flex-col items-center justify-center text-[#3525cd] font-bold">
            <span className="text-xs uppercase text-[#777587]">Slide</span>
            <span className="text-lg leading-none">{currentSlide.slideNumber}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-heading font-bold text-lg text-[#131b2e] leading-snug">
                {activeDeck.title}
              </h2>
              <button 
                onClick={onSwitchDeck}
                className="text-xs text-[#4f46e5] hover:underline font-semibold"
              >
                Change
              </button>
            </div>
            <p className="text-xs text-[#777587] flex items-center gap-2 mt-0.5">
              <span>Target: {formatTime(activeDeck.targetDurationTotalSec)}</span>
              <span>•</span>
              <span>Slide {currentSlideIndex + 1} of {activeDeck.slides.length}</span>
              <span>•</span>
              <span>Target Pace: {currentSlide.recommendedPaceWPM} WPM</span>
            </p>
          </div>
        </div>

        {/* Center: Live Session Timer & Word Counter */}
        <div className="flex items-center gap-6 bg-[#faf8ff] border border-[#e2e7ff] px-5 py-2.5 rounded-xl w-full md:w-auto justify-around">
          <div>
            <div className="text-[11px] font-semibold text-[#777587] uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#3525cd]" />
              Session Time
            </div>
            <div className="text-2xl font-bold font-heading text-[#131b2e] tabular-nums">
              {formatTime(elapsedSec)}
            </div>
          </div>
          <div className="h-8 w-px bg-[#e2e7ff]" />
          <div>
            <div className="text-[11px] font-semibold text-[#777587] uppercase tracking-wider flex items-center gap-1">
              <Gauge className="w-3 h-3 text-[#712ae2]" />
              Words Spoken
            </div>
            <div className="text-2xl font-bold font-heading text-[#131b2e] tabular-nums">
              {totalWordCount}
            </div>
          </div>
          <div className="h-8 w-px bg-[#e2e7ff]" />
          <div>
            <div className="text-[11px] font-semibold text-[#777587] uppercase tracking-wider">
              Slide Target
            </div>
            <div className="text-base font-bold text-[#464555] tabular-nums">
              {formatTime(slideElapsedTime)} / {formatTime(currentSlide.targetDurationSec)}
            </div>
          </div>
        </div>

        {/* Right: Master Rehearsal Controls */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          {!isRecording ? (
            <button
              onClick={handleStartSession}
              className="btn-primary-gradient text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Rehearsal</span>
            </button>
          ) : (
            <>
              <button
                onClick={handlePauseResume}
                className="bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#131b2e] px-3.5 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <button
                onClick={handleFinishSession}
                className="bg-[#10B981] hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Finish & Analyze</span>
              </button>
            </>
          )}

          {/* Mode Selector Toggle: Real Mic vs Demo Simulation */}
          <button
            onClick={() => setUseSimulatedMode(prev => !prev)}
            title="Toggle between Real Mic and Simulated Speech Stream"
            className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
              useSimulatedMode
                ? 'bg-[#EEF2FF] border-[#4F46E5] text-[#4F46E5]'
                : 'bg-white border-[#E2E8F0] text-[#777587] hover:text-[#131b2e]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{useSimulatedMode ? 'Demo Pitch Active' : 'Real Mic'}</span>
          </button>
        </div>

      </div>

      {/* Main Studio Grid: Left Canvas/Teleprompter, Right Real-time Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN: Slide Visual, Teleprompter & Live Waveform (7 cols) */}
        <div className="lg:col-span-7 space-y-5">

          {/* Current Slide Card & Teleprompter Notes */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] card-shadow overflow-hidden">
            {/* Slide Header */}
            <div className="bg-gradient-to-r from-[#1E1B4B] to-[#312E81] text-white p-5 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#a5b4fc] bg-white/10 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  Slide {currentSlide.slideNumber} of {activeDeck.slides.length}
                </span>
                <h3 className="font-heading text-xl font-bold tracking-tight text-white">
                  {currentSlide.title}
                </h3>
                {currentSlide.subtitle && (
                  <p className="text-xs text-indigo-200 mt-0.5">
                    {currentSlide.subtitle}
                  </p>
                )}
              </div>

              {/* Slide Navigation Buttons */}
              <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl">
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent text-white transition-all cursor-pointer"
                  title="Previous Slide (Left Arrow)"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold px-2">
                  {currentSlideIndex + 1}/{activeDeck.slides.length}
                </span>
                <button
                  onClick={handleNextSlide}
                  disabled={currentSlideIndex === activeDeck.slides.length - 1}
                  className="p-1.5 rounded-lg hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent text-white transition-all cursor-pointer"
                  title="Next Slide (Right Arrow)"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Key Takeaway Banner */}
            <div className="bg-[#f2f3ff] border-b border-[#dae2fd] px-5 py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#3525cd]">Core Anchor:</span>
                <span className="text-[#464555] font-medium">{currentSlide.keyTakeaway}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTeleprompterSize(prev => prev === 'normal' ? 'large' : 'normal')}
                  className="text-[11px] font-semibold text-[#777587] hover:text-[#131b2e] flex items-center gap-1"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{teleprompterSize === 'normal' ? 'Enlarge' : 'Standard'}</span>
                </button>
              </div>
            </div>

            {/* Teleprompter Script Notes Content */}
            <div 
              ref={scriptContainerRef}
              className={`p-6 overflow-y-auto transition-all ${
                teleprompterSize === 'large' ? 'h-56 text-lg leading-relaxed' : 'h-44 text-sm leading-normal'
              }`}
            >
              <div className="text-[#131b2e] font-sans whitespace-pre-line select-text">
                {currentSlide.scriptNotes}
              </div>
            </div>

            {/* Slide Progress Meter */}
            <div className="px-5 py-3 bg-[#faf8ff] border-t border-[#E2E8F0] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#777587]">
                <span>Pacing Guide:</span>
                <span className="font-semibold text-[#3525cd]">{currentSlide.recommendedPaceWPM} WPM</span>
              </div>
              <div className="w-44 bg-[#e2e7ff] h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 rounded-full ${
                    slideElapsedTime > currentSlide.targetDurationSec ? 'bg-amber-500' : 'btn-primary-gradient'
                  }`}
                  style={{ width: `${Math.min(100, (slideElapsedTime / currentSlide.targetDurationSec) * 100)}%` }}
                />
              </div>
              <span className={`font-semibold tabular-nums ${
                slideElapsedTime > currentSlide.targetDurationSec ? 'text-amber-600' : 'text-[#464555]'
              }`}>
                {formatTime(slideElapsedTime)} / {formatTime(currentSlide.targetDurationSec)}
              </span>
            </div>
          </div>

          {/* Live Waveform & Audio Meter Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
                <span className="font-heading font-semibold text-sm text-[#131b2e]">
                  Vocal Spectrum & Dynamic Waveform
                </span>
              </div>

              {/* Audio Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMicEnabled(prev => !prev)}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isMicEnabled ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-red-50 text-red-600'
                  }`}
                >
                  {isMicEnabled ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                  <span>{isMicEnabled ? 'Input Active' : 'Muted'}</span>
                </button>

                <button
                  onClick={() => setIsCameraActive(prev => !prev)}
                  className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCameraActive ? 'bg-[#EEF2FF] text-[#4F46E5]' : 'bg-slate-100 text-[#777587]'
                  }`}
                >
                  {isCameraActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5" />}
                  <span>{isCameraActive ? 'Camera On' : 'Mirror'}</span>
                </button>
              </div>
            </div>

            {/* Audio Waveform Canvas */}
            <div className="bg-[#0f172a] rounded-xl p-3 flex items-center justify-center relative overflow-hidden h-28 shadow-inner">
              <canvas
                ref={canvasRef}
                width={560}
                height={96}
                className="w-full h-full block"
              />

              {/* Decibel / Clipping Indicator Pill */}
              <div className="absolute top-2 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] text-white">
                <Volume2 className="w-3 h-3 text-[#10B981]" />
                <span>Level:</span>
                <span className={`font-semibold tabular-nums ${audioLevel > 0.8 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {Math.round(audioLevel * 100)}%
                </span>
                {audioLevel > 0.85 && (
                  <span className="text-red-400 font-bold animate-pulse">CLIPPING</span>
                )}
              </div>
            </div>

            {/* Webcam Mirror Preview (If toggled on) */}
            {isCameraActive && (
              <div className="relative rounded-xl overflow-hidden border border-[#dae2fd] bg-black aspect-video max-h-48 flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform -scale-x-100"
                />
                {/* Visual Eye-Contact Guide lines */}
                <div className="absolute inset-0 pointer-events-none border border-dashed border-white/20 m-6 rounded-lg flex items-center justify-center">
                  <span className="text-[10px] font-semibold text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
                    Eye Contact Horizon Line
                  </span>
                </div>
              </div>
            )}

            {/* Live Streaming Transcript Feed */}
            <div className="bg-[#faf8ff] rounded-xl border border-[#e2e7ff] p-3 text-xs min-h-[52px]">
              <div className="text-[10px] uppercase font-bold text-[#777587] mb-1">
                Live Speech Stream
              </div>
              <p className="text-[#131b2e] italic">
                {liveSpokenText ? (
                  `"... ${liveSpokenText} ..."`
                ) : transcriptSegments.length > 0 ? (
                  `"... ${transcriptSegments[transcriptSegments.length - 1]} ..."`
                ) : (
                  <span className="text-[#777587]">
                    Listening for voice input... Speak your script or tap "Start Rehearsal".
                  </span>
                )}
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Cadence Gauge, Filler Word Counter & AI Coach HUD (5 cols) */}
        <div className="lg:col-span-5 space-y-5">

          {/* Real-time Cadence Speedometer Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777587]">
                  Speech Velocity
                </span>
                <h4 className="font-heading font-bold text-base text-[#131b2e]">
                  Live Cadence & WPM
                </h4>
              </div>
              
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCadenceColor(currentWpm)}`}>
                {getCadenceLabel(currentWpm)}
              </div>
            </div>

            {/* WPM Big Display & Dial */}
            <div className="text-center py-2">
              <div className="inline-flex items-baseline gap-2">
                <span className="font-heading font-extrabold text-5xl text-[#131b2e] tabular-nums tracking-tight">
                  {currentWpm}
                </span>
                <span className="text-sm font-semibold text-[#777587]">WPM</span>
              </div>
              <p className="text-xs text-[#777587] mt-1">
                Target Executive Band: <span className="font-bold text-[#3525cd]">130 – 155 WPM</span>
              </p>
            </div>

            {/* High-Performance Linear Cadence Track */}
            <div className="space-y-1.5">
              <div className="relative h-4 bg-[#e2e8f0] rounded-full overflow-hidden">
                {/* Visual zones */}
                {/* Dragging: 0 to 30% */}
                <div className="absolute left-0 top-0 bottom-0 w-[30%] bg-sky-200" title="Dragging (<120)" />
                {/* Optimal: 30% to 65% */}
                <div className="absolute left-[30%] top-0 bottom-0 w-[35%] bg-emerald-400" title="Optimal Zone (130-155)" />
                {/* Rushing: 65% to 100% */}
                <div className="absolute left-[65%] top-0 bottom-0 w-[35%] bg-amber-400" title="Rushing (>160)" />

                {/* Needle Indicator */}
                {(() => {
                  // Map 80 WPM (0%) to 220 WPM (100%)
                  const percent = Math.min(100, Math.max(0, ((currentWpm - 80) / 140) * 100));
                  return (
                    <div 
                      className="absolute top-0 bottom-0 w-2 bg-[#1E1B4B] shadow-md transition-all duration-300 -ml-1 rounded-full"
                      style={{ left: `${percent}%` }}
                    />
                  );
                })()}
              </div>

              <div className="flex justify-between text-[10px] font-semibold text-[#777587] uppercase tracking-wider px-1">
                <span>Slow (80)</span>
                <span className="text-[#047857] font-bold">Optimal (140)</span>
                <span>Fast (220)</span>
              </div>
            </div>

            {/* Mini Tips on Pacing */}
            <div className="text-xs text-[#464555] bg-[#faf8ff] p-3 rounded-xl border border-[#e2e7ff]">
              💡 <span className="font-semibold">Cadence Rule:</span> Venture capital partners absorb complex economics best at ~138 WPM. Save higher speed for the problem urgency.
            </div>
          </div>

          {/* Real-time Filler Word Counter Card */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 card-shadow space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#777587]">
                  Verbal Precision
                </span>
                <h4 className="font-heading font-bold text-base text-[#131b2e]">
                  Filler Word Monitor
                </h4>
              </div>

              {/* Total Filler Count Pill */}
              <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                Object.values(fillerCounts).reduce((a, b) => a + b, 0) === 0
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {Object.values(fillerCounts).reduce((a, b) => a + b, 0)} Total Fillers
              </div>
            </div>

            {/* Live Alert Toast if filler triggered in last 3 seconds */}
            {lastFillerAlert && Date.now() - lastFillerAlert.time < 3500 && (
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl flex items-center gap-2 animate-bounce">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-amber-800">
                  Detected filler: <span className="underline uppercase">"{lastFillerAlert.word}"</span>. Pause instead of vocalizing.
                </span>
              </div>
            )}

            {/* Grid of tracked filler words */}
            <div className="grid grid-cols-3 gap-2.5">
              {COMMON_FILLERS.map(word => {
                const count = fillerCounts[word] || 0;
                return (
                  <div
                    key={word}
                    className={`p-2.5 rounded-xl border transition-all text-center ${
                      count > 0 
                        ? 'bg-amber-50/70 border-amber-200 text-[#131b2e]' 
                        : 'bg-[#faf8ff] border-[#e2e7ff] text-[#777587]'
                    }`}
                  >
                    <div className="text-xs font-medium capitalize">{word}</div>
                    <div className="font-heading font-bold text-lg tabular-nums text-[#131b2e]">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Coach Live Micro-Nudge HUD */}
          <div className="bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] text-white rounded-2xl p-5 ai-glow shadow-lg relative overflow-hidden">
            {/* Background Ambient Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-indigo-200" />
              </div>
              <span className="font-heading font-semibold text-sm tracking-tight text-white">
                Live Coach HUD
              </span>
              <span className="ml-auto text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                Active Analysis
              </span>
            </div>

            <p className="text-xs text-indigo-100 font-medium leading-relaxed min-h-[38px]">
              "{coachNudge.message}"
            </p>

            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-indigo-200">
              <span>Next Checkpoint: Slide {Math.min(activeDeck.slides.length, currentSlideIndex + 2)}</span>
              <span className="text-indigo-300">Tap arrow to advance</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
