import { useState } from 'react'

export function useFileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus('Parsing CSV...')
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStatus('Import Complete')
          setIsUploading(false)
          setTimeout(() => setUploadStatus(''), 5000)
          return 100
        }
        if (prev < 30) {
          setUploadStatus('Parsing CSV...')
        } else if (prev < 60) {
          setUploadStatus('Validating...')
        } else if (prev < 90) {
          setUploadStatus('Importing products...')
        } else {
          setUploadStatus('Finalizing...')
        }
        return prev + 5
      })
    }, 200)
  }

  return {
    uploadProgress,
    uploadStatus,
    isUploading,
    handleFileUpload,
    setUploadStatus,
  }
}

