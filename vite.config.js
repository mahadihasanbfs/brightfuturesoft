import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Same crawlers as vercel.json. On Vercel they are routed to api/seo.js; this does the same in `npm run dev`,
// so a public tunnel (localhost.run, ngrok, cloudflared) shows real link previews while developing.
const SHARE_CRAWLERS = /facebookexternalhit|Facebot|WhatsApp|Twitterbot|LinkedInBot|TelegramBot|Slackbot|Discordbot|Pinterest|SkypeUriPreview|Embedly|vkShare|redditbot|Applebot|Iframely|Mastodon/
const NOT_A_PAGE = /^\/(@|src\/|node_modules\/|api\/)|\.(js|mjs|css|map|json|png|jpe?g|gif|webp|svg|ico|mp4|wav|pdf|txt|xml|woff2?)$/i

const sharePreviews = () => ({
      name: 'share-previews',
      configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                  const url = new URL(req.url, 'http://localhost')
                  if (!SHARE_CRAWLERS.test(req.headers['user-agent'] || '') || NOT_A_PAGE.test(url.pathname)) return next()
                  try {
                        const { default: handler } = await server.ssrLoadModule('/api/seo.js')
                        req.query = { path: url.pathname, type: url.searchParams.get('type') || undefined }
                        res.status = (code) => { res.statusCode = code; return res }
                        res.send = (body) => res.end(body)
                        await handler(req, res)
                  } catch (err) {
                        next(err)
                  }
            })
      },
})

// https://vite.dev/config/
export default defineConfig({
      plugins: [
            tailwindcss(),
            react({
                  babel: {
                        plugins: [['babel-plugin-react-compiler']],
                  },
            }),
            sharePreviews(),
      ],
      server: {
            // Public tunnels used to test link previews from a phone or WhatsApp.
            allowedHosts: ['.lhr.life', '.localhost.run', '.trycloudflare.com', '.ngrok-free.app', '.ngrok.app', '.loca.lt'],
      },
})
