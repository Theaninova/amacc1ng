import {writable} from "svelte/store"

/** @type {import('svelte/store').Writable<import('./device.js').CharaDevice>} */
export const serialPort = writable()

/** @type {import('svelte/store').Writable<Array<{type: 'input' | 'output' | 'system'; value: string}>>} */
export const serialLog = writable([])

/** @type {import('svelte/store').Writable<Array<{actions: number[]; phrase: string}>>} */
export const chords = writable([])

/** @type {import('svelte/store').Writable<boolean>} */
export const syncing = writable(false)