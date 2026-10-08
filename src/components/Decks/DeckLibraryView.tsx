import React, { useState } from 'react';
import { 
  Plus, 
  Layers, 
  Clock, 
  Gauge, 
  Play, 
  Edit3, 
  Trash2, 
  Sparkles, 
  Save, 
  FileText, 
  Check, 
  AlertCircle,
  Copy,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { PresentationDeck, Slide } from '../../types';
import { polishScriptWithAI } from '../../services/geminiService';

interface DeckLibraryViewProps {
  decks: PresentationDeck[];
  activeDeck: PresentationDeck;
  onSelectDeck: (deck: PresentationDeck) => void;
  onUpdateDeck: (updatedDeck: PresentationDeck) => void;
  onCreateDeck: (newDeck: PresentationDeck) => void;
  onStartRehearsal: (deck: PresentationDeck) => void;
}

export const DeckLibraryView: React.FC<DeckLibraryViewProps> = ({
  decks,
  activeDeck,
  onSelectDeck,
  onUpdateDeck,
  onCreateDeck,
  onStartRehearsal
}) => {
  const [selectedDeckId, setSelectedDeckId] = useState<string>(activeDeck.id);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [isPolishing, setIsPolishing] = useState(false);
  const [showNewDeckModal, setShowNewDeckModal] = useState(false);

  // New deck form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Investor Pitch' | 'Keynote' | 'All-Hands' | 'Product Launch' | 'Sales Pitch'>('Investor Pitch');
  const [newDescription, setNewDescription] = useState('');
  const [newTargetDurationSec, setNewTargetDurationSec] = useState(300);
  const [newTargetWpm, setNewTargetWpm] = useState(140);

  const currentDeck = decks.find(d => d.id === selectedDeckId) || activeDeck;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSlideChange = (slideId: string, updates: Partial<Slide>) => {
    const updatedSlides = currentDeck.slides.map(slide => 
      slide.id === slideId ? { ...slide, ...updates } : slide
    );
    const updatedDeck = {
      ...currentDeck,
      slides: updatedSlides,
      updatedAt: new Date().toISOString()
    };
    onUpdateDeck(updatedDeck);
  };

  const handlePolishSlideScript = async (slide: Slide) => {
    setIsPolishing(true);
    try {
      const polished = await polishScriptWithAI(slide.scriptNotes, 'authoritative');
      handleSlideChange(slide.id, { scriptNotes: polished });
    } catch (err) {
      console.error(err);
    } finally {
      setIsPolishing(false);
    }
  };

  const handleAddSlide = () => {
    const newSlideNumber = currentDeck.slides.length + 1;
    const newSlide: Slide = {
      id: `s-${Date.now()}`,
      slideNumber: newSlideNumber,
      title: `Slide ${newSlideNumber}: Core Thesis`,
      subtitle: 'Supporting rationale and tactical execution',
      targetDurationSec: 50,
      recommendedPaceWPM: currentDeck.targetWPM,
      keyTakeaway: 'State key quantitative proof point here.',
      scriptNotes: 'Maintain grounded cadence. Anchor the main takeaway with a 2-second deliberate pause.'
    };

    const updatedDeck = {
      ...currentDeck,
      slides: [...currentDeck.slides, newSlide],
      targetDurationTotalSec: currentDeck.targetDurationTotalSec + 50,
      updatedAt: new Date().toISOString()
    };
    onUpdateDeck(updatedDeck);
    setEditingSlideId(newSlide.id);
  };

  const handleDeleteSlide = (slideId: string) => {
    if (currentDeck.slides.length <= 1) return;
    const filtered = currentDeck.slides.filter(s => s.id !== slideId);
    const renumbered = filtered.map((s, idx) => ({ ...s, slideNumber: idx + 1 }));
    const updatedDeck = {
      ...currentDeck,
      slides: renumbered,
      updatedAt: new Date().toISOString()
    };
    onUpdateDeck(updatedDeck);
  };

  const handleCreateNewDeckSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newDeck: PresentationDeck = {
      id: `deck-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || 'Custom presentation prepared in Vocalis Studio.',
      targetDurationTotalSec: newTargetDurationSec,
      targetWPM: newTargetWpm,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slides: [
        {
          id: `s-${Date.now()}-1`,
          slideNumber: 1,
          title: 'Opening Hook & Vision',
          subtitle: 'Setting the overarching strategic context',
          targetDurationSec: 60,
          recommendedPaceWPM: newTargetWpm,
          keyTakeaway: 'Immediate audience engagement through a bold thesis.',
          scriptNotes: 'Speak slowly and with unhurried authority. Make deliberate eye contact before delivering the first metric.'
        },
        {
          id: `s-${Date.now()}-2`,
          slideNumber: 2,
          title: 'The Evidence & Traction',
          subtitle: 'Quantitative proof and operational validation',
          targetDurationSec: 80,
          recommendedPaceWPM: newTargetWpm,
          keyTakeaway: 'Proof points that substantiate our core thesis.',
          scriptNotes: 'Highlight unit economics. Drop vocal pitch on numbers to eliminate interrogative uptalk.'
        }
      ]
    };

    onCreateDeck(newDeck);
    setSelectedDeckId(newDeck.id);
    setShowNewDeckModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="space-y-8 pb-12">

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 card-shadow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#4f46e5] mb-1">
            <Layers className="w-4 h-4" />
            <span>Deck Architecture & Scripts</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-[#131b2e] tracking-tight">
            Presentation & Pitch Library
          </h2>
          <p className="text-xs text-[#777587] mt-0.5">
            Configure slide timings, script teleprompter cues, and polish phrasing with Gemini AI.
          </p>
        </div>

        <button
          onClick={() => setShowNewDeckModal(true)}
          className="btn-primary-gradient text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-xs self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>New Pitch Deck</span>
        </button>
      </div>

      {/* Deck Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {decks.map(deck => {
          const isSelected = deck.id === selectedDeckId;
          const isActiveForRehearsal = deck.id === activeDeck.id;
          return (
            <div
              key={deck.id}
              onClick={() => {
                setSelectedDeckId(deck.id);
                onSelectDeck(deck);
              }}
              className={`p-5 rounded-2xl border cursor-pointer transition-all card-shadow relative ${
                isSelected 
                  ? 'bg-[#ffffff] border-[#4F46E5] ring-2 ring-indigo-500/20 shadow-md' 
                  : 'bg-white border-[#E2E8F0] hover:border-[#dae2fd]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#eef2ff] text-[#4338ca] px-2 py-0.5 rounded-full">
                  {deck.category}
                </span>
                {isActiveForRehearsal && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Active Rehearsal
                  </span>
                )}
              </div>

              <h3 className="font-heading font-bold text-base text-[#131b2e] mb-1 line-clamp-1">
                {deck.title}
              </h3>
              <p className="text-xs text-[#777587] line-clamp-2 mb-4 leading-relaxed">
                {deck.description}
              </p>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-[#f2f3ff] text-[#464555]">
                <div className="flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#3525cd]" />
                  <span>{formatTime(deck.targetDurationTotalSec)} target</span>
                </div>
                <div className="flex items-center gap-1 font-semibold">
                  <Gauge className="w-3.5 h-3.5 text-[#712ae2]" />
                  <span>{deck.targetWPM} WPM</span>
                </div>
                <div className="text-[11px] font-medium text-[#777587]">
                  {deck.slides.length} slides
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Deck Details & Slide Editor */}
      <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 sm:p-8 card-shadow space-y-6">
        
        {/* Deck Action Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E2E8F0]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-xl text-[#131b2e]">
                {currentDeck.title}
              </h3>
              <span className="text-xs font-semibold bg-[#eaedff] text-[#3525cd] px-2.5 py-0.5 rounded-full">
                {currentDeck.slides.length} Slides
              </span>
            </div>
            <p className="text-xs text-[#777587] mt-1">
              Target Duration: {formatTime(currentDeck.targetDurationTotalSec)} • Target Cadence: {currentDeck.targetWPM} WPM
            </p>
          </div>

          <div className="flex items-center gap-3 self-stretch sm:self-auto">
            <button
              onClick={handleAddSlide}
              className="bg-white border border-[#E2E8F0] hover:bg-slate-50 text-[#131b2e] px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Slide</span>
            </button>

            <button
              onClick={() => onStartRehearsal(currentDeck)}
              className="btn-primary-gradient text-white px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 cursor-pointer shadow-md"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Rehearse This Deck</span>
            </button>
          </div>
        </div>

        {/* Slides List & Script Editor */}
        <div className="space-y-4">
          {currentDeck.slides.map((slide) => {
            const isEditing = editingSlideId === slide.id;
            return (
              <div 
                key={slide.id}
                className="bg-[#faf8ff] rounded-2xl border border-[#e2e7ff] p-5 space-y-4 transition-all hover:border-[#dae2fd]"
              >
                {/* Slide Title Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#3525cd] text-white font-heading font-bold text-sm flex items-center justify-center">
                      {slide.slideNumber}
                    </span>
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => handleSlideChange(slide.id, { title: e.target.value })}
                          className="font-heading font-bold text-base text-[#131b2e] bg-white border border-[#dae2fd] rounded-lg px-2 py-1 focus:outline-hidden"
                        />
                      ) : (
                        <h4 className="font-heading font-bold text-base text-[#131b2e]">
                          {slide.title}
                        </h4>
                      )}
                      {slide.subtitle && !isEditing && (
                        <p className="text-xs text-[#777587] mt-0.5">{slide.subtitle}</p>
                      )}
                    </div>
                  </div>

                  {/* Target Duration & Pace Pills */}
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex items-center gap-1 bg-white border border-[#e2e7ff] px-2.5 py-1 rounded-lg text-[#464555] font-medium">
                      <Clock className="w-3 h-3 text-[#3525cd]" />
                      <span>{slide.targetDurationSec}s target</span>
                    </div>

                    <div className="flex items-center gap-1 bg-white border border-[#e2e7ff] px-2.5 py-1 rounded-lg text-[#464555] font-medium">
                      <Gauge className="w-3 h-3 text-[#712ae2]" />
                      <span>{slide.recommendedPaceWPM} WPM</span>
                    </div>

                    <button
                      onClick={() => setEditingSlideId(isEditing ? null : slide.id)}
                      className="p-1.5 rounded-lg hover:bg-white text-[#777587] hover:text-[#131b2e] cursor-pointer"
                      title={isEditing ? 'Save edits' : 'Edit slide details'}
                    >
                      {isEditing ? <Check className="w-4 h-4 text-emerald-600" /> : <Edit3 className="w-4 h-4" />}
                    </button>

                    {currentDeck.slides.length > 1 && (
                      <button
                        onClick={() => handleDeleteSlide(slide.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-[#777587] hover:text-red-600 cursor-pointer"
                        title="Delete slide"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Key Takeaway */}
                <div className="bg-white p-3 rounded-xl border border-[#dae2fd] text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="font-bold text-[#3525cd] flex-shrink-0">Audience Anchor:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        value={slide.keyTakeaway}
                        onChange={(e) => handleSlideChange(slide.id, { keyTakeaway: e.target.value })}
                        className="w-full bg-[#faf8ff] border border-[#e2e7ff] rounded-md px-2 py-0.5 text-xs text-[#131b2e]"
                      />
                    ) : (
                      <span className="text-[#464555] font-medium">{slide.keyTakeaway}</span>
                    )}
                  </div>
                </div>

                {/* Script Teleprompter Content */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#131b2e] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#4f46e5]" />
                      Speaker Teleprompter Cues & Phrasing
                    </span>

                    {/* AI Polish Button */}
                    <button
                      onClick={() => handlePolishSlideScript(slide)}
                      disabled={isPolishing}
                      className="text-[11px] font-semibold text-[#4f46e5] hover:text-[#3525cd] bg-white border border-[#dad7ff] px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all hover:shadow-xs disabled:opacity-50"
                    >
                      {isPolishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-[#712ae2]" />}
                      <span>AI Polish Phrasing</span>
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={slide.scriptNotes}
                    onChange={(e) => handleSlideChange(slide.id, { scriptNotes: e.target.value })}
                    className="w-full bg-white border border-[#dae2fd] rounded-xl p-3 text-xs text-[#131b2e] leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5] resize-y"
                    placeholder="Enter script cues, phonetics, and deliberate pause instructions..."
                  />
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* New Pitch Deck Modal */}
      {showNewDeckModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#E2E8F0] space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-xl text-[#131b2e]">
                Create New Pitch Deck
              </h3>
              <button 
                onClick={() => setShowNewDeckModal(false)}
                className="text-[#777587] hover:text-[#131b2e] font-semibold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewDeckSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                  Presentation Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NextGen Autonomous Supply Chain — Seed Pitch"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#faf8ff] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-xs text-[#131b2e] focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-[#faf8ff] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-xs text-[#131b2e] focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]"
                >
                  <option value="Investor Pitch">Investor Pitch</option>
                  <option value="Keynote">Keynote</option>
                  <option value="All-Hands">All-Hands</option>
                  <option value="Product Launch">Product Launch</option>
                  <option value="Sales Pitch">Sales Pitch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                  Description / Context
                </label>
                <textarea
                  rows={2}
                  placeholder="Target audience, venue, or objectives..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#faf8ff] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-xs text-[#131b2e] focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                    Target Total Time (seconds)
                  </label>
                  <input
                    type="number"
                    min={60}
                    max={3600}
                    value={newTargetDurationSec}
                    onChange={(e) => setNewTargetDurationSec(Number(e.target.value))}
                    className="w-full bg-[#faf8ff] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-xs text-[#131b2e] focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#131b2e] mb-1">
                    Target Cadence (WPM)
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={200}
                    value={newTargetWpm}
                    onChange={(e) => setNewTargetWpm(Number(e.target.value))}
                    className="w-full bg-[#faf8ff] border border-[#E2E8F0] rounded-xl px-3.5 py-2 text-xs text-[#131b2e] focus:outline-hidden focus:ring-2 focus:ring-[#4f46e5]"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewDeckModal(false)}
                  className="bg-white border border-[#E2E8F0] text-[#777587] hover:text-[#131b2e] px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary-gradient text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
                >
                  Create & Open Deck
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
