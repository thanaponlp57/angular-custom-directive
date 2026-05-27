export interface DirectiveMeta {
  label: string;
  value: string;
}

export interface DirectiveCode {
  filename: string;
  language: string; // 'html' | 'typescript' — reserved for future highlighting
  content: string;
}

export interface DirectiveDoc {
  slug: string;
  type: string;
  name: string;
  lede: string;
  meta: DirectiveMeta[];
  previewCaption: string;
  code: DirectiveCode;
  notes: string[];
}
