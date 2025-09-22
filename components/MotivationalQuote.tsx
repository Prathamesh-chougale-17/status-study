'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const motivationalQuotes = [
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Your limitation—it's only your imagination.",
    author: "Unknown"
  },
  {
    text: "Push yourself, because no one else is going to do it for you.",
    author: "Unknown"
  },
  {
    text: "Great things never come from comfort zones.",
    author: "Unknown"
  },
  {
    text: "Dream it. Wish it. Do it.",
    author: "Unknown"
  },
  {
    text: "Success doesn't just find you. You have to go out and get it.",
    author: "Unknown"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown"
  },
  {
    text: "Dream bigger. Do bigger.",
    author: "Unknown"
  },
  {
    text: "Don't stop when you're tired. Stop when you're done.",
    author: "Unknown"
  },
  {
    text: "Wake up with determination. Go to bed with satisfaction.",
    author: "Unknown"
  },
  {
    text: "Do something today that your future self will thank you for.",
    author: "Sean Patrick Flanery"
  },
  {
    text: "Little progress is still progress.",
    author: "Unknown"
  },
  {
    text: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    author: "Zig Ziglar"
  },
  {
    text: "Don't wait for opportunity. Create it.",
    author: "Unknown"
  }
];

export default function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const getNewQuote = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    // Set a random quote on mount
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
  }, []);

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border border-purple-500/20 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className={`transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
              <blockquote className="text-lg font-medium text-foreground mb-2 leading-relaxed">
                "{currentQuote.text}"
              </blockquote>
              <cite className="text-sm text-muted-foreground font-medium">
                — {currentQuote.author}
              </cite>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={getNewQuote}
            className="ml-4 hover:bg-purple-500/20 transition-colors"
            disabled={isAnimating}
          >
            <RefreshCw className={`h-4 w-4 ${isAnimating ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
