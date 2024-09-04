'use client'

import { useState } from 'react'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadStatus(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        setUploadStatus('File uploaded successfully!')
      } else {
        setUploadStatus('Failed to upload file.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus('An error occurred during upload.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Upload Text File</h2>
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 disabled:opacity-50"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {uploadStatus && (
        <p className={`mt-2 ${uploadStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
          {uploadStatus}
        </p>
      )}
    </div>
  )
}