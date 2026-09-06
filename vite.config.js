import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
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

export default defineConfig({
  plugins: [react(), validateSchedulePlugin()],
})
