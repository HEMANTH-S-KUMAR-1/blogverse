import { supabase } from '@/lib/supabase'
import PostCard from '@/components/PostCard'
import TipButton from '@/components/TipButton'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { username } = await params
  const decodedName = decodeURIComponent(username)
  return {
    title: `${decodedName} — BlogVerse`,
    description: `Read posts by ${decodedName} on BlogVerse.`,
  }
}

export default async function WriterPage({ params }) {
  const { username } = await params
  const decodedName = decodeURIComponent(username)

  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('author_display_name', decodedName)
    .in('identity_mode', ['pseudonym', 'public'])
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const totalViews = posts?.reduce((sum, p) => sum + (p.views || 0), 0) || 0
  const latestPost = posts?.[0]
  const bio = latestPost?.author_bio
  const upiId = latestPost?.author_upi_id
  const kofiLink = latestPost?.author_kofi_link

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-linear-to-br from-gray-50 to-emerald-50/30 dark:from-gray-900 dark:to-emerald-950/20  p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-emerald-400 to-teal-500  flex items-center justify-center text-white text-2xl font-bold">
              {decodedName[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{decodedName}</h1>
              {bio && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{bio}</p>}
              <div className="flex gap-4 mt-2">
                <span className="text-sm">
                  <strong className="text-gray-900 dark:text-white">{posts?.length || 0}</strong>
                  <span className="text-gray-400 ml-1">posts</span>
                </span>
                <span className="text-sm">
                  <strong className="text-gray-900 dark:text-white">{totalViews}</strong>
                  <span className="text-gray-400 ml-1">views</span>
                </span>
              </div>
            </div>
          </div>
          {(upiId || kofiLink) && (
            <div className="w-full sm:w-auto sm:max-w-xs">
              <TipButton authorName={decodedName} upiId={upiId} kofiLink={kofiLink} />
            </div>
          )}
        </div>
      </div>

      {/* Posts */}
      {posts && posts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-400 text-lg">No posts found for this writer.</p>
        </div>
      )}
    </div>
  )
}
