export type ShapeKind = 'rect' | 'ellipse' | 'triangle' | 'diamond' | 'hexagon' | 'parallelogram' | 'text' | 'database' | 'frame' | 'arrow' | 'image' | 'button' | 'textInput' | 'textArea' | 'checkbox' | 'radio' | 'combobox' | 'toggle' | 'slider' | 'link' | 'card' | 'navbar' | 'modal' | 'table' | 'form'
export type Port = 'top'|'right'|'bottom'|'left'
export type WebOption = { label: string; value: string }
export type WebRow = { cells: string[] }
export type WebField = { label: string; type: string }
export type PicasoShape = { id: string; kind: ShapeKind; x: number; y: number; width: number; height: number; rotation?: number; text?: string; imageData?: string; fill?: string; stroke?: string; strokeWidth?: number; opacity?: number; fontSize?: number; textAlign?: 'left'|'center'|'right'; from?: string; to?: string; fromPort?: Port; toPort?: Port; value?: string; placeholder?: string; disabled?: boolean; checked?: boolean; selectedState?: boolean; password?: boolean; groupName?: string; options?: WebOption[]; min?: number; max?: number; step?: number; url?: string; visited?: boolean; items?: string[]; activeItem?: number; content?: string; visible?: boolean; columns?: string[]; rows?: WebRow[]; fields?: WebField[]; variant?: 'primary'|'secondary'|'danger' }
export const portPoint = (shape: PicasoShape, port: Port) => { const point = port === 'top' ? { x: shape.x+shape.width/2, y: shape.y } : port === 'right' ? { x: shape.x+shape.width, y: shape.y+shape.height/2 } : port === 'bottom' ? { x: shape.x+shape.width/2, y: shape.y+shape.height } : { x: shape.x, y: shape.y+shape.height/2 }; const radians=(shape.rotation ?? 0)*Math.PI/180, cx=shape.x+shape.width/2, cy=shape.y+shape.height/2; return { x: cx+(point.x-cx)*Math.cos(radians)-(point.y-cy)*Math.sin(radians), y: cy+(point.x-cx)*Math.sin(radians)+(point.y-cy)*Math.cos(radians) } }
export type PicasoPage = { id: string; name: string; shapes: PicasoShape[] }
export type PicasoDocument = { schemaVersion: 1; documentId: string; pages: PicasoPage[] }
export type PicasoCommand = { type: 'add'|'delete'|'move'|'update'; shape?: PicasoShape; id?: string; dx?: number; dy?: number; patch?: Partial<PicasoShape> }
export const createDocument = (): PicasoDocument => ({ schemaVersion: 1, documentId: crypto.randomUUID(), pages: [{ id: crypto.randomUUID(), name: 'Page 1', shapes: [] }] })
export const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value))
export function applyCommand(document: PicasoDocument, command: PicasoCommand): PicasoDocument {
  const next = clone(document), page = next.pages[0]
  if (command.type === 'add' && command.shape) page.shapes.push(clone(command.shape))
  if (command.type === 'delete' && command.id) page.shapes = page.shapes.filter(s => s.id !== command.id && !(s.kind === 'arrow' && (s.from === command.id || s.to === command.id)))
  const shape = page.shapes.find(s => s.id === command.id)
  if (shape && command.type === 'move') { shape.x += command.dx ?? 0; shape.y += command.dy ?? 0; page.shapes.filter(s => s.kind === 'arrow' && (s.from === shape.id || s.to === shape.id)).forEach(arrow => { const sourceShape = page.shapes.find(s => s.id === arrow.from), targetShape = page.shapes.find(s => s.id === arrow.to); if (!sourceShape || !targetShape || !arrow.fromPort || !arrow.toPort) return; const source = portPoint(sourceShape, arrow.fromPort), target = portPoint(targetShape, arrow.toPort); arrow.x = source.x; arrow.y = source.y; arrow.width = target.x - source.x; arrow.height = target.y - source.y }) }
  if (shape && command.type === 'update') { Object.assign(shape, command.patch); page.shapes.filter(s => s.kind === 'arrow' && (s.from === shape.id || s.to === shape.id)).forEach(arrow => { const sourceShape = page.shapes.find(s => s.id === arrow.from), targetShape = page.shapes.find(s => s.id === arrow.to); if (!sourceShape || !targetShape || !arrow.fromPort || !arrow.toPort) return; const source = portPoint(sourceShape, arrow.fromPort), target = portPoint(targetShape, arrow.toPort); arrow.x = source.x; arrow.y = source.y; arrow.width = target.x - source.x; arrow.height = target.y - source.y }) }
  return next
}
