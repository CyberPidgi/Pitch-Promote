import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { auth, signIn, signOut } from '@/auth'

const Navbar = async () => {
  const session = await auth()

  return (
    <header className='bg-white shadow-sm px-5 py-3 font-work-sans'>
      <nav className='flex justify-between items-center'>
        <Link href='/'>
          <Image src='/logo.png' alt='logo' width={144} height={30} />
        </Link>
        <div className='flex items-center gap-5 text-black'>
          {session && session?.user ? (
            <>
              <Link href={'/startup/create'}>
                <span>Create</span>
              </Link>

              <form
                action={async () => {
                  'use server';
                  await signOut({
                    redirectTo: '/',
                  })
                }}
              >
                <button type='submit'>Logout</button>
              </form>

              {console.log(session)}
              <Link href={`/user/${session?.id}`}>
                <span>{session.user?.name}</span>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                'use server'
                await signIn('github')
              }}
            >
              <button type='submit'>Login</button>
            </form>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
