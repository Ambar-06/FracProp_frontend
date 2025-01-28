import './globals.css';

export const metadata = {
  title: 'FracProp',
  description: 'Invest in fractional properties and earn rental income.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
