export const Icons = {
  Discord: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
      <path d="M6 6h20v4h2v12h-2v4h-4v-4h-8v4H6v-4H4V10h2V6zm4 6v4h4v-4h-4zm8 0v4h4v-4h-4z" />
    </svg>
  ),
  Github: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
      <path d="M12 4h8v4h4v4h4v8h-4v4h-4v4h-8v-4H8v-4H4v-8h4V8h4V4zm2 8v4h4v-4h-4z" />
    </svg>
  ),
  Reddit: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
      <path d="M10 4h12v4h4v4h2v12h-2v4H10v-4H4V12h2V8h4V4zm2 10v4h8v-4h-8z" />
    </svg>
  ),
  Volume: ({ level }: { level: number }) => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
      <path d="M4 12h8l8-8v24l-8-8H4v-8z" />
      {level > 0 && <path d="M24 12h2v8h-2z" />}
      {level > 0.5 && <path d="M28 8h2v16h-2z" />}
    </svg>
  ),
  Linux: () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor">
      <path d="M16 4c-3.3 0-6 2.7-6 6 0 1.2.4 2.3 1 3.2C8.7 15.1 7 18.3 7 22h2c0-3.9 3.1-7 7-7s7 3.1 7 7h2c0-3.7-1.7-6.9-4-8.8.6-.9 1-2 1-3.2 0-3.3-2.7-6-6-6zm0 2c2.2 0 4 1.8 4 4s-1.8 4-4 4-4-1.8-4-4 1.8-4 4-4z" />
    </svg>
  ),
  Edit: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Trash: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
};
