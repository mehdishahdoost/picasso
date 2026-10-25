# Picasso

Picasso is an embeddable visual editor for web-design wireframes. Create standalone layouts from geometric shapes and web controls, then fine-tune them through a context-sensitive Properties panel.

## Features

- Geometric shapes: rectangle, circle, triangle, diamond, hexagon, and parallelogram
- Web controls: buttons, text inputs, text areas, checkboxes, radio buttons, comboboxes, toggles, sliders, links, cards, navigation bars, modals, tables, and forms
- Context-sensitive Properties panel with position, size, rotation, opacity, typography, fill, stroke, and control-specific values
- Native color pickers for fill and stroke
- Structured editors for combobox options, navigation items, table rows, and form fields
- Drag-and-drop creation, selection, resizing, rotation, inline text editing, and deletion
- Undo and redo history
- Expandable canvas with a bird's-eye minimap for navigation
- React component and custom-element integration

## Development

```bash
pnpm install
pnpm dev
```

Create a production build with:

```bash
pnpm run build
```

Run the test suite with:

```bash
pnpm test
```

## React usage

```tsx
import { PicasoEditor } from './Editor'

export function DesignApp() {
  return <PicasoEditor onChange={document => console.log(document)} />
}
```

The editor exposes an API through `onReady`:

```tsx
<PicasoEditor
  onReady={api => {
    api.getDocument()
    api.loadDocument(document)
    api.execute({ type: 'delete', id: 'shape-id' })
    api.exportSvg()
  }}
/>
```

## Custom element usage

The custom element is registered by importing the application entry point:

```ts
import './main'
```

```html
<picasso-editor></picasso-editor>
```

The element exposes the current document through `value` and emits two events:

```js
const editor = document.querySelector('picasso-editor')

editor.addEventListener('picasso-change', event => {
  console.log(event.detail) // PicasoDocument
})

editor.addEventListener('picasso-ready', event => {
  const api = event.detail
  console.log(api.getDocument())
})
```

## Document model

Documents use the `PicasoDocument` model:

```ts
type PicasoDocument = {
  schemaVersion: 1
  documentId: string
  pages: PicasoPage[]
}
```

Each page contains an ordered list of `PicasoShape` objects. Persist the object received from `picasso-change` and supply it again through the React `initialDocument` prop or the custom-element `value` property.
