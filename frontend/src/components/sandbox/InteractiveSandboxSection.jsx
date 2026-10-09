import React, { useState } from 'react';
import { Terminal, Sparkles, Play, Copy, Check, Cpu, Zap } from 'lucide-react';

const demoModes = [
  {
    id: 'code',
    label: 'Agentic Code Synthesis',
    prompt: 'Synthesize a multi-agent state graph with reflex human-in-the-loop review',
    output: `// Generated via Claude 3.7 + LangGraph Nexus
import { StateGraph, END } from "@langchain/langgraph";

const agentGraph = new StateGraph({
  channels: {
    messages: { value: (x, y) => x.concat(y), default: () => [] },
    reviewApproved: { value: (x, y) => y ?? x, default: () => false },
  }
})
.addNode("planner", async (state) => executePlanning(state))
.addNode("evaluator", async (state) => verifySafety(state))
.addEdge("planner", "evaluator")
.addConditionalEdges("evaluator", (state) => 
  state.reviewApproved ? END : "planner"
);

export const app = agentGraph.compile();`,
  },
  {
    id: 'video',
    label: 'Cinematic Motion Prompt',
    prompt: 'Hyper-detailed camera dolly through a futuristic Tokyo cyber-temple in neon rain',
    output: `[Runway Gen-3 / Sora Camera Choreography]
Prompt: "Slow forward tracking shot through a rain-slicked futuristic Shinjuku alleyway. Holographic koi fish float between skyscraper sky-bridges. Volumetric cyan neon reflections shimmer on wet asphalt. An android monk in reflective fiber-optic robes turns toward the camera. 35mm anamorphic lens, shallow depth of field, 8K HDR, photorealistic, subtle atmospheric fog."
Camera Parameters:
--motion-brush [0.8, -0.2, 0.4]
--fps 24 --seed 48910283 --dynamic-lighting true`,
  },
  {
    id: 'voice',
    label: 'Neural Voice Synthesis',
    prompt: 'Emotional conversational AI greeting in warm British narrator tone',
    output: `[ElevenLabs Neural Voice Pipeline]
Model: Multilingual v2 (Turbo low-latency)
Voice Profile: "Aura Prime - Warm, Philosophical & Articulate"
Stability: 0.72 | Similarity Boost: 0.85 | Style Exaggeration: 0.20

Synthesized Stream:
"Welcome to AI Nexus. The boundary between human intention and synthetic cognition has dissolved. Whatever you envision today, we will compile into reality."
Latency: 142ms | Bitrate: 48kHz lossless FLAC`,
  },
];

export default function InteractiveSandboxSection() {
  const [activeTab, setActiveTab] = useState('code');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeDemo = demoModes.find((m) => m.id === activeTab);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeDemo.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRun = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 600);
  };

  return (
    <section
      style={{
        position: 'relative',
        zIndex: 20,
        padding: '60px 24px 80px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            background: 'rgba(0, 242, 254, 0.1)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '20px',
            color: '#67e8f9',
            fontSize: '0.82rem',
            fontFamily: 'var(--font-heading)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '12px',
          }}
        >
          <Zap size={14} color="#00f2fe" />
          <span>Interactive Synthesis</span>
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            marginBottom: '10px',
          }}
        >
          Test-Drive the Intelligence Engine
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '620px', margin: '0 auto' }}>
          Experience the real-time compilation of prompts into production artifacts.
        </p>
      </div>

      {/* Terminal Container */}
      <div
        style={{
          background: 'rgba(3, 10, 22, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: '22px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 242, 254, 0.15)',
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            padding: '14px 22px',
            background: 'rgba(2, 6, 16, 0.95)',
            borderBottom: '1px solid rgba(0, 242, 254, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block' }} />
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              nexus-sandbox-v2.6 // live-compiler
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {demoModes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveTab(mode.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  border: activeTab === mode.id ? '1px solid #00f2fe' : '1px solid transparent',
                  background: activeTab === mode.id ? 'rgba(0, 242, 254, 0.15)' : 'transparent',
                  color: activeTab === mode.id ? '#00f2fe' : '#94a3b8',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-heading)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Input Row */}
        <div
          style={{
            padding: '18px 24px',
            background: 'rgba(6, 18, 36, 0.5)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <Cpu size={18} color="#00f2fe" />
          <div style={{ flex: 1, color: '#e2e8f0', fontSize: '0.92rem', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: '#00f2fe' }}>❯ prompt: </span>
            <span>"{activeDemo.prompt}"</span>
          </div>
          <button
            onClick={handleRun}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #00f2fe, #38bdf8)',
              border: 'none',
              borderRadius: '8px',
              color: '#020812',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            <Play size={13} fill="#020812" />
            <span>{isProcessing ? 'Synthesizing...' : 'Execute'}</span>
          </button>
        </div>

        {/* Code / Output Area */}
        <div style={{ position: 'relative', padding: '24px', minHeight: '260px' }}>
          <button
            onClick={handleCopy}
            style={{
              position: 'absolute',
              top: '16px',
              right: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#94a3b8',
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <pre
            style={{
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.86rem',
              lineHeight: 1.6,
              color: isProcessing ? '#64748b' : '#38bdf8',
              whiteSpace: 'pre-wrap',
            }}
          >
            {isProcessing ? '⚡ Neural synaptic stream connecting to cluster...\nSynthesizing model weights...' : activeDemo.output}
          </pre>
        </div>
      </div>
    </section>
  );
}
