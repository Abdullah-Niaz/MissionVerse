import React, { useState } from 'react';
import { X, Bot, Send, Sparkles, Lightbulb, HelpCircle } from 'lucide-react';
import { ApiService } from '../services/api';
import { PlanetEnvironment } from '../types';
import { sound } from '../utils/audio';

interface Props {
  planet: PlanetEnvironment;
  missionId: string;
  onClose: () => void;
  initialTopic?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor';
  text: string;
  concept?: string;
  action?: string;
}

export const MentorModal: React.FC<Props> = ({ planet, missionId, onClose, initialTopic }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'mentor',
      text: initialTopic
        ? `Hello, Junior Astronaut! Let's talk about ${initialTopic}. What would you like to discover?`
        : `Greetings! I am AstroGuide, your scientific AI mission mentor. I'm here to help you understand space science and guide you on your mission without spoiling the fun. What is your question?`,
      concept: 'Space Science Exploration'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestedQuestions = planet === 'moon' ? [
    "Why is walking different on the Moon?",
    "Why are crater edges so sharp?",
    "Where is the nearest recharge station?"
  ] : [
    "Why is Mars called the Red Planet?",
    "Can humans breathe the air on Mars?",
    "How does the Mars Rover drive over rocks?"
  ];

  const handleSend = async (questionText: string) => {
    if (!questionText.trim() || loading) return;

    sound.playClick();
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: questionText
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const resp = await ApiService.askMentorHint({
        environment: planet,
        missionId,
        question: questionText
      });

      const mentorMsg: ChatMessage = {
        id: 'mentor-' + Date.now(),
        sender: 'mentor',
        text: resp.mentor_response,
        concept: resp.learning_concept,
        action: resp.suggested_action
      };

      setMessages(prev => [...prev, mentorMsg]);
      sound.playInspect();
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: 'mentor-' + Date.now(),
          sender: 'mentor',
          text: "Look closely at the highlighted landmarks on your map! Every discovery teaches us how our solar system was made.",
          concept: "Observation"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border-2 border-indigo-500/80 rounded-3xl max-w-lg w-full h-[580px] text-white shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-white">AstroGuide AI Mentor</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded">ONLINE</span>
              </div>
              <p className="text-xs text-slate-400">Child-Safe Socratic Space Guide</p>
            </div>
          </div>

          <button
            onClick={() => { sound.playClick(); onClose(); }}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-sm'
                    : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
                }`}
              >
                {m.text}

                {m.concept && (
                  <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center gap-1.5 text-[11px] text-amber-300 font-semibold">
                    <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                    <span>Concept: {m.concept}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-400" />
              <span>AstroGuide is formulating a child-friendly scientific hint...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
          <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0" />
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/70 transition-colors cursor-pointer shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Question Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            maxLength={120}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AstroGuide a space science question..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
