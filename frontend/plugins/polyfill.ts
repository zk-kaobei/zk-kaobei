import { Buffer } from 'buffer/'
globalThis.Buffer = Buffer as any
globalThis.process.browser = true

declare global {
  interface BigInt {
    toJSON(): string
  }
}
BigInt.prototype.toJSON = function (): string {
  return this.toString() + 'n'
}

export default defineNuxtPlugin((nuxtApp) => {})
