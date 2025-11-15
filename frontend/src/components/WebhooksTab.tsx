
import type { Webhook } from '../types'
import { useWebhooks } from '../hooks/useWebhooks'
import { useToastContext } from '../contexts/ToastContext'
import { useState } from 'react'

interface WebhooksTabProps {
  uploadStatus: string
  setUploadStatus: (status: string) => void
}

export function WebhooksTab({ uploadStatus, setUploadStatus }: WebhooksTabProps) {
  const {
    webhooks,
    editingWebhook,
    setEditingWebhook,
    showWebhookModal,
    setShowWebhookModal,
    createWebhook,
    saveWebhook,
    deleteWebhook,
    testWebhook,
  } = useWebhooks()

  const { showToast } = useToastContext()

  // State for test modal
  const [showTestModal, setShowTestModal] = useState(false)
  const [testJsonBody, setTestJsonBody] = useState<string>('{}')
  const [testWebhookTarget, setTestWebhookTarget] = useState<Webhook | null>(null)

  const handleTestWebhook = (webhook: Webhook) => {
    setTestWebhookTarget(webhook)
    setTestJsonBody('{}')
    setShowTestModal(true)
  }

  const handleSendTestWebhook = async () => {
    if (!testWebhookTarget) return
    setUploadStatus(`Testing webhook: ${testWebhookTarget.url}...`)
    let jsonBody: any = {}
    try {
      jsonBody = JSON.parse(testJsonBody)
    } catch {
      showToast('Invalid JSON body', 'error')
      return
    }
    const result = await testWebhook(testWebhookTarget, jsonBody)
    setUploadStatus(result)
    showToast(result, result.includes('successful') ? 'success' : 'error')
    setTimeout(() => setUploadStatus(''), 3000)
    setShowTestModal(false)
    setTestWebhookTarget(null)
  }

  const handleEditWebhook = (webhook: Webhook) => {
    // Ensure eventType is set correctly
    setEditingWebhook({
      ...webhook,
      eventType: webhook.eventType
    })
    setShowWebhookModal(true)
  }

  const handleSaveWebhook = (webhook: Webhook) => {
    const isEdit = !!webhook.id
    if (!webhook.eventType) {
      showToast('Please select an event type.', 'error')
      return
    }
    saveWebhook(webhook).then((result) => {
      if (result.status) {
        showToast(result.message || (isEdit ? 'Webhook updated successfully' : 'Webhook created successfully'), 'success')
      } else {
        showToast(result.message || 'Failed to save webhook', 'error')
      }
    })
  }

  const handleDeleteWebhook = (id: string) => {
    if (window.confirm('Are you sure you want to delete this webhook?')) {
      deleteWebhook(id).then((success) => {
        if (success) {
          showToast('Webhook deleted successfully', 'success')
        } else {
          showToast('Failed to delete webhook', 'error')
        }
      })
    }
  }

  return (
    <div className="p-4">
      {/* Test Webhook Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000]" onClick={() => setShowTestModal(false)}>
          <div className="bg-[#1a1a1a] p-8 rounded-xl max-w-[500px] w-[90%] border-2 border-[#646cff]" onClick={e => e.stopPropagation()}>
            <h3 className="mt-0 mb-6 text-[#646cff] text-2xl">Test Webhook</h3>
            <label className="block mb-2 font-semibold text-gray-300">JSON Body to Send</label>
            <textarea
              value={testJsonBody}
              onChange={e => setTestJsonBody(e.target.value)}
              rows={8}
              className="w-full px-3 py-3 border border-[#646cff] rounded-md text-base bg-[#242424] text-white box-border mb-6"
              placeholder='{"key": "value"}'
            />
            <div className="flex gap-4 justify-end mt-8">
              <button
                onClick={handleSendTestWebhook}
                className="px-6 py-3 bg-[#646cff] text-white border-none rounded-lg cursor-pointer text-base transition-colors duration-300 hover:bg-[#535bf2]"
              >
                Send Test
              </button>
              <button
                onClick={() => setShowTestModal(false)}
                className="px-6 py-3 bg-gray-500 text-white border-none rounded-lg cursor-pointer text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="m-0 text-3xl">Webhook Configuration</h2>
        <button
          onClick={createWebhook}
          className="px-6 py-3 bg-[#646cff] text-white border-none rounded-lg cursor-pointer text-base transition-colors duration-300 hover:bg-[#535bf2]"
        >
          Add Webhook
        </button>
      </div>

      {/* Webhook Modal */}
      {showWebhookModal && editingWebhook && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-[1000]"
          onClick={() => setShowWebhookModal(false)}
        >
          <div
            className="bg-[#1a1a1a] p-8 rounded-xl max-w-[500px] w-[90%] border-2 border-[#646cff]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mt-0 mb-6 text-[#646cff] text-2xl">
              {editingWebhook.id ? 'Edit Webhook' : 'Create Webhook'}
            </h3>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-300">URL</label>
              <input
                type="text"
                value={editingWebhook.url}
                onChange={(e) => setEditingWebhook({ ...editingWebhook, url: e.target.value })}
                placeholder="https://example.com/webhook"
                className="w-full px-3 py-3 border border-[#646cff] rounded-md text-base bg-[#242424] text-white box-border"
              />
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-gray-300">Event Type</label>
              <select
                value={editingWebhook.eventType}
                onChange={(e) => setEditingWebhook({ ...editingWebhook, eventType: e.target.value })}
                className="w-full px-3 py-3 border border-[#646cff] rounded-md text-base bg-[#242424] text-white box-border"
                required
              >
                <option value="" disabled>Select event type</option>
                <option value="product.created">Product Created</option>
                <option value="product.updated">Product Updated</option>
                <option value="product.deleted">Product Deleted</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block font-semibold text-gray-300">
                <input
                  type="checkbox"
                  checked={editingWebhook.enabled}
                  onChange={(e) => setEditingWebhook({ ...editingWebhook, enabled: e.target.checked })}
                  className="mr-2 w-auto"
                />
                Enabled
              </label>
            </div>
            <div className="flex gap-4 justify-end mt-8">
              <button
                onClick={() => handleSaveWebhook(editingWebhook)}
                className="px-6 py-3 bg-[#646cff] text-white border-none rounded-lg cursor-pointer text-base transition-colors duration-300 hover:bg-[#535bf2]"
              >
                Save
              </button>
              <button
                onClick={() => setShowWebhookModal(false)}
                className="px-6 py-3 bg-gray-500 text-white border-none rounded-lg cursor-pointer text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Webhooks Table */}
      <div className="overflow-x-auto mb-8 border border-[#646cff] rounded-lg">
        <table className="w-full border-collapse bg-[#1a1a1a]">
          <thead>
            <tr>
              <th className="bg-[#646cff] text-white p-4 text-left font-semibold">URL</th>
              <th className="bg-[#646cff] text-white p-4 text-left font-semibold">Event Type</th>
              <th className="bg-[#646cff] text-white p-4 text-left font-semibold">Status</th>
              <th className="bg-[#646cff] text-white p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map((webhook) => (
              <tr key={webhook.id} className="hover:bg-[rgba(100,108,255,0.1)]">
                <td className="p-4 border-b border-[rgba(100,108,255,0.2)]">{webhook.url}</td>
                <td className="p-4 border-b border-[rgba(100,108,255,0.2)]">{webhook.eventType || ''}</td>
                <td className="p-4 border-b border-[rgba(100,108,255,0.2)]">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      webhook.enabled
                        ? 'bg-[rgba(76,175,80,0.2)] text-[#4caf50]'
                        : 'bg-[rgba(244,67,54,0.2)] text-[#f44336]'
                    }`}
                  >
                    {webhook.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td className="p-4 border-b border-[rgba(100,108,255,0.2)]">
                  <button
                    onClick={() => handleTestWebhook(webhook)}
                    className="px-3 py-1 mx-1 bg-[#646cff] text-white border-none rounded-md cursor-pointer text-sm transition-colors duration-300 hover:bg-[#535bf2]"
                  >
                    Test
                  </button>
                  <button
                    onClick={() => handleEditWebhook(webhook)}
                    className="p-2 mx-1 bg-[#646cff] text-white border-none rounded-md cursor-pointer inline-flex items-center justify-center w-8 h-8 transition-colors duration-300 hover:bg-[#535bf2]"
                    title="Edit"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteWebhook(webhook.id)}
                    className="p-2 mx-1 bg-[#f44336] text-white border-none rounded-md cursor-pointer inline-flex items-center justify-center w-8 h-8 transition-colors duration-300 hover:bg-[#d32f2f]"
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {uploadStatus && (
        <p className="mt-4 p-4 rounded-lg bg-[rgba(76,175,80,0.2)] text-[#4caf50] border border-[#4caf50]">
          {uploadStatus}
        </p>
      )}
    </div>
  )
}

