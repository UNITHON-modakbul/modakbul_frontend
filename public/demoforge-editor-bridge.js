(() => {
  const CHANNEL = 'demoforge-editor'
  const RUNTIME_ID = 'demoforgeRuntimeId'
  const SELECTED_ATTRIBUTE = 'data-demoforge-selected'
  const elements = new Map()
  const baselines = new Map()
  const patches = new Map()
  let selectedId = null
  let dragState = null
  let scanTimer = null

  const send = (message) => {
    window.parent.postMessage(
      {
        channel: CHANNEL,
        direction: 'frame-to-parent',
        ...message,
      },
      '*',
    )
  }

  const getRoute = () => `${window.location.pathname}${window.location.search}${window.location.hash}`

  const isVisible = (element) => {
    const style = window.getComputedStyle(element)
    const rect = element.getBoundingClientRect()
    return (
      style.display !== 'none' &&
      style.visibility !== 'hidden' &&
      Number(style.opacity) !== 0 &&
      rect.width > 1 &&
      rect.height > 1
    )
  }

  const getDirectText = (element) =>
    Array.from(element.childNodes)
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

  const classify = (element) => {
    const explicitType = element.dataset.demoforgeType
    if (['text', 'button', 'image'].includes(explicitType)) return explicitType
    if (element.matches('img, picture, svg, canvas, video')) return 'image'
    if (element.matches('button, a, [role="button"]')) return 'button'

    const backgroundImage = window.getComputedStyle(element).backgroundImage
    if (backgroundImage && backgroundImage !== 'none' && element.children.length === 0) {
      return 'image'
    }

    return getDirectText(element) ? 'text' : null
  }

  const buildSelector = (element) => {
    if (element.dataset.demoforgeId) {
      return `[data-demoforge-id="${CSS.escape(element.dataset.demoforgeId)}"]`
    }

    const segments = []
    let current = element
    while (current && current !== document.body) {
      const tagName = current.tagName.toLowerCase()
      const siblings = Array.from(current.parentElement?.children || []).filter(
        (sibling) => sibling.tagName === current.tagName,
      )
      const index = siblings.indexOf(current) + 1
      segments.unshift(`${tagName}:nth-of-type(${index})`)
      current = current.parentElement
    }
    return `body > ${segments.join(' > ')}`
  }

  const getElementId = (element, selector) =>
    element.dataset.demoforgeId || `${getRoute()}::${selector}`

  const getLabel = (element, kind) => {
    const text = (element.textContent || '').replace(/\s+/g, ' ').trim()
    return (
      element.dataset.demoforgeLabel ||
      element.getAttribute('aria-label') ||
      element.getAttribute('alt') ||
      text.slice(0, 28) ||
      `${kind} ${element.tagName.toLowerCase()}`
    )
  }

  const toManifest = (id, element, kind, selector) => {
    const rect = element.getBoundingClientRect()
    const manifest = {
      id,
      kind,
      label: getLabel(element, kind),
      selector,
      route: getRoute(),
      rect: {
        x: Number(rect.x.toFixed(1)),
        y: Number(rect.y.toFixed(1)),
        width: Number(rect.width.toFixed(1)),
        height: Number(rect.height.toFixed(1)),
      },
    }

    if (kind !== 'image') manifest.text = element.textContent || ''
    if (element instanceof HTMLImageElement) manifest.src = element.currentSrc || element.src
    return manifest
  }

  const scan = () => {
    elements.clear()
    const manifests = []

    document.body.querySelectorAll('*').forEach((element) => {
      if (
        element.closest('[data-demoforge-editor-ignore]') ||
        element.matches('script, style, link, meta, noscript') ||
        !isVisible(element)
      ) {
        return
      }

      const kind = classify(element)
      if (!kind) return

      const selector = buildSelector(element)
      const id = getElementId(element, selector)
      element.dataset[RUNTIME_ID] = id
      elements.set(id, { element, kind, selector })

      if (!baselines.has(id)) {
        baselines.set(id, {
          text: kind === 'image' ? undefined : element.textContent || '',
          translate: element.style.translate,
          scale: element.style.scale,
        })
      }

      manifests.push(toManifest(id, element, kind, selector))
    })

    send({ type: 'ELEMENTS_SYNC', elements: manifests, route: getRoute() })
  }

  const scheduleScan = () => {
    window.clearTimeout(scanTimer)
    scanTimer = window.setTimeout(scan, 80)
  }

  const selectElement = (elementId) => {
    if (selectedId) {
      elements.get(selectedId)?.element.removeAttribute(SELECTED_ATTRIBUTE)
    }

    selectedId = elementId
    const entry = elements.get(elementId)
    if (!entry) return
    entry.element.setAttribute(SELECTED_ATTRIBUTE, 'true')
    send({ type: 'ELEMENT_SELECTED', elementId })
  }

  const applyPatch = (elementId, incomingPatch, notify = true) => {
    const entry = elements.get(elementId)
    if (!entry) return

    const currentPatch = patches.get(elementId) || {
      translateX: 0,
      translateY: 0,
      scale: 1,
    }
    const patch = { ...currentPatch, ...incomingPatch }
    patches.set(elementId, patch)

    entry.element.style.translate = `${patch.translateX}px ${patch.translateY}px`
    entry.element.style.scale = String(patch.scale)
    if (entry.kind !== 'image' && typeof patch.text === 'string') {
      entry.element.textContent = patch.text
    }

    if (notify) {
      send({ type: 'PATCH_CHANGED', elementId, patch })
      scheduleScan()
    }
  }

  const resetPatches = () => {
    patches.forEach((_, elementId) => {
      const entry = elements.get(elementId)
      const baseline = baselines.get(elementId)
      if (!entry || !baseline) return

      entry.element.style.translate = baseline.translate
      entry.element.style.scale = baseline.scale
      if (entry.kind !== 'image' && typeof baseline.text === 'string') {
        entry.element.textContent = baseline.text
      }
    })
    patches.clear()
    scheduleScan()
  }

  window.addEventListener('message', (event) => {
    if (event.source !== window.parent) return
    const message = event.data
    if (
      !message ||
      message.channel !== CHANNEL ||
      message.direction !== 'parent-to-frame'
    ) {
      return
    }

    if (message.type === 'SELECT_ELEMENT') selectElement(message.elementId)
    else if (message.type === 'APPLY_PATCH') {
      applyPatch(message.elementId, message.patch)
    } else if (message.type === 'RESET_PATCHES') resetPatches()
  })

  document.addEventListener(
    'pointerdown',
    (event) => {
      const element = event.target.closest?.('[data-demoforge-runtime-id]')
      if (!element) return

      const elementId = element.dataset[RUNTIME_ID]
      const currentPatch = patches.get(elementId) || {
        translateX: 0,
        translateY: 0,
        scale: 1,
      }
      selectElement(elementId)
      dragState = {
        elementId,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        translateX: currentPatch.translateX,
        translateY: currentPatch.translateY,
      }
      element.setPointerCapture?.(event.pointerId)
      event.preventDefault()
      event.stopPropagation()
    },
    true,
  )

  document.addEventListener(
    'pointermove',
    (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return
      applyPatch(dragState.elementId, {
        translateX: Number((dragState.translateX + event.clientX - dragState.startX).toFixed(1)),
        translateY: Number((dragState.translateY + event.clientY - dragState.startY).toFixed(1)),
      })
      event.preventDefault()
      event.stopPropagation()
    },
    true,
  )

  document.addEventListener(
    'pointerup',
    (event) => {
      if (!dragState || dragState.pointerId !== event.pointerId) return
      dragState = null
      event.preventDefault()
      event.stopPropagation()
    },
    true,
  )

  const style = document.createElement('style')
  style.dataset.demoforgeEditorIgnore = 'true'
  style.textContent = `
    [data-demoforge-runtime-id] { cursor: move !important; }
    [data-demoforge-selected="true"] {
      outline: 2px solid #4b75ff !important;
      outline-offset: 3px !important;
    }
  `
  document.head.appendChild(style)

  const observer = new MutationObserver(scheduleScan)
  observer.observe(document.body, { childList: true, subtree: true, characterData: true })
  window.addEventListener('popstate', scheduleScan)
  window.addEventListener('hashchange', scheduleScan)
  ;['pushState', 'replaceState'].forEach((method) => {
    const original = window.history[method]
    window.history[method] = function (...args) {
      const result = original.apply(this, args)
      scheduleScan()
      return result
    }
  })
  send({ type: 'BRIDGE_READY', route: getRoute() })
  scan()
})()
