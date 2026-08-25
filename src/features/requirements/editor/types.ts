export type EditableElementKind = 'text' | 'button' | 'image'

export interface EditorRect {
  x: number
  y: number
  width: number
  height: number
}

export interface EditableElementManifest {
  id: string
  kind: EditableElementKind
  label: string
  selector: string
  route: string
  text?: string
  src?: string
  rect: EditorRect
}

export interface ElementPatch {
  elementId: string
  kind: EditableElementKind
  label: string
  selector: string
  route: string
  before: {
    text?: string
    rect: EditorRect
  }
  after: {
    text?: string
    translateX: number
    translateY: number
    scale: number
  }
}

export interface SaveEditorChangesRequest {
  sessionId: string
  previewUrl: string
  viewport: {
    width: number
    height: number
    breakpoint: 'desktop' | 'tablet' | 'mobile'
  }
  instruction: string
  changes: ElementPatch[]
}

export interface SaveEditorChangesResponse {
  jobId: string
  status: 'queued' | 'applied'
  message: string
}

export type FrameToParentMessage =
  | {
      channel: 'demoforge-editor'
      direction: 'frame-to-parent'
      type: 'BRIDGE_READY'
      route: string
    }
  | {
      channel: 'demoforge-editor'
      direction: 'frame-to-parent'
      type: 'ELEMENTS_SYNC'
      elements: EditableElementManifest[]
      route: string
    }
  | {
      channel: 'demoforge-editor'
      direction: 'frame-to-parent'
      type: 'ELEMENT_SELECTED'
      elementId: string
    }
  | {
      channel: 'demoforge-editor'
      direction: 'frame-to-parent'
      type: 'PATCH_CHANGED'
      elementId: string
      patch: ElementPatch['after']
    }

export type ParentToFrameMessage =
  | {
      channel: 'demoforge-editor'
      direction: 'parent-to-frame'
      type: 'SELECT_ELEMENT'
      elementId: string
    }
  | {
      channel: 'demoforge-editor'
      direction: 'parent-to-frame'
      type: 'APPLY_PATCH'
      elementId: string
      patch: Partial<ElementPatch['after']>
    }
  | {
      channel: 'demoforge-editor'
      direction: 'parent-to-frame'
      type: 'RESET_PATCHES'
    }
