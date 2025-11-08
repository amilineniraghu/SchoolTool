
export interface MindMapNode {
  name: string;
  children?: MindMapNode[];
}

export type LoadingState = 'idle' | 'extracting' | 'generating' | 'error';
