import { auth } from '@/auth'
import { AUTHOR_BY_ID_QUERY } from '@/sanity/lib/queries'
import { client } from '@/sanity/lib/client'
import React, { Suspense } from 'react'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import UserStartups from '@/components/UserStartups'
import { Skeleton } from '@/components/ui/skeleton'
import { StartupCardSkeleton } from '@/components/StartupCard'


export const experimental_ppr = true;

const page = async ({ params }: { params: Promise<{ id: string }>}) => {

  const { id } = await params
  const session = await auth()

  const user = await client.fetch(AUTHOR_BY_ID_QUERY, { id })
  if (!user) return notFound()

  return (
    <>
      <section className="profile_container">
        <div className="profile_card">
          <div className="profile_title">
            <h3 className="line-clamp-1 text-24-black text-center uppercase">
              {user.name}
            </h3>
          </div>

          <Image
            src={user.image}
            alt={user.name}
            width={200}
            height={200}
            className="rounded-full"
          />

          <p className="mt-7 text-30-extrabold text-center">
            @{user?.username}
          </p>
          <p className="mt-1 text-14-normal text-center">
            {user.bio}
          </p>
        </div>

        <div className="flex flex-col flex-1 gap-5 lg:-mt-5">
          <p className="text-30-bold">
            { session?.id === id ? 'Your' : 'All' } Startups
          </p>
          <ul className="card_grid-sm">
            <Suspense fallback={<StartupCardSkeleton/>}>
              <UserStartups authorid={id}/>
            </Suspense>
          </ul>
        </div>
      </section>
    </>
  )
}

export default page