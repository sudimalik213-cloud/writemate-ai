export type WritingCategory =
  | 'Essay'
  | 'Paragraph'
  | 'Social Media Caption'
  | 'Instagram Post'
  | 'Facebook Post'
  | 'YouTube Video Description'
  | 'YouTube Video Script'
  | 'Product Description'
  | 'Professional Email'
  | 'Personal Message'
  | 'Birthday Wish'
  | 'Story'
  | 'Blog Article'
  | 'Business Ideas'
  | 'Advertisement Copy'
  | 'Speech'
  | 'Summary'
  | 'Application or Formal Letter';

export type OutputLanguage = 'English' | 'Urdu' | 'Roman Urdu';

export type WritingTone =
  | 'Professional'
  | 'Friendly'
  | 'Casual'
  | 'Formal'
  | 'Creative'
  | 'Funny'
  | 'Persuasive'
  | 'Inspirational'
  | 'Simple';

export type WritingLength = 'Short' | 'Medium' | 'Long';

export interface GeneratedResult {
  id: string;
  topic: string;
  text: string;
  category: WritingCategory;
  language: OutputLanguage;
  tone: WritingTone;
  length: WritingLength;
  timestamp: string;
}

export interface ExamplePrompt {
  id: string;
  title: string;
  prompt: string;
  category: WritingCategory;
  language: OutputLanguage;
  tone: WritingTone;
  length: WritingLength;
  tag: string;
}
