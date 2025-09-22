'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const motivationalQuotes = [
  // Success & Achievement
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Success is walking from failure to failure with no loss of enthusiasm.",
    author: "Winston Churchill"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs"
  },
  {
    text: "Success is not the key to happiness. Happiness is the key to success.",
    author: "Albert Schweitzer"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  },
  {
    text: "Success is 99% failure.",
    author: "Soichiro Honda"
  },

  // Hard Work & Persistence
  {
    text: "Hard work beats talent when talent doesn't work hard.",
    author: "Tim Notke"
  },
  {
    text: "The harder you work for something, the greater you'll feel when you achieve it.",
    author: "Unknown"
  },
  {
    text: "There are no shortcuts to any place worth going.",
    author: "Beverly Sills"
  },
  {
    text: "Work hard in silence, let your success be the noise.",
    author: "Frank Ocean"
  },
  {
    text: "I'm a greater believer in luck, and I find the harder I work the more I have of it.",
    author: "Thomas Jefferson"
  },
  {
    text: "The price of success is hard work, dedication to the job at hand.",
    author: "Vince Lombardi"
  },
  {
    text: "Opportunities don't happen. You create them.",
    author: "Chris Grosser"
  },
  {
    text: "Don't wish it were easier; wish you were better.",
    author: "Jim Rohn"
  },

  // Motivation & Inspiration
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
    text: "Don't wait for opportunity. Create it.",
    author: "Unknown"
  },

  // Perseverance & Growth
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "It is never too late to be what you might have been.",
    author: "George Eliot"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "The only person you are destined to become is the person you decide to be.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
    author: "Ralph Waldo Emerson"
  },

  // Learning & Development
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi"
  },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: "Dr. Seuss"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  {
    text: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci"
  },

  // Career & Professional Growth
  {
    text: "Choose a job you love, and you will never have to work a day in your life.",
    author: "Confucius"
  },
  {
    text: "Your work is going to fill a large part of your life, and the only way to be truly satisfied is to do what you believe is great work.",
    author: "Steve Jobs"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Don't be afraid to give up the good to go for the great.",
    author: "John D. Rockefeller"
  },
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },

  // Mindset & Attitude
  {
    text: "Whether you think you can or you think you can't, you're right.",
    author: "Henry Ford"
  },
  {
    text: "The mind is everything. What you think you become.",
    author: "Buddha"
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis"
  },
  {
    text: "Life is 10% what happens to you and 90% how you react to it.",
    author: "Charles R. Swindoll"
  },
  {
    text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.",
    author: "Alan Watts"
  },

  // Excellence & Quality
  {
    text: "Excellence is never an accident. It is always the result of high intention, sincere effort, and intelligent execution.",
    author: "Aristotle"
  },
  {
    text: "Quality is not an act, it is a habit.",
    author: "Aristotle"
  },
  {
    text: "Strive not to be a success, but rather to be of value.",
    author: "Albert Einstein"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  },

  // Courage & Risk-Taking
  {
    text: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky"
  },
  {
    text: "Fortune favors the bold.",
    author: "Latin Proverb"
  },
  {
    text: "The biggest risk is not taking any risk.",
    author: "Mark Zuckerberg"
  },
  {
    text: "Courage is not the absence of fear, but action in spite of it.",
    author: "Mark Twain"
  },

  // Focus & Discipline
  {
    text: "Discipline is the bridge between goals and accomplishment.",
    author: "Jim Rohn"
  },
  {
    text: "Focus on being productive instead of busy.",
    author: "Tim Ferriss"
  },
  {
    text: "The successful warrior is the average man with laser-like focus.",
    author: "Bruce Lee"
  },
  {
    text: "Where focus goes, energy flows and results show.",
    author: "Tony Robbins"
  },

  // Time & Productivity
  {
    text: "Time is more valuable than money. You can get more money, but you cannot get more time.",
    author: "Jim Rohn"
  },
  {
    text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
    author: "Stephen Covey"
  },
  {
    text: "Yesterday is history, tomorrow is a mystery, today is a gift of God, which is why we call it the present.",
    author: "Bill Keane"
  },

  // Leadership & Influence
  {
    text: "A leader is one who knows the way, goes the way, and shows the way.",
    author: "John C. Maxwell"
  },
  {
    text: "The greatest leader is not necessarily the one who does the greatest things. He is the one that gets the people to do the greatest things.",
    author: "Ronald Reagan"
  },
  {
    text: "Leadership is not about being in charge. It's about taking care of those in your charge.",
    author: "Simon Sinek"
  },

  // Problem Solving & Innovation
  {
    text: "Every problem is a gift—without problems we would not grow.",
    author: "Anthony Robbins"
  },
  {
    text: "The significant problems we face cannot be solved at the same level of thinking we were at when we created them.",
    author: "Albert Einstein"
  },
  {
    text: "Innovation is the ability to see change as an opportunity - not a threat.",
    author: "Steve Jobs"
  },

  // Teamwork & Collaboration
  {
    text: "Alone we can do so little; together we can do so much.",
    author: "Helen Keller"
  },
  {
    text: "Teamwork makes the dream work.",
    author: "John C. Maxwell"
  },
  {
    text: "If you want to go fast, go alone. If you want to go far, go together.",
    author: "African Proverb"
  },

  // Continuous Improvement
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde"
  },
  {
    text: "Continuous improvement is better than delayed perfection.",
    author: "Mark Twain"
  },
  {
    text: "Progress, not perfection.",
    author: "Unknown"
  },
  {
    text: "The only way to make change is to take action.",
    author: "Unknown"
  },

  // Resilience & Overcoming Challenges
  {
    text: "Fall seven times, stand up eight.",
    author: "Japanese Proverb"
  },
  {
    text: "It's not whether you get knocked down; it's whether you get up.",
    author: "Vince Lombardi"
  },
  {
    text: "Strength doesn't come from what you can do. It comes from overcoming the things you once thought you couldn't.",
    author: "Rikki Rogers"
  },
  {
    text: "The comeback is always stronger than the setback.",
    author: "Unknown"
  },

  // Self-Improvement
  {
    text: "Be yourself; everyone else is already taken.",
    author: "Oscar Wilde"
  },
  {
    text: "The only person you should try to be better than is who you were yesterday.",
    author: "Unknown"
  },
  {
    text: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
    author: "Zig Ziglar"
  },
  {
    text: "Invest in yourself. Your career is the engine of your wealth.",
    author: "Paul Clitheroe"
  },

  // Technology & Programming Specific
  {
    text: "Code is like humor. When you have to explain it, it's bad.",
    author: "Cory House"
  },
  {
    text: "The best error message is the one that never shows up.",
    author: "Thomas Fuchs"
  },
  {
    text: "Programming isn't about what you know; it's about what you can figure out.",
    author: "Chris Pine"
  },
  {
    text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    author: "Martin Fowler"
  },
  {
    text: "The most damaging phrase in the language is: 'We've always done it this way!'",
    author: "Grace Hopper"
  },
  {
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds"
  },
  {
    text: "First, solve the problem. Then, write the code.",
    author: "John Johnson"
  },
  {
    text: "Experience is the name everyone gives to their mistakes.",
    author: "Oscar Wilde"
  },
  {
    text: "The function of good software is to make the complex appear to be simple.",
    author: "Grady Booch"
  },
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci"
  },

  // Final Motivational Boost
  {
    text: "Your only limit is your mind.",
    author: "Unknown"
  },
  {
    text: "Good things happen to those who hustle.",
    author: "Chuck Noll"
  },
  {
    text: "Champions are made when nobody is watching.",
    author: "Unknown"
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "The difference between ordinary and extraordinary is that little extra.",
    author: "Jimmy Johnson"
  },
  {
    text: "Success is not just about what you accomplish in your life, it's about what you inspire others to do.",
    author: "Unknown"
  },
  {
    text: "The road to success and the road to failure are almost exactly the same.",
    author: "Colin R. Davis"
  },
  {
    text: "Don't be pushed around by the fears in your mind. Be led by the dreams in your heart.",
    author: "Roy T. Bennett"
  },
  {
    text: "The only thing standing between you and your goal is the story you keep telling yourself as to why you can't achieve it.",
    author: "Jordan Belfort"
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
