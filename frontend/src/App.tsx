import { useState } from 'react'
import type { Tab } from './types'
import { Header } from './components/Header'
import { UploadTab } from './components/UploadTab'
import { ProductsTab } from './components/ProductsTab'
import { WebhooksTab } from './components/WebhooksTab'
import { Toaster } from './components/Toaster'
import { ToastProvider, useToastContext } from './contexts/ToastContext'
import { useFileUpload } from './hooks/useFileUpload'

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('upload')
  const { uploadProgress, uploadStatus, isUploading, handleFileUpload, setUploadStatus } = useFileUpload()
  const { toasts, removeToast } = useToastContext()

  return (
    <div className="max-w-[1400px] mx-auto p-8 min-h-screen">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="mt-8">
        {activeTab === 'upload' && (
          <UploadTab
            uploadProgress={uploadProgress}
            uploadStatus={uploadStatus}
            isUploading={isUploading}
            onFileUpload={handleFileUpload}
          />
        )}

        {activeTab === 'products' && (
          <ProductsTab uploadStatus={uploadStatus} setUploadStatus={setUploadStatus} />
        )}

        {activeTab === 'webhooks' && (
          <WebhooksTab uploadStatus={uploadStatus} setUploadStatus={setUploadStatus} />
        )}
      </main>

      <Toaster toasts={toasts} onRemove={removeToast} />
    </div>
  )
}

function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  )
}

export default App
