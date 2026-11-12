import { useState } from "react"

const STORE = "bfs-dash-tabs"
export const MAX_TABS = 4
const DEFAULTS = ["/dashboard/home", "/dashboard/your-task", "/dashboard/client_meetings", "/dashboard/mail"]
const readSaved = () => {
      try {
            const v = JSON.parse(localStorage.getItem(STORE) || "null")
            return Array.isArray(v) ? v.filter((p) => typeof p === "string") : null
      } catch { return null }
}

// Chosen shortcut paths, limited to pages this person may open.
export default function useTabShortcuts(items) {
      const [saved, setSaved] = useState(readSaved)
      const valid = (list) => list.filter((p, i) => list.indexOf(p) === i && items.some((it) => it.path === p)).slice(0, MAX_TABS)
      const paths = valid(saved && saved.length ? saved : DEFAULTS)
      const final = paths.length ? paths : valid(items.map((i) => i.path))
      const update = (next) => {
            const clean = next.slice(0, MAX_TABS)
            setSaved(clean)
            try { localStorage.setItem(STORE, JSON.stringify(clean)) } catch { /* private mode */ }
      }
      const reset = () => {
            setSaved(null)
            try { localStorage.removeItem(STORE) } catch { /* private mode */ }
      }
      return { paths: final, update, reset, isDefault: !saved }
}

