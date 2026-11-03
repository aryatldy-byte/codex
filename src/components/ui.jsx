import { createContext, useContext, useState, useCallback } from 'react'
const Ctx = createContext(null)
export const useUI = () => useContext(Ctx)
export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} onMouseDown={e => e.stopPropagation()}>
        <div className="modal-head"><h3>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="Close">✕</button></div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>)
}
export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const [dlg, setDlg] = useState(null)
  const toast = useCallback((msg, type = 'ok') => {
    const id = Math.random()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])
  const confirm = useCallback(opts => new Promise(res => setDlg({ ...opts, res })), [])
  const close = v => { dlg.res(v); setDlg(null) }
  return (
    <Ctx.Provider value={{ toast, confirm }}>
      {children}
      <div className="toasts" aria-live="polite">{toasts.map(t => <div key={t.id} className={'toast ' + t.type}>{t.msg}</div>)}</div>
      {dlg && (
        <Modal title={dlg.title} onClose={() => close(false)} footer={<>
          <button className="btn ghost" onClick={() => close(false)}>Cancel</button>
          <button className={'btn ' + (dlg.danger ? 'danger' : 'primary')} onClick={() => close(true)}>{dlg.action || 'Confirm'}</button></>}>
          <p>{dlg.message}</p>
        </Modal>)}
    </Ctx.Provider>)
}
