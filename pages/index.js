export default function Index() {
  return (
    <div className="background">
      <script src="/scripts/wordle.js" />
      <div className="main" id="main" style={{ display: 'none' }}>
        <h1 className="title">WORDLE</h1>
        <div className="line" />
        <div className="notification-box" id="notification-box" />
        <div className="letter-array" id="letter-array"></div>
        <div className="keyboard" id="keyboard"></div>
      </div>
    </div>
  );
}
