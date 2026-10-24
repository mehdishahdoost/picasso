import React from 'react'; import { createRoot } from 'react-dom/client'; import { PicasoEditor } from './Editor'; import './custom-element'
createRoot(document.getElementById('root')!).render(<PicasoEditor />)
