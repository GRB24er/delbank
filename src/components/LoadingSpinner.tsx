const LoadingSpinner = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100%',
      background: '#0a0a0f',
      gap: '20px',
    }}
  >
    <div
      style={{
        width: '72px',
        height: '72px',
        background: 'linear-gradient(135deg, #1e40af 0%, #0f172a 100%)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: '32px',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        boxShadow: '0 12px 32px rgba(30, 64, 175, 0.4)',
        animation: 'stb-pulse 1.6s ease-in-out infinite',
      }}
    >
      S
    </div>
    <div style={{ color: '#cbd5e1', fontSize: '14px', fontWeight: 500, letterSpacing: '0.02em' }}>
      Loading…
    </div>
    <style>{`
      @keyframes stb-pulse {
        0%, 100% { transform: scale(1); box-shadow: 0 12px 32px rgba(30, 64, 175, 0.4); }
        50% { transform: scale(1.05); box-shadow: 0 16px 44px rgba(30, 64, 175, 0.6); }
      }
    `}</style>
  </div>
);

export default LoadingSpinner;