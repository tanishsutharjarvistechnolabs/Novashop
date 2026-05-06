'use client'
import { useLoaderStore } from '@/stores/useLoaderStore'

export default function GlobalLoader() {
  const isLoading = useLoaderStore((s) => s.isLoading)
  const message = useLoaderStore((s) => s.message)

  if (!isLoading) return null

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9998,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
        }}
        className='d-flex flex-column align-items-center gap-3'
      >
        <div
          className="spinner-border text-primary"
          style={{ width: '4rem', height: '4rem' }}
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        {message && (
          <span
            style={{
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 500,
              textAlign: 'center',
              maxWidth: '260px',
            }}
          >
            {message}
          </span>
        )}
      </div>
    </>
  )
}