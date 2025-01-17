import { formatDate } from '@/lib/utils'
import { client } from '@/sanity/lib/client'
import { PLAYLIST_BY_SLUG_QUERY, STARTUPS_BY_ID_QUERY } from '@/sanity/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import React, { Suspense } from 'react'
import Image from 'next/image'

import markdownit from 'markdown-it'
import { Skeleton } from '@/components/ui/skeleton'
import Views from '@/components/Views'
import StartupCard, { StartupCardType } from '@/components/StartupCard'

const md = markdownit()
export const experimental_ppr = true

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

  const [post, { select: crowdPicks }] = await Promise.all([
    client.fetch(STARTUPS_BY_ID_QUERY, { id }),
    client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: 'crowd-favourites' }),
  ])

  // const post = await client.fetch(STARTUPS_BY_ID_QUERY, { id })

  // const { select: crowdPicks } = await client.fetch(PLAYLIST_BY_SLUG_QUERY, {
  //   slug: 'crowd-favourites',
  // })

  if (!post) return notFound()

  const parsedContent = md.render(post?.pitch || '')

  return (
    <>
      <section className='!min-h-[230px] pink_container'>
        <p className='tag'>{formatDate(post?._createdAt)}</p>
        <h1 className='heading'>{post.title}</h1>
        <p className='!max-w-5xl sub-heading'>{post.description}</p>
      </section>

      <section className='section_container'>
        {/* have to specify width height and sizes to use Image component when width and height are unknown */}
        <Image
          src={post.image}
          alt={post.title}
          width={0}
          height={0}
          sizes='100vw'
          className='rounded-xl w-full h-auto'
        />

        <div className='space-y-5 mx-auto mt-10 max-w-4xl'>
          <div className='flex-between gap-5'>
            <Link
              href={`/user/${post.author?._id}`}
              className='flex items-center gap-2 mb-3'
            >
              <Image
                src={post.author?.image}
                alt={post.author?.name}
                width={64}
                height={64}
                className='drop-shadow-lg rounded-full'
              />

              <div className='text-20-medium'>
                <p>{post.author?.name}</p>
                <div className='!text-black-300 text-16-medium'>
                  <p>@{post.author?.username}</p>
                </div>
              </div>
            </Link>

            <p className='category-tag'>{post.category}</p>
          </div>
          <h3 className='text-30-bold'>Startup Details</h3>
          {parsedContent ? (
            <article
              dangerouslySetInnerHTML={{ __html: parsedContent }}
              className='max-w-4xl font-work-sans prose'
            />
          ) : (
            <p className='no-result'>No details provided</p>
          )}
        </div>

        <hr className='divider' />

        {
          crowdPicks.length > 0 ? (
          <div className="mx-auto max-w-4xl">
            <p className="text-30-semibold">Crowd Favourite</p>
            <ul className="card_grid-sm mt-7">
              {crowdPicks.map((post: StartupCardType, index: number) => (
                <StartupCard key={index} post={post}/>
              ))}
            </ul>
          </div>
          ) : (
            <p>Loading</p>
          )
        }
      </section>
      
      {/*
        we wrap it in suspense to ensure 
        immediate changes take effect for this content, while the above content is statically generated
       */}
      <Suspense
        fallback={
          <Skeleton
            className='view_skeleton'
          />
        }
      >
        <Views id={id}/>
      </Suspense>
    </>
  )
}

export default page
