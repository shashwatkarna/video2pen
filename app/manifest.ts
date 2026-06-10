import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Video2Pen - YouTube to Handwritten Notes',
    short_name: 'Video2Pen',
    description: 'Transform YouTube videos into beautiful handwritten study guides instantly.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fdfdf0',
    theme_color: '#fdfdf0',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
