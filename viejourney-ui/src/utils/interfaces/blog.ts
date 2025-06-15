export interface PostData {
  title: string;
  author: string;
  trip: string;
  location: string;
  content: string;
  status: string;
  tags: string[];
  readTime: string;
  featured: boolean;
  coverImage: File | null;
  createdDate: string;
}
