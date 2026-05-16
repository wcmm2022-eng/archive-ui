import { supabase } from '@/lib/supabase'

export default async function Viewer({
  params,
}: {
  params: { id: string }
}) {
  const folder = params.id

  const { data } = await supabase.storage
    .from('saved-pages')
    .list(folder)

  const htmlFile = data?.find(
    (f) => f.name.endsWith('.htm') || f.name.endsWith('.html')
  )

  if (!htmlFile) {
    return <div>No html found</div>
  }

  const url =
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}` +
    `/storage/v1/object/public/saved-pages/${folder}/${htmlFile.name}`

  return (
    <iframe
      src={url}
      className="w-full h-screen border-0"
    />
  )
}
