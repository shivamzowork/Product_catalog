import { Container } from '@/components/ui/Container'

interface HeaderProps {
  title: string
  description?: string
}

export function Header({ title, description }: HeaderProps) {
  return (
    <div className="bg-white border-b border-zinc-200 py-8">
      <Container>
        <h1 className="text-3xl font-bold text-zinc-900">{title}</h1>
        {description && <p className="mt-2 text-zinc-600">{description}</p>}
      </Container>
    </div>
  )
}
