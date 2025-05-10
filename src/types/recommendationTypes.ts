export interface Recommendation {
  id: string;
  title: string;
  description?: string; // Optional description
  link?: string; // Optional link to related content
  relatedActivityId?: string; // Optional ID of a related activity
  relatedActivityType?: 'quiz' | 'matching' | 'fill-in-the-blanks' | string; // Optional type of related activity
  // Add other properties as needed
}
