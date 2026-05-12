'use client';

import { motion } from 'framer-motion';
import { Zap, Lock, Keyboard, FileCode } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Processing',
    description: 'All tools run locally in your browser. No server roundtrips, no delays.',
  },
  {
    icon: Lock,
    title: 'Privacy First',
    description: 'Your data never leaves your device. Everything is processed locally.',
  },
  {
    icon: Keyboard,
    title: 'Keyboard Driven',
    description: 'Search with Cmd+K. Keyboard shortcuts for power users.',
  },
  {
    icon: FileCode,
    title: 'Open Source',
    description: 'Free forever. No registration, no paywalls. Open source on GitHub.',
  },
];

export function Features() {
  return (
    <section className="py-24 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-outfit">
            Why DevTools Pro?
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto">
            Built for developers who value speed and privacy
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="p-6 rounded-xl border border-border bg-bg-tertiary"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-medium font-outfit">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}