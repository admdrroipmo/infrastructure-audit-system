import "./globals.css"; 
import { Inter } from "next/font/google"; 
 
const inter = Inter({ subsets: ["latin"] }); 
 
export const metadata = { 
  title: "AuditPH - Infrastructure Audit System", 
  description: "Transparent, data-driven infrastructure auditing for the Philippines", 
}; 
 
export default function RootLayout({ children }) { 
  return ( 
    <html lang="en"> 
      <body className={inter.className}> 
        {children} 
      </body> 
    </html> 
  ); 
} 
