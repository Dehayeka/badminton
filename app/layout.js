export const metadata = {
  title: "Badminton Bracket Generator",
  description: "Generate acak bagan pemain badminton",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  );
}
