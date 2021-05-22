import { writable } from "svelte/store";

// Get the value out of storage on load.
let stored = localStorage.userInfo

if (stored === undefined || stored === "") {
    stored = '{}'
}

// Set the stored value or a sane default.
export const userStore = writable(JSON.parse(stored) || {})

// Anytime the store changes, update the local storage value.
userStore.subscribe((value) => localStorage.userInfo = JSON.stringify(value))