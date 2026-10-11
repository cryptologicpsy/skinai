import { useEffect, useRef, useState } from 'react';
import TabLayout from '../layouts/TabLayout.jsx';
import Icon from '../components/Icon.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { SUGGESTED_PROMPTS } from '../data/chat.js';
import { sendMessage } from '../services/chatService.js';

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  time: 'Just now',
  text: "Hi! I'm your SkinAI Advisor. Ask me anything about ingredients, routines, or what you're seeing in your skin.",
};

const BADGE_TONES = {
  secondary: 'bg-secondary-container text-on-secondary-container',
  error: 'bg-error-container text-on-error-container',
  tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed-variant',
  secondaryFixed: 'bg-secondary-fixed text-on-secondary-fixed-variant',
};

const MATRIX_TONES = {
  primary: 'text-primary',
  secondary: 'text-secondary',
};

export default function Chat() {
  const showToast = useToast();
  const { user } = useAuth();
  const userName = user?.name?.split(' ')[0] || 'You';
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const threadEndRef = useRef(null);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg = { id: `u-${Date.now()}`, role: 'user', time: 'Just now', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    const replyId = `m-${Date.now()}`;
    let started = false;

    sendMessage(trimmed, messages, (chunk) => {
      setIsThinking(false);
      if (!started) {
        started = true;
        setMessages((prev) => [...prev, { id: replyId, role: 'assistant', time: 'Just now', text: chunk }]);
      } else {
        setMessages((prev) =>
          prev.map((m) => (m.id === replyId ? { ...m, text: m.text + chunk } : m))
        );
      }
    }).then((reply) => {
      setIsThinking(false);
      setMessages((prev) => {
        const already = prev.some((m) => m.id === replyId);
        return already ? prev.map((m) => (m.id === replyId ? { ...m, text: reply.text } : m)) : [...prev, reply];
      });
    });
  };

  return (
    <TabLayout subtitle="AI Skincare Chat">
      <div className="flex flex-col w-full pb-6">
        <section className="px-margin pt-space-xs pb-space-sm flex flex-col gap-space-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-sm text-label-sm text-secondary font-bold uppercase tracking-wider">
                Active Skincare Session
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm shadow-sm">
              <Icon name="spa" className="text-[14px] text-primary" filled />
              <span>{userName}&apos;s Profile • Skin Type II</span>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Science-informed cosmetic advisor &amp; skin biometric synthesis
          </p>
        </section>

        <section className="px-margin mb-space-md">
          <div className="w-full p-space-sm bg-surface-container-lowest rounded-DEFAULT shadow-sm flex items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm min-w-0">
              <div className="w-10 h-10 rounded-full bg-secondary-container/60 flex items-center justify-center shrink-0 text-on-secondary-container">
                <Icon name="biotech" className="text-[20px]" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface truncate">Recent Tele-Scan Synced</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Hydration: 78% • Zone: Mid-Cheek Sensitivity
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => showToast('Scan log opened')}
              className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface transition-colors flex items-center gap-1"
            >
              <span>Log</span>
              <Icon name="chevron_right" className="text-[14px]" />
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-space-lg px-margin mb-space-md">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} msg={msg} userName={userName} />
          ))}
          {isThinking && (
            <div className="flex items-center gap-space-xs max-w-[96%]">
              <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
                <Icon name="auto_awesome" className="text-[14px]" />
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant italic">SkinAI is thinking...</span>
            </div>
          )}
          <div ref={threadEndRef} />
        </section>

        <section className="px-margin mb-space-sm">
          <div className="flex items-center gap-1.5 mb-2">
            <Icon name="lightbulb" className="text-[14px] text-tertiary" />
            <span className="font-label-sm text-label-sm text-tertiary font-bold tracking-wide uppercase">
              Suggested Inquiries
            </span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar -mx-margin px-margin">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSend(prompt)}
                className="shrink-0 px-3.5 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md hover:bg-primary-fixed hover:text-on-primary-fixed-variant transition-all active:scale-95 shadow-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
        </section>

        <section className="px-margin pt-space-xs sticky bottom-0 z-30">
          <div className="w-full bg-surface-container-lowest p-2 rounded-2xl shadow-md flex flex-col gap-2">
            <div className="flex items-center gap-2 px-2">
              <textarea
                className="w-full bg-transparent resize-none font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none max-h-24 overflow-y-auto leading-relaxed py-1"
                placeholder="Ask anything about ingredients, routines, or your skin..."
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(input);
                  }
                }}
                aria-label="Chat message"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title="Upload ingredient label or skin photo"
                  onClick={() => showToast('Photo attachment coming soon')}
                  className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all flex items-center justify-center active:scale-90"
                >
                  <Icon name="add_photo_alternate" className="text-[20px]" />
                </button>
                <button
                  type="button"
                  title="Voice consult"
                  onClick={() => showToast('Voice input coming soon')}
                  className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all flex items-center justify-center active:scale-90"
                >
                  <Icon name="mic" className="text-[20px]" />
                </button>
                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm">
                  <Icon name="shield_with_heart" className="text-[13px]" />
                  <span>Safety Checked</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleSend(input)}
                className="px-5 h-11 rounded-full bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 hover:opacity-95 active:scale-95 transition-all shadow-sm"
              >
                <span>Consult</span>
                <Icon name="auto_awesome" className="text-[18px]" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </TabLayout>
  );
}

