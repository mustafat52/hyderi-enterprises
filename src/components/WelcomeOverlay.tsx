export default function WelcomeOverlay({ name }: { name?: string }) {
  return (
    <div className="welcome-overlay">
      <div className="welcome-mark" />
      <div className="welcome-title">Welcome back{name ? `, ${name}` : ''}</div>
      <div className="welcome-sub">HYDERI ENTERPRISES</div>
    </div>
  )
}