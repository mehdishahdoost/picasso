import type { EditorApi } from './Editor'
import type { PicasoCommand, PicasoDocument } from './model'

export type IframeRequest = { channel: 'picasso'; id: string; type: 'load'|'getDocument'|'execute'|'exportSvg'; payload?: PicasoDocument | PicasoCommand }
export type IframeResponse = { channel: 'picasso'; id: string; ok: boolean; result?: unknown; error?: string }

export function attachIframeBridge(api: EditorApi, allowedOrigin = '*') {
  const listener = (event: MessageEvent<IframeRequest>) => {
    if (allowedOrigin !== '*' && event.origin !== allowedOrigin) return
    const message = event.data
    if (!message || message.channel !== 'picasso') return
    try {
      let result: unknown
      if (message.type === 'load') api.loadDocument(message.payload as PicasoDocument)
      if (message.type === 'getDocument') result = api.getDocument()
      if (message.type === 'exportSvg') result = api.exportSvg()
      if (message.type === 'execute') api.execute?.(message.payload as PicasoCommand)
      event.source?.postMessage({ channel: 'picasso', id: message.id, ok: true, result } satisfies IframeResponse, { targetOrigin: event.origin })
    } catch (error) { event.source?.postMessage({ channel: 'picasso', id: message.id, ok: false, error: String(error) } satisfies IframeResponse, { targetOrigin: event.origin }) }
  }
  window.addEventListener('message', listener)
  return () => window.removeEventListener('message', listener)
}
