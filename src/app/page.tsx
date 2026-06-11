'use client';

import * as React from 'react';
import { ToolGrid } from '@/components/homepage/ToolGrid';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Shield, Cpu, Code } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex-1 relative overflow-hidden bg-bg-primary">
      {/* Dynamic background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Hero Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-8 text-center relative z-10 select-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-xs text-accent font-semibold mb-6 shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>DevTools Pro Sandbox</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-extrabold font-outfit tracking-tight text-text-primary leading-[1.1] max-w-3xl mx-auto"
        >
          Production-Grade Utilities for{' '}
          <span className="bg-gradient-to-r from-accent via-indigo-500 to-cyan-500 bg-clip-text text-transparent">
            Modern Developers
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-base sm:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed"
        >
          An offline-first suite of cryptographic hashers, CSS layout compilers, network CIDR calculators, encoding tools, and formatting playgrounds.
        </motion.p>
      </div>

      {/* Tool Grid component */}
      <ToolGrid />
    </main>
  );
}
