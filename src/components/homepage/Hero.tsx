'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-secondary border border-border mb-8">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-sm text-text-secondary">All tools run locally in your browser</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold font-outfit leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="gradient-text">DevTools Pro</span>
          <br />
          <span className="text-text-primary">Developer Utilities</span>
        </motion.h1>

        <motion.p
          className="mt-6 text-lg text-text-secondary max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          20+ production-grade developer utilities in one platform. 
          JSON beautifier, Base64 encoder, JWT decoder, hash generator, and more.
        </motion.p>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link href="/tools/json">
            <Button size="lg" icon={<ArrowRight className="h-5 w-5" />}>
              Try JSON Tool
            </Button>
          </Link>
          <Link href="/tools">
            <Button variant="secondary" size="lg">
              Browse All Tools
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}