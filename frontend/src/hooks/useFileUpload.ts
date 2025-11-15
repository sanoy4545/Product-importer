import { useState } from 'react'
import axios from 'axios'

export function useFileUpload() {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<string>('')
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadStatus('Uploading file...')
    setUploadProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    let taskId = ''
    let message = ''
    try {
      // Send file to backend, get task_id and message in response
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/upload/upload`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      taskId = response.data.task_id || ''
      message = response.data.message || ''
      setUploadStatus(message || 'File uploaded, processing...')
    } catch (error) {
      setUploadStatus('Upload failed')
      setIsUploading(false)
      return
    }

    // Poll progress endpoint using task_id
    setUploadStatus('Processing...')
    const pollProgress = async (taskId: string) => {
      try {
        const progressRes = await axios.get(`${import.meta.env.VITE_API_URL}/upload/progress/${taskId}`)
        const { status, progress, result, } = progressRes.data
        // Robustly extract progress value
        let safePercent = 0;
        if (typeof progress === 'object' && progress !== null && 'progress' in progress) {
          safePercent = progress.progress || 0;
        } else if (typeof progress === 'number') {
          safePercent = progress;
        }
        console.log('Safe Progress value:', safePercent, 'Raw:', progressRes.data);
        setUploadProgress(Number(safePercent));
        if (status === 'PENDING') {
          setUploadStatus('Pending...')
        } else if (status === 'PROGRESS') {
          if (safePercent < 30) {
            setUploadStatus('Parsing CSV...')
          } else if (safePercent < 60) {
            setUploadStatus('Validating...')
          } else if (safePercent < 90) {
            setUploadStatus('Importing products...')
          } else if (safePercent < 100) {
            setUploadStatus('Finalizing...')
          }
        } else if (status === 'SUCCESS') {
          setUploadStatus(result ? String(result) : 'Import Complete')
          setIsUploading(false)
          setTimeout(() => setUploadStatus(''), 5000)
          return // Stop polling when done
        } else if (status === 'FAILURE') {
          setUploadStatus(result ? String(result) : 'Import Failed')
          setIsUploading(false)
          return
        } else {
          setUploadStatus(`Status: ${status}`)
        }
        if (safePercent < 100 && status !== 'FAILURE') {
          setTimeout(() => pollProgress(taskId), 1000)
        }
      } catch {
        setUploadStatus('Error monitoring progress')
        setIsUploading(false)
      }
    }
    pollProgress(taskId)
  }
// ...existing code...

  return {
    uploadProgress,
    uploadStatus,
    isUploading,
    handleFileUpload,
    setUploadStatus,
  }
}

