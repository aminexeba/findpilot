import '@/app/globals.css';
import Topbar from '@/components/head/Topbar';
import Nav from '@/components/navbar/nav';
import TopFooter from '@/components/footer/topfooter';
import BottomFooter from '@/components/footer/bottomfooter';

export const metadata = {
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Topbar />
        <Nav />
        <main>{children}</main>
        <TopFooter />
        <BottomFooter />
      </body>
    </html>
  );
}