function ChatBubble({ msg, userName }) {
  if (msg.role === 'user') {
    return (
      <div className="flex flex-col items-end gap-space-xs max-w-[88%] ml-auto animate-fade-in">
        <div className="flex items-center gap-space-xs mb-1">
          <span className="font-label-sm text-label-sm text-on-surface-variant">{msg.time}</span>
          <span className="font-label-md text-label-md text-on-surface font-semibold">{userName}</span>
        </div>
        <div className="bg-primary text-on-primary p-space-md rounded-2xl rounded-tr-sm shadow-sm">
          <p className="font-body-md text-body-md leading-relaxed">{msg.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-space-xs max-w-[96%] animate-fade-in">
      <div className="flex items-center gap-space-xs mb-1">
        <div className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
          <Icon name="auto_awesome" className="text-[14px]" />
        </div>
        <span className="font-label-md text-label-md text-on-surface font-semibold">SkinAI Advisor</span>
        <span className="font-label-sm text-label-sm text-on-surface-variant">{msg.time}</span>
      </div>
      <div className="w-full bg-surface-container-lowest text-on-surface p-space-md rounded-2xl rounded-tl-sm shadow-sm flex flex-col gap-space-sm">
        {msg.badges && (
          <div className="flex flex-wrap gap-1.5">
            {msg.badges.map((badge) => (
              <span
                key={badge.label}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${BADGE_TONES[badge.tone]}`}
              >
                <Icon name={badge.icon} className="text-[12px]" /> {badge.label}
              </span>
            ))}
          </div>
        )}

        <p className="font-body-md text-body-md leading-relaxed text-on-surface">{msg.text}</p>

        {msg.product && (
          <div className="flex items-center gap-space-sm p-space-sm bg-surface-container-low rounded-xl">
            <img className="w-11 h-11 rounded-lg object-cover shrink-0" alt={msg.product.name} src={msg.product.image} />
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md text-on-surface font-semibold truncate">{msg.product.name}</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{msg.product.note}</span>
            </div>
            <button
              type="button"
              aria-label="Save product"
              className="shrink-0 ml-auto w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
            >
              <Icon name="bookmark_border" className="text-[16px]" />
            </button>
          </div>
        )}

        {msg.collisionMatrix && (
          <div className="grid grid-cols-2 gap-space-sm">
            {msg.collisionMatrix.map((item) => (
              <div key={item.name} className="p-space-sm bg-surface-container-low rounded-xl flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className={`font-label-sm text-label-sm font-bold ${MATRIX_TONES[item.tone]}`}>{item.name}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{item.ph}</span>
                </div>
                <span className="font-label-md text-label-md text-on-surface font-semibold">{item.action}</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{item.note}</p>
              </div>
            ))}
          </div>
        )}

        {msg.optimization && (
          <div className="p-space-sm bg-secondary-container/40 rounded-xl flex items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                <Icon name="verified" className="text-[18px]" />
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-secondary-fixed font-semibold">{msg.optimization.title}</span>
                <span className="font-body-sm text-body-sm text-on-secondary-container">{msg.optimization.note}</span>
              </div>
            </div>
            <button
              type="button"
              className="px-3 py-1.5 rounded-full bg-secondary text-on-secondary font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all shadow-sm"
            >
              Apply
            </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-1 text-on-surface-variant">
          <span className="font-label-sm text-label-sm flex items-center gap-1">
            <Icon name="info" className="text-[14px]" /> AI-generated — not a medical opinion
          </span>
          <div className="flex items-center gap-2">
            <button type="button" aria-label="Helpful" className="p-1 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
              <Icon name="thumb_up" className="text-[16px]" />
            </button>
            <button type="button" aria-label="Copy" className="p-1 rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
              <Icon name="content_copy" className="text-[16px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
