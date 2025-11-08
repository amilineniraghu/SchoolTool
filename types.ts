// Fix: Define and export the MindMapNode and LoadingState types.
// The original file contained a React component, which was incorrect.
export interface MindMapNode {
  name: string;
  icon: string;
  details?: string;
  children?: MindMapNode[];
}

export type LoadingState = 'idle' | 'extracting' | 'generating' | 'error';
