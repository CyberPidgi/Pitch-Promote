import Image from "next/image";
import StartupCard, { StartupCardType }  from "@/components/StartupCard";
import SearchForm from "@/components/SearchForm";
// import { client } from "@/sanity/lib/client";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';
export default async function Home({    searchParams } : {
  searchParams: Promise<{query: string}>
}) {

  
  const { query } = await searchParams
  const params = { search : query || null } 
  
  // const posts = await client.fetch(STARTUPS_QUERY)
  const { data: posts } = await sanityFetch({
    query: STARTUPS_QUERY,
    params
  })
  // console.log(JSON.stringify(posts, null, 2))

  const session = await auth()
  console.log("session id: ", session?.id)

  return (
    <>
      <section className="hero pink_container">
        <h1 className="heading">
          Pitch Your StartUps, <br/> Connect with Entrepreneurs
        </h1>

        <p className="!max-w-3xl sub-heading">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions
        </p>

        <SearchForm query={query} />
      </section>

      <section className="startup-cards section_container">
        <p className="text-30-semibold">
          {query ? `Search Results for "${query}"` : 'All Startups'}
        </p>
        <ul className="card_grid mt-7">
          {
            posts?.length > 0 ? posts.map((post: StartupCardType) => (
              <StartupCard key={post?._id} post={post}/>
            )) : <p className="no-results">No startups found</p>
          }
        </ul>
      </section>
      
      {/* component to allow live changes to database to take effect */}
      <SanityLive />
    </>
  );
}

