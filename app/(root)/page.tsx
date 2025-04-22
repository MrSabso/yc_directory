import StartupCard from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";

export default async function Home({ searchParams }: {
  searchParams: Promise<{ query: string }>
}) {
  const query = (await searchParams).query;

  const posts = [{ 
    _createdAt: new Date(),
    views: 55,
    author: { _id: 1, name: 'Smiley'  },
    _id: 1,
    description: 'This is a description',
    image: 'https://www.shop4tesla.com/cdn/shop/articles/teslas-we-robot-event-cybercab-robovan-optimus-und-mehr-489531.jpg?v=1728680993',
    category: 'Robots',
    title: 'We Robots',
   }];

  return (
    <>
      <section className="pink_container">
        <h1 className="heading">Pitch Your Startup, <br /> Connect with entrepreneurs</h1>

        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions.
        </p>

        <SearchForm query={query} />

      </section>
      
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : 'All Startups'}
        </p>

          <ul className="mt-7 card_grid">
            {posts?.length > 0 ? (
              posts.map((post: StartupCardType) => (
                <StartupCard key={post?._id} post={post} />
              ))
            ) : (
              <p className="no-results">No startups found</p>
            )}
          </ul>
      </section>
    </>
  );
}
