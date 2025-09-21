export interface StudyTopic {
  _id?: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  category: 'interview-prep' | 'career-growth';
  resources: StudyResource[];
  subtopics: Subtopic[];
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudyResource {
  _id?: string;
  title: string;
  description: string;
  url?: string;
  type: 'video' | 'article' | 'book' | 'course' | 'practice' | 'other';
  status: 'not-started' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtopic {
  _id?: string;
  title: string;
  description: string;
  topicId: string;
  notes: string; // HTML content from Quill editor
  links: SubtopicLink[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SubtopicLink {
  _id?: string;
  title: string;
  url: string;
  description?: string;
  createdAt: Date;
}

export interface Progress {
  _id?: string;
  year: number;
  month: number;
  week: number;
  day: number;
  yearProgress: number;
  monthProgress: number;
  weekProgress: number;
  dayProgress: number;
  updatedAt: Date;
}
