let deferredPrompt: any = null

export function setDeferredPrompt(event: any) {
  deferredPrompt = event
}

export function getDeferredPrompt() {
  return deferredPrompt
}

export function clearDeferredPrompt() {
  deferredPrompt = null
}
