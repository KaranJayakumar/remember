export interface Connection {
  id: string;
  name: string;
  image_url: string;
  workspace_id: string;
  edges: {
    notes?: Note[];
    tags?: Tag[];
    workspace?: Workspace;
  };
}

export interface Tag {
  id: string;
  name: string;
  value: string;
}

export interface Note {
  id: string;
  content: string;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  owner_user_id: string;
}
