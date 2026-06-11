import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Video2Pen - Transform YouTube to Handwritten Notes'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#fdfdf0',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '16px solid black',
          padding: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            border: '8px solid black',
            boxShadow: '16px 16px 0px 0px rgba(0,0,0,1)',
            padding: '60px',
            width: '90%',
            height: '80%',
          }}
        >
          {/* Logo / Title */}
          <div
            style={{
              display: 'flex',
              fontSize: 80,
              fontWeight: 900,
              fontStyle: 'italic',
              textTransform: 'uppercase',
              color: 'black',
              letterSpacing: '-2px',
              marginBottom: 20,
            }}
          >
            Video<span style={{ color: '#1890ff' }}>2</span>Pen
          </div>

          {/* Tagline */}
          <div
            style={{
              display: 'flex',
              fontSize: 40,
              fontWeight: 700,
              color: '#333',
              textAlign: 'center',
              marginBottom: 60,
              maxWidth: '80%',
            }}
          >
            Transform any YouTube video into beautiful handwritten study guides.
          </div>

          {/* Call to Action */}
          <div
            style={{
              display: 'flex',
              background: '#1890ff',
              color: 'white',
              fontSize: 36,
              fontWeight: 800,
              padding: '20px 40px',
              border: '6px solid black',
              boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
              textTransform: 'uppercase',
            }}
          >
            Start Generating Notes Free ➔
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
