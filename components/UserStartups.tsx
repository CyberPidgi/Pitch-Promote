import { client } from '@/sanity/lib/client'
import { STARTUPS_BY_AUTHOR_QUERY } from '@/sanity/lib/queries'
import React from 'react'
import StartupCard, { StartupCardType } from './StartupCard'

const UserStartups = async ({ authorid }: { authorid: string }) => {

  const startups = await client.fetch(STARTUPS_BY_AUTHOR_QUERY, { id: authorid })

  return (
    <>
      {
        startups.length > 0 ? startups.map((startup: StartupCardType) => (
          <StartupCard key={startup._id} post={startup} />
        )) : <p>No startups found</p>
      }
    </>
  )
}

export default UserStartups