import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Portfolio AI | Your next chapter', description: 'A contextual portfolio copilot for designers.', icons: { icon: '/favicon.svg' } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
