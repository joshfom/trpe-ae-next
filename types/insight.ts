export interface Author {
  name: string;
  title: string;
  avatar: string;
}

export interface Insight {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  category: string;
  readingTime: string;
  author: Author;
  slug: string;
}
