export interface IComment {
  _id: string;
  blogId: string;
  parentId: string | null;
  content: string;
  commentBy: {
    _id: string;
    fullName: string;
    avatar: {
      _id: string;
      url: string;
    };
  };
  replies: string[];
  totalReplies: number;
  totalChildren: number;
  likes: string[];
  edited: boolean;
  editedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICommentParams {
  blogId: string;
  parentId?: string;
  limit?: number;
  skip?: number;
}

export interface CreateCommentPayload {
  blogId: string;
  content: string;
  parentId?: string;
}
