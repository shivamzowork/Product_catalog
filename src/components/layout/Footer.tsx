import Link from 'next/link'
import { Container } from '@/components/ui/Container'

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <Container>
        <div className="py-8">
          <div className="border-zinc-200 text-center text-sm text-zinc-600">
            © {new Date().getFullYear()} Store. All rights reserved.
          </div>
        </div>
      </Container>
    </footer>
  )
}
