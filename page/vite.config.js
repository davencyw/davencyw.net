import { defineConfig } from 'vite'


  export default defineConfig({
    base: '/davencyw.net/', // Set this to match your repository name
    assetsInclude: ['**/projects/**/*.html', '**/projects/**/*.png'], // Include all necessary files under projects/
  })