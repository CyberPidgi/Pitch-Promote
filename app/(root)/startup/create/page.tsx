import StartupForm from '@/components/StartupForm'
import React from 'react'

import { auth } from '@/auth'
import { redirect } from 'next/navigation';

const page = async () => {

  const session = await auth();
  if (!session) redirect('/')

  return (
    <>
      <section className="!min-h-[230px] pink_container">
        <h1 className="heading">
          Submit Your Startup Idea
        </h1>
      </section>

      <StartupForm />
    </>
  )
}

export default page