import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
} from '@clerk/nextjs'
import './globals.css'
import StyledComponentsRegistry from '../lib/registry'
import Sidebar from '@/components/Sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-white">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <div className="flex min-h-screen">
              <Sidebar />
              <main className="flex-1">
                <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
              </main>
            </div>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  )
}