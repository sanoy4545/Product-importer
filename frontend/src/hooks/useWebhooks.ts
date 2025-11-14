import { useState } from 'react'
import type { Webhook } from '../types'

export function useWebhooks() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([
    { id: '1', url: 'https://example.com/webhook1', eventType: 'product.created', enabled: true },
    { id: '2', url: 'https://example.com/webhook2', eventType: 'product.updated', enabled: false },
  ])
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null)
  const [showWebhookModal, setShowWebhookModal] = useState(false)

  const createWebhook = () => {
    setEditingWebhook({ id: '', url: '', eventType: 'product.created', enabled: true })
    setShowWebhookModal(true)
  }

  const saveWebhook = (webhook: Webhook) => {
    if (webhook.id) {
      setWebhooks(webhooks.map((w) => (w.id === webhook.id ? webhook : w)))
    } else {
      setWebhooks([...webhooks, { ...webhook, id: Date.now().toString() }])
    }
    setEditingWebhook(null)
    setShowWebhookModal(false)
  }

  const deleteWebhook = (id: string): boolean => {
    setWebhooks(webhooks.filter((w) => w.id !== id))
    return true
  }

  const testWebhook = async (_webhook: Webhook): Promise<string> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return `Webhook test successful! Response: 200 OK (50ms)`
  }

  return {
    webhooks,
    setWebhooks,
    editingWebhook,
    setEditingWebhook,
    showWebhookModal,
    setShowWebhookModal,
    createWebhook,
    saveWebhook,
    deleteWebhook,
    testWebhook,
  }
}

