declare global {
  interface Window {
    MiniKit?: {
      on?: (event: string, callback: () => void) => void
      off?: (event: string, callback: () => void) => void
    }
  }
}

export {}
