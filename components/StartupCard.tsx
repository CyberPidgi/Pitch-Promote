import React from 'react'
import Image from 'next/image'
import { cn, formatDate } from '@/lib/utils'
import { EyeIcon } from 'lucide-react'
import Link from 'next/link'

import { Author, Startup } from '@/sanity/types'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'

export type StartupCardType = Omit<Startup, 'author'> & { author?: Author }

const StartupCard = ({ post }: { post: StartupCardType }) => {
  return (
    <li className='startup-card group'>
      <div className='flex-between'>
        <p className='startup_card_date'>{formatDate(post._createdAt)}</p>
        <div className='flex items-center gap-1 5'>
          <EyeIcon className='text-primary size-5' />
          <span className='text-16-medium'>{post.views}</span>
        </div>
      </div>

      <div className='flex-between gap-5 mt-5'>
        <div className='flex-1'>
          <Link href={`/user/${post.author?._id}`}>
            <p className='line-clamp-1 text-16-medium'>{post.author?.name}</p>
          </Link>
          <Link href={`/startup/${post._id}`}>
            <h3 className='line-clamp-1 text-26-semibold'>{post.title}</h3>
          </Link>
        </div>

        <Link href={`/user/${post.author?._id}`}>
          <Image
            src={post.author?.image}
            alt='Author'
            width={48}
            height={48}
            className='rounded-full'
          />
        </Link>
      </div>

      <Link href={`/startup/${post._id}`}>
        <p className='startup-card_desc'>{post.description}</p>

        <Image
          src={post.image!}
          alt={post.title!}
          width={870}
          height={480}
          className='startup-card_image'
        />
      </Link>

      <div className='flex-between gap-3 mt-5'>
        <Link href={`/?query=${post.category?.toLowerCase()}`}>
          <p className='text-16-medium'>{post.category}</p>
        </Link>

        <Button className='!group-hover:bg-primary startup-card_btn' asChild>
          <Link href={`/startup/${post._id}`}>Details</Link>
        </Button>
      </div>
    </li>
  )
}

export const StartupCardSkeleton = () => {
  return (
    <>
      {[1, 2, 3, 4].map((index, i) => (
        <li key={cn('skeleton', index)}>
          <Skeleton/>
        </li>
      ))}
    </>
  )
}

export default StartupCard
