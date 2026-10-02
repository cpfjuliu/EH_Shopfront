import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export function Modal({title,onClose,children}) {
  const dialog=useRef(null),close=useRef(onClose)
  close.current=onClose
  useEffect(()=>{
    const previous=document.activeElement,node=dialog.current,root=document.getElementById('root')
    const wasInert=root?.inert
    node.showModal()
    if(root)root.inert=true
    const first=node.querySelector('input,button,select,textarea,[tabindex="0"]')
    first?.focus()
    return()=>{node.close();if(root)root.inert=wasInert;if(previous?.isConnected)previous.focus()}
  },[])
  const keys=e=>{
    if(e.key!=='Tab')return
    const items=[...dialog.current.querySelectorAll('button,input,select,textarea,summary,a[href],[tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length)
    if(!items.length){e.preventDefault();dialog.current.focus();return}
    if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items.at(-1).focus()}
    else if(!e.shiftKey&&document.activeElement===items.at(-1)){e.preventDefault();items[0].focus()}
  }
  return createPortal(<dialog ref={dialog} className="ux-dialog" aria-label={title} onCancel={e=>{e.preventDefault();close.current()}} onKeyDown={keys} onClick={e=>{if(e.target===dialog.current)close.current()}}><div className="dialog-body"><div className="dialog-heading"><h2>{title}</h2><button className="button button-secondary" aria-label={`Close ${title}`} onClick={onClose}>Close</button></div>{children}</div></dialog>,document.body)
}
