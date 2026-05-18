'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FileJson, Lock, Hash, Text, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';

const categories = [
  {
    id: 'encoding',
    name: 'Encoding',
    description: 'Base64, URL, QR codes',
    icon: Lock,
    count: 4,
    tools: ['base64', 'url', 'number-base', 'qr-code'],
  },
  {
    id: 'security',
    name: 'Security',
    description: 'JWT, Hash generators',
    icon: Hash,
    count: 2,
    tools: ['jwt', 'hash'],
  },
  {
    id: 'formatting',
    name: 'Formatting',
    description: 'JSON, SQL formatters',
    icon: FileJson,
    count: 1,
    tools: ['json'],
  },
  {
    id: 'text',
    name: 'Text',
    description: 'Regex, UUID, Lorem Ipsum',
    icon: Text,
    count: 3,
    tools: ['regex', 'uuid', 'lorem-ipsum'],
  },
  {
    id: 'datetime',
    name: 'Date & Time',
    description: 'Timestamp, Cron, Timezone',
    icon: Clock,
    count: 3,
    tools: ['timestamp', 'cron', 'timezone'],
  }
];

export function Categories() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-outfit">
            Categories
          </h2>
          <p className="mt-4 text-text-secondary max-w-xl mx-auto">
            Organize your tools by category
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link href={category.count > 0 ? `/tools/${category.tools[0]}` : '#'}>
                  <Card 
                    hover 
                    className={`h-full p-6 text-center ${category.count === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-medium font-outfit">
                      {category.name}
                    </h3>
                    <p className="mt-2 text-sm text-text-secondary">
                      {category.description}
                    </p>
                    <p className="mt-2 text-xs text-text-muted">
                      {category.count} tool{category.count !== 1 ? 's' : ''}
                    </p>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}