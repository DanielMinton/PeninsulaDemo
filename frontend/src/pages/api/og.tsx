import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const config = { runtime: 'edge' }

const SITE = 'thepeninsulapickup.com'
const PHONE = '(650) 201-1543'

export default function handler(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city')

  const headline = city ? `Junk Removal in\n${city}, CA` : `The Pickup\nYou Can Count On.`
  const sub = city
    ? `Serving ${city} and the entire SF Peninsula`
    : 'Junk removal, hauling & cleanouts — San Carlos, CA'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0f0f0f',
          padding: '56px 64px',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Orange glow — top left */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            left: '-80px',
            width: '560px',
            height: '380px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(232,93,26,0.22) 0%, transparent 68%)',
            display: 'flex',
          }}
        />
        {/* Subtle glow — bottom right */}
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            right: '-60px',
            width: '400px',
            height: '300px',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(232,93,26,0.07) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Header: logo mark + name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '44px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              backgroundColor: '#e85d1a',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Truck / "P" icon placeholder — Satori-safe SVG */}
            <svg
              width="22"
              height="22"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M3 12L8 4L13 12"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.5 12H10.5"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#faf8f5', fontSize: '19px', fontWeight: 700 }}>
              Peninsula Pick Ups
            </span>
            <span style={{ color: '#6b7585', fontSize: '13px', marginTop: '1px' }}>
              San Carlos, CA · Est. 2021
            </span>
          </div>
        </div>

        {/* Main content area */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          {/* Verified badge */}
          <div style={{ display: 'flex', marginBottom: '22px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                backgroundColor: 'rgba(34,197,126,0.08)',
                border: '1px solid rgba(34,197,126,0.28)',
                borderRadius: '100px',
                padding: '5px 14px',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                  d="M10.5 3L4.5 9 1.5 6"
                  stroke="#22c57e"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span style={{ color: '#22c57e', fontSize: '13px', fontWeight: 600 }}>
                Licensed &amp; Insured · Family Owned
              </span>
            </div>
          </div>

          {/* Headline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              marginBottom: '18px',
            }}
          >
            {headline.split('\n').map((line, i) => (
              <span
                key={i}
                style={{
                  fontSize: city ? '76px' : '80px',
                  fontWeight: 900,
                  lineHeight: 1.02,
                  letterSpacing: '-2.5px',
                  color: i === 1 ? '#e85d1a' : '#faf8f5',
                  display: 'flex',
                }}
              >
                {line}
              </span>
            ))}
          </div>

          {/* Subline */}
          <span style={{ color: '#8a96a8', fontSize: '22px', fontWeight: 400, display: 'flex' }}>
            {sub}
          </span>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #242424',
            paddingTop: '22px',
            marginTop: '28px',
          }}
        >
          <span style={{ color: '#e85d1a', fontSize: '26px', fontWeight: 900 }}>{PHONE}</span>

          <div style={{ display: 'flex', gap: '10px' }}>
            {['Junk Removal', 'Hauling', 'Cleanouts'].map((tag) => (
              <span
                key={tag}
                style={{
                  color: '#515d6e',
                  fontSize: '13px',
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #2e2e2e',
                  borderRadius: '6px',
                  padding: '4px 11px',
                  display: 'flex',
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <span style={{ color: '#3a3a3a', fontSize: '15px', display: 'flex' }}>{SITE}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
