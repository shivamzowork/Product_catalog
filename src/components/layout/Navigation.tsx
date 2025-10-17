import Link from 'next/link'
import { getCurrentUser } from '@/action/user.action'

export async function Navigation() {
  let user = null

  try {
    user = await getCurrentUser()
  } catch (error) {
    console.error('Error fetching user in Navigation:', error)
  }

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-zinc-900">
              Store
            </Link>
            <div className="hidden md:flex gap-6">
              <Link href="/products" className="text-zinc-700 hover:text-zinc-900 transition">
                Shop
              </Link>
              <Link href="/categories" className="text-zinc-700 hover:text-zinc-900 transition">
                Categories
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-zinc-600">
                  {user.email}
                  {user.isAdmin && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Admin
                    </span>
                  )}
                </span>
                <Link href="/admin" className="text-sm text-zinc-700 hover:text-zinc-900">
                  Dashboard
                </Link>
              </>
            ) : (
              <Link href="/admin" className="text-sm text-zinc-700 hover:text-zinc-900">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
