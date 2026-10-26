import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { copyFileSync, mkdirSync, readFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { z } from 'zod'

const ScheduleEntrySchema = z.object({
  twitch_channel: z.string().min(1, 'twitch_channel must not be empty'),
  streamer_name: z.string().min(1, 'streamer_name must not be empty'),
  start_time_utc: z.string().datetime({ message: 'start_time_utc must be a valid ISO 8601 datetime' }),
  end_time_utc: z.string().datetime({ message: 'end_time_utc must be a valid ISO 8601 datetime' }),
  discord_name: z.string(),
}).refine(
  (e) => new Date(e.end_time_utc) > new Date(e.start_time_utc),
  { message: 'end_time_utc must be after start_time_utc' }
)

const ScheduleSchema = z.array(ScheduleEntrySchema).min(1, 'Schedule must have at least one entry')

function validateSchedulePlugin() {
  return {
    name: 'validate-schedule',
    buildStart() {
      const schedulePath = resolve(import.meta.dirname, 'public/schedule.json')
      let raw

      try {
        raw = readFileSync(schedulePath, 'utf-8')
      } catch {
        this.error(`Could not read public/schedule.json — does the file exist?`)
      }

      let parsed
      try {
        parsed = JSON.parse(raw)
      } catch {
        this.error(`public/schedule.json is not valid JSON`)
      }

      const result = ScheduleSchema.safeParse(parsed)
      if (!result.success) {
        const messages = result.error.errors
          .map((e) => `  [${e.path.join('.')}] ${e.message}`)
          .join('\n')
        this.error(`public/schedule.json failed validation:\n${messages}`)
      }

      console.log(`✓ schedule.json valid (${result.data.length} entries)`)
    },
  }
}

// Client-side routes in src/main.jsx. GitHub Pages only serves files that exist,
// so each route gets its own copy of index.html (served with a 200, unlike the
// 404.html fallback, which matters for OBS browser sources).
const STATIC_ROUTES = ['schedule', 'commands', 'overlays', 'overlay/total', 'overlay/recent', 'overlay/top']

function staticRoutesPlugin() {
  return {
    name: 'static-routes',
    apply: 'build',
    writeBundle({ dir }) {
      const index = resolve(dir, 'index.html')
      for (const target of [...STATIC_ROUTES.map((r) => `${r}/index.html`), '404.html']) {
        const dest = resolve(dir, target)
        mkdirSync(dirname(dest), { recursive: true })
        copyFileSync(index, dest)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), validateSchedulePlugin(), staticRoutesPlugin()],
})
