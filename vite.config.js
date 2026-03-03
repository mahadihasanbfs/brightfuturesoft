import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
      plugins: [
            tailwindcss(),
            react({
                  babel: {
                        plugins: [['babel-plugin-react-compiler']],
                  },
            }),
            
      ],
//       server: {
//     allowedHosts: ['1f3a8d585ef8c6.lhr.life']
//   }
})
