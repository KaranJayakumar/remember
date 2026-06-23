export interface Connection {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  workspace_id: string;
  notes?: Note[];
  interactions?: Interaction[];
}

export interface Note {
  id: number;
  content: string;
  created_at: string;
}

export interface Interaction {
  id: number;
  type: string;
  content: string;
  photo_url: string;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner_user_id: string;
}
