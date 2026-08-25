import { useMutation } from '@tanstack/react-query'
import {
  Check,
  ImageIcon,
  Layers3,
  LoaderCircle,
  Minus,
  MousePointer2,
  Plus,
  RotateCcw,
  Save,
  SlidersHorizontal,
  Type,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '../../../utils/cn.ts'
import { saveEditorChanges } from '../editor/api.ts'
import { demoEditorDocument } from '../editor/demoDocument.ts'
import type {
  EditableElementManifest,
  ElementPatch,
  FrameToParentMessage,
  ParentToFrameMessage,
} from '../editor/types.ts'

interface InteractiveServiceEditorProps {
  sessionId: string
  previewUrl?: string
}

const emptyPatch = (element?: EditableElementManifest): ElementPatch['after'] => ({
  text: element?.text,
  translateX: 0,
  translateY: 0,
  scale: 1,
})

const isFrameMessage = (value: unknown): value is FrameToParentMessage => {
  if (!value || typeof value !== 'object') return false
  const message = value as Partial<FrameToParentMessage>
  return (
    message.channel === 'demoforge-editor' &&
    message.direction === 'frame-to-parent' &&
    typeof message.type === 'string'
  )
}

export function InteractiveServiceEditor({
  sessionId,
  previewUrl,
}: InteractiveServiceEditorProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const baselineTextRef = useRef(new Map<string, string | undefined>())
  const [elements, setElements] = useState<EditableElementManifest[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [patches, setPatches] = useState<Record<string, ElementPatch['after']>>({})
  const [route, setRoute] = useState('/')
  const [zoom, setZoom] = useState(100)
  const [isBridgeReady, setIsBridgeReady] = useState(false)
  const [isLayersOpen, setIsLayersOpen] = useState(false)
  const [isInspectorOpen, setIsInspectorOpen] = useState(false)

  const selectedElement = elements.find((element) => element.id === selectedId)
  const selectedPatch = selectedId
    ? patches[selectedId] ?? emptyPatch(selectedElement)
    : emptyPatch()

  const frameOrigin = useMemo(() => {
    if (!previewUrl) return '*'

    try {
      return new URL(previewUrl, window.location.href).origin
    } catch {
      return '*'
    }
  }, [previewUrl])

  const sendToFrame = (message: ParentToFrameMessage) => {
    iframeRef.current?.contentWindow?.postMessage(message, frameOrigin)
  }

  useEffect(() => {
    setIsBridgeReady(false)
    setElements([])
    setSelectedId(null)
    setPatches({})
    baselineTextRef.current.clear()
  }, [previewUrl])

  useEffect(() => {
    const handleMessage = (event: MessageEvent<unknown>) => {
      if (event.source !== iframeRef.current?.contentWindow) return
      if (frameOrigin !== '*' && event.origin !== frameOrigin) return
      if (!isFrameMessage(event.data)) return

      const message = event.data
      if (message.type === 'BRIDGE_READY') {
        setIsBridgeReady(true)
        setRoute(message.route)
        return
      }

      if (message.type === 'ELEMENTS_SYNC') {
        message.elements.forEach((element) => {
          if (!baselineTextRef.current.has(element.id)) {
            baselineTextRef.current.set(element.id, element.text)
          }
        })
        setElements(message.elements)
        setRoute(message.route)
        setSelectedId((current) =>
          current && message.elements.some((element) => element.id === current)
            ? current
            : message.elements[0]?.id ?? null,
        )
        return
      }

      if (message.type === 'ELEMENT_SELECTED') {
        setSelectedId(message.elementId)
        return
      }

      if (message.type === 'PATCH_CHANGED') {
        setPatches((current) => ({
          ...current,
          [message.elementId]: {
            ...(current[message.elementId] ?? emptyPatch()),
            ...message.patch,
          },
        }))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [frameOrigin])

  const changes = useMemo<ElementPatch[]>(
    () =>
      Object.entries(patches).flatMap(([elementId, patch]) => {
        const element = elements.find((item) => item.id === elementId)
        if (!element) return []

        const beforeText = baselineTextRef.current.get(elementId)
        const hasTextChange =
          element.kind !== 'image' &&
          typeof patch.text === 'string' &&
          patch.text !== beforeText
        const hasLayoutChange =
          patch.translateX !== 0 || patch.translateY !== 0 || patch.scale !== 1
        if (!hasTextChange && !hasLayoutChange) return []

        return [
          {
            elementId,
            kind: element.kind,
            label: element.label,
            selector: element.selector,
            route: element.route,
            before: { text: beforeText, rect: element.rect },
            after: patch,
          },
        ]
      }),
    [elements, patches],
  )

  const saveMutation = useMutation({
    mutationFn: saveEditorChanges,
  })

  const selectElement = (elementId: string) => {
    setSelectedId(elementId)
    sendToFrame({
      channel: 'demoforge-editor',
      direction: 'parent-to-frame',
      type: 'SELECT_ELEMENT',
      elementId,
    })
  }

  const applyPatch = (patch: Partial<ElementPatch['after']>) => {
    if (!selectedId) return

    setPatches((current) => ({
      ...current,
      [selectedId]: {
        ...(current[selectedId] ?? emptyPatch(selectedElement)),
        ...patch,
      },
    }))
    saveMutation.reset()
    sendToFrame({
      channel: 'demoforge-editor',
      direction: 'parent-to-frame',
      type: 'APPLY_PATCH',
      elementId: selectedId,
      patch,
    })
  }

  const resetChanges = () => {
    setPatches({})
    saveMutation.reset()
    sendToFrame({
      channel: 'demoforge-editor',
      direction: 'parent-to-frame',
      type: 'RESET_PATCHES',
    })
  }

  const handleSave = () => {
    if (changes.length === 0) return

    const frameWidth = iframeRef.current?.clientWidth ?? 0
    const frameHeight = iframeRef.current?.clientHeight ?? 0
    const breakpoint =
      frameWidth < 640 ? 'mobile' : frameWidth < 1024 ? 'tablet' : 'desktop'

    saveMutation.mutate({
      sessionId,
      previewUrl: previewUrl ?? 'srcdoc://demoforge-editor-demo',
      viewport: {
        width: frameWidth,
        height: frameHeight,
        breakpoint,
      },
      instruction:
        '사용자가 iframe 편집기에서 지정한 텍스트, 위치, 크기 변경만 소스 코드에 반영하세요. 기존 기능과 이벤트 로직은 변경하지 마세요.',
      changes,
    })
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-[#222625] text-[#eff2ec]">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/10 bg-[#292d2c] px-2 sm:px-3">
        <div className="flex items-center gap-1.5">
          <span className="grid size-8 place-items-center rounded-lg bg-[#4b75ff] text-white">
            <MousePointer2 aria-hidden="true" fill="currentColor" size={15} />
          </span>
          <button
            aria-expanded={isLayersOpen}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-black transition',
              isLayersOpen
                ? 'bg-white/12 text-white'
                : 'text-white/55 hover:bg-white/7 hover:text-white',
            )}
            onClick={() => {
              setIsLayersOpen((current) => !current)
              setIsInspectorOpen(false)
            }}
            type="button"
          >
            <Layers3 size={14} />
            <span className="hidden sm:inline">요소 {elements.length}</span>
          </button>
          <button
            aria-expanded={isInspectorOpen}
            className={cn(
              'inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-black transition',
              isInspectorOpen
                ? 'bg-white/12 text-white'
                : 'text-white/55 hover:bg-white/7 hover:text-white',
            )}
            disabled={!selectedElement}
            onClick={() => {
              setIsInspectorOpen((current) => !current)
              setIsLayersOpen(false)
            }}
            type="button"
          >
            <SlidersHorizontal size={14} />
            <span className="hidden sm:inline">속성</span>
          </button>
        </div>

        <div className="hidden min-w-0 items-center gap-2 font-mono text-[10px] font-bold text-white/55 md:flex">
          <span
            className={cn(
              'size-2 shrink-0 rounded-full',
              isBridgeReady ? 'bg-[#d9ef7d]' : 'animate-pulse bg-[#ec6b42]',
            )}
          />
          <span className="max-w-48 truncate">{route}</span>
          {selectedElement && (
            <>
              <span className="text-white/20">/</span>
              <span className="max-w-32 truncate">{selectedElement.label}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            aria-label="축소"
            className="grid size-8 place-items-center rounded-lg text-white/65 hover:bg-white/7 hover:text-white"
            onClick={() => setZoom((current) => Math.max(70, current - 10))}
            type="button"
          >
            <Minus size={14} />
          </button>
          <span className="w-9 text-center font-mono text-[10px] font-bold text-white/55">
            {zoom}%
          </span>
          <button
            aria-label="확대"
            className="grid size-8 place-items-center rounded-lg text-white/65 hover:bg-white/7 hover:text-white"
            onClick={() => setZoom((current) => Math.min(100, current + 10))}
            type="button"
          >
            <Plus size={14} />
          </button>
          <button
            className="ml-1 inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#4b75ff] px-3 text-[11px] font-black text-white disabled:opacity-45"
            disabled={changes.length === 0 || saveMutation.isPending}
            onClick={handleSave}
            type="button"
          >
            {saveMutation.isPending ? (
              <LoaderCircle className="animate-spin" size={14} />
            ) : saveMutation.isSuccess ? (
              <Check size={14} />
            ) : (
              <Save size={14} />
            )}
            <span className="hidden sm:inline">
              {saveMutation.isPending
                ? 'AI 수정 요청 중'
                : saveMutation.isSuccess
                  ? '요청 완료'
                  : `변경 저장${changes.length ? ` ${changes.length}` : ''}`}
            </span>
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        <div className="demo-grid-dark absolute inset-0 grid place-items-center overflow-hidden bg-[#171a19] p-2 sm:p-3">
          {!isBridgeReady && (
            <div className="absolute inset-0 z-20 grid place-items-center bg-[#171a19]/75 backdrop-blur-sm">
              <div className="text-center">
                <LoaderCircle className="mx-auto animate-spin text-[#d9ef7d]" size={24} />
                <p className="mt-3 text-xs font-black">편집 가능한 요소를 찾고 있어요.</p>
              </div>
            </div>
          )}
          <iframe
            className="aspect-[16/9] max-h-full max-w-full rounded-md border-0 bg-[#fffaf1] shadow-[0_18px_55px_rgba(0,0,0,0.42)] transition-[width] duration-200"
            ref={iframeRef}
            sandbox="allow-forms allow-same-origin allow-scripts"
            src={previewUrl}
            srcDoc={previewUrl ? undefined : demoEditorDocument}
            style={{ width: `${zoom}%` }}
            title="AI가 생성한 서비스 편집 화면"
          />
          <p className="pointer-events-none absolute bottom-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-bold text-white/28">
            iframe 안의 요소를 선택하고 드래그해 이동할 수 있어요.
          </p>
        </div>

        {isLayersOpen && (
          <aside className="absolute left-3 top-3 z-30 max-h-[calc(100%-1.5rem)] w-56 overflow-y-auto rounded-xl border border-white/12 bg-[#292d2c]/96 shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#292d2c] px-3 py-2.5">
              <p className="flex items-center gap-2 text-[10px] font-black tracking-[0.12em] text-white/55">
                <Layers3 size={13} /> ELEMENTS · {elements.length}
              </p>
              <button
                aria-label="요소 목록 닫기"
                className="grid size-6 place-items-center rounded-md text-white/40 hover:bg-white/8 hover:text-white"
                onClick={() => setIsLayersOpen(false)}
                type="button"
              >
                <X size={13} />
              </button>
            </div>
            <div className="space-y-1 p-2">
              {elements.map((element) => (
                <button
                  className={cn(
                    'flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[11px] font-bold transition',
                    selectedId === element.id
                      ? 'bg-[#4b75ff] text-white'
                      : 'text-white/55 hover:bg-white/7 hover:text-white',
                  )}
                  key={element.id}
                  onClick={() => {
                    selectElement(element.id)
                    setIsLayersOpen(false)
                    setIsInspectorOpen(true)
                  }}
                  type="button"
                >
                  {element.kind === 'image' ? (
                    <ImageIcon size={13} />
                  ) : (
                    <Type size={13} />
                  )}
                  <span className="min-w-0 flex-1 truncate">{element.label}</span>
                  <span className="font-mono text-[8px] uppercase text-white/25">
                    {element.kind}
                  </span>
                </button>
              ))}
            </div>
          </aside>
        )}

        {isInspectorOpen && selectedElement && selectedId && (
          <aside className="absolute bottom-3 right-3 top-3 z-30 flex w-64 min-h-0 flex-col overflow-y-auto rounded-xl border border-white/12 bg-[#292d2c]/96 shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#292d2c] px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-[9px] font-black tracking-[0.12em] text-white/35">
                  PROPERTIES
                </p>
                <p className="truncate text-xs font-black">{selectedElement.label}</p>
              </div>
              <button
                aria-label="속성 패널 닫기"
                className="grid size-7 shrink-0 place-items-center rounded-lg text-white/40 hover:bg-white/8 hover:text-white"
                onClick={() => setIsInspectorOpen(false)}
                type="button"
              >
                <X size={14} />
              </button>
            </div>

            <div className="border-b border-white/10 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black tracking-[0.12em] text-white/40">
                  MOVE
                </p>
                <button
                  aria-label="모든 변경 초기화"
                  className="grid size-7 place-items-center rounded-lg text-white/45 hover:bg-white/7 hover:text-white"
                  onClick={resetChanges}
                  type="button"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {(['translateX', 'translateY'] as const).map((axis) => (
                  <label
                    className="flex items-center gap-1.5 rounded-lg bg-[#1e2221] px-2 py-2"
                    key={axis}
                  >
                    <span className="font-mono text-[10px] font-black uppercase text-white/30">
                      {axis === 'translateX' ? 'X' : 'Y'}
                    </span>
                    <input
                      aria-label={`${axis} 이동값`}
                      className="min-w-0 flex-1 bg-transparent text-right font-mono text-xs font-bold outline-none"
                      onChange={(event) =>
                        applyPatch({ [axis]: Number(event.target.value) })
                      }
                      type="number"
                      value={Math.round(selectedPatch[axis])}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="border-b border-white/10 p-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black tracking-[0.12em] text-white/40">
                  SIZE
                </p>
                <span className="font-mono text-[10px] font-black text-[#d9ef7d]">
                  {Math.round(selectedPatch.scale * 100)}%
                </span>
              </div>
              <input
                aria-label="선택 요소 크기"
                className="mt-3 w-full accent-[#4b75ff]"
                max={1.8}
                min={0.5}
                onChange={(event) => applyPatch({ scale: Number(event.target.value) })}
                step={0.05}
                type="range"
                value={selectedPatch.scale}
              />
            </div>

            {selectedElement.kind !== 'image' && (
              <div className="border-b border-white/10 p-3">
                <label
                  className="text-[10px] font-black tracking-[0.12em] text-white/40"
                  htmlFor="selected-element-content"
                >
                  TEXT CONTENT
                </label>
                <textarea
                  className="mt-2 min-h-24 w-full resize-none rounded-xl border border-white/10 bg-[#1e2221] p-2.5 text-xs font-semibold leading-relaxed text-white outline-none transition focus:border-[#4b75ff] focus:ring-2 focus:ring-[#4b75ff]/20"
                  id="selected-element-content"
                  onChange={(event) => applyPatch({ text: event.target.value })}
                  value={selectedPatch.text ?? ''}
                />
              </div>
            )}

            <div className="p-3">
              <p className="text-[10px] font-black tracking-[0.12em] text-white/40">
                SOURCE TARGET
              </p>
              <p className="mt-2 break-all rounded-lg bg-[#1e2221] p-2 font-mono text-[9px] leading-relaxed text-white/35">
                {selectedElement.id}
              </p>
              <p className="mt-2 break-all font-mono text-[8px] leading-relaxed text-white/25">
                {selectedElement.selector}
              </p>
            </div>
          </aside>
        )}

        {(saveMutation.isSuccess || saveMutation.isError) && (
          <div
            className={cn(
              'absolute bottom-4 left-1/2 z-40 -translate-x-1/2 rounded-full px-4 py-2 text-[11px] font-black shadow-lg',
              saveMutation.isSuccess
                ? 'bg-[#d9ef7d] text-[#17332f]'
                : 'bg-[#ec6b42] text-white',
            )}
          >
            {saveMutation.isSuccess
              ? saveMutation.data.message
              : '수정 요청을 전송하지 못했어요.'}
          </div>
        )}
      </div>
    </div>
  )
}
