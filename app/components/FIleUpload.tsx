// components/FileUpload.tsx
'use client'

import { useState } from 'react'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    alert('File uploaded successfully!')
  }

  return (
    <div>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  )
}
