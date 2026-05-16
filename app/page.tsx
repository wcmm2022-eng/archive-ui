'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [pages, setPages] = useState<any[]>([])

  async function loadPages() {
    const { data } = await supabase
      .from('saved_pages')
      .select('*')
      .order('created_at', { ascending: false })

    setPages(data || [])
  }

  useEffect(() => {
    loadPages()
  }, [])

  async function uploadFiles() {
    if (!files) return

    const folderName = Date.now().toString()

    for (const file of Array.from(files)) {
      await supabase.storage
        .from('saved-pages')
        .upload(`${folderName}/${file.webkitRelativePath || file.name}`, file)
    }

    const htmlFile = Array.from(files).find(f =>
      f.name.endsWith('.htm') || f.name.endsWith('.html')
    )

    await supabase.from('saved_pages').insert({
      title: htmlFile?.name || 'Untitled',
      folder_name: folderName,
    })

    location.reload()
  }

  return (
    <div className="flex h-screen bg-black text-white">
      <div className="w-80 border-r border-zinc-800 p-4">
        <div className="flex justify-between mb-4">
          <h1 className="font-bold text-xl">
            Archives
          </h1>

          <label className="bg-white text-black px-3 py-1 rounded cursor-pointer">
            +
            <input
              hidden
              type="file"
              multiple
              webkitdirectory="true"
              onChange={(e) => setFiles(e.target.files)}
            />
          </label>
        </div>

        {files && (
          <button
            onClick={uploadFiles}
            className="w-full bg-blue-600 p-2 rounded mb-4"
          >
            Upload
          </button>
        )}

        <div className="space-y-2">
          {pages.map((page) => (
            <a
              key={page.id}
              href={`/viewer/${page.folder_name}`}
              className="block bg-zinc-900 p-3 rounded"
            >
              {page.title}
            </a>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center text-zinc-500">
        Upload saved pages
      </div>
    </div>
  )
}
