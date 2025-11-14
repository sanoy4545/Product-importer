
import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Webhook } from '../types';

export function useWebhooks() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([])
  const [editingWebhook, setEditingWebhook] = useState<Webhook | null>(null)
  const [showWebhookModal, setShowWebhookModal] = useState(false)
  const API = axios.create({ baseURL: import.meta.env.VITE_API_URL })

  // Fetch webhooks from backend
  const fetchWebhooks = async () => {
    try {
      const response = await API.get('/webhooks/webhooks')
      const items = (response.data.items || []).map((w: any) => ({
        ...w,
        eventType: w.event_type
      }))
      setWebhooks(items)
    } catch (error) {
      console.error('Fetch webhooks error:', error)
    }
  }

  useEffect(() => {
    fetchWebhooks()
  }, [])

  const createWebhook = () => {
    setEditingWebhook({ id: '', url: '', eventType: 'product.created', enabled: true })
    setShowWebhookModal(true)
  }

  const saveWebhook = async (webhook: Webhook) => {
    try {
      if (webhook.id) {
        await API.put(`/webhooks/update_webhook/${webhook.id}`, webhook)
      } else {
        // Remove id and map eventType to event_type for backend
        const { id, eventType, ...rest } = webhook;
        const payload = { ...rest, event_type: eventType };
        await API.post('/webhooks/create_webhook', payload)
      }
      await fetchWebhooks()
      setEditingWebhook(null)
      setShowWebhookModal(false)
      return { status: true, message: 'Webhook saved' }
    } catch (error: any) {
      let message = 'Save webhook error';
      if (error.response && error.response.data && error.response.data.detail) {
        message = error.response.data.detail
      }
      return { status: false, message }
    }
  }

  const deleteWebhook = async (id: string): Promise<boolean> => {
    try {
      // Send id as integer in request body
      await API.delete(`/webhooks/delete_webhook/${id}` )
      await fetchWebhooks()
      return true
    } catch (error) {
      console.error('Delete webhook error:', error)
      return false
    }
  }

  const testWebhook = async (webhook: Webhook): Promise<string> => {
    try {
      const response = await API.post(`/webhooks/test`, { id: webhook.id })
      return response.data.message || 'Webhook test successful!'
    } catch (error) {
      return 'Webhook test failed.'
    }
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
    fetchWebhooks,
  }
}

