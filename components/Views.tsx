import React from 'react'
import Ping from './Ping'
import { STARTUP_VIEWS_QUERY } from '@/sanity/lib/queries'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/write-client'

// import unstable_after from 'next/server'

const Views = async ({ id }: { id: string }) => {

  const { views } = await client.withConfig(
    { useCdn: false }
  ).fetch(STARTUP_VIEWS_QUERY, { id })

  
  await writeClient.patch(id).set({
    views: views + 1
  }).commit()

  return (
    <div className='view-container'>
      <div className="-top-2 -right-2 absolute">
        <Ping/>
      </div>
      <p className="view-text">
        <span className="font-black">
          <span className="text-primary">{views}</span> views
        </span>
      </p>
    </div>
  )
}

export default Views