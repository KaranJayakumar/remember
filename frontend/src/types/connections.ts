export interface Connection {
  id: string;
  name: string;
  imageUrl: string;
  tags?: Tag[];
  notes?: Note[];
}
export interface Tag {
  name: string;
  value: string;
}

export interface Note {
  content: string;
}

export interface Workspace {
  name: string;
  id: string;
}
