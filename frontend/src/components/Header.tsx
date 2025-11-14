import type { Tab } from '../types'

interface HeaderProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

export function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="mb-8 border-b-2 border-[#646cff] pb-4">
      <h1 className="mb-4 text-4xl text-[#646cff]">Product Importer</h1>
      <nav className="flex gap-4 flex-wrap md:flex-nowrap">
        <button
          className={`px-6 py-3 bg-transparent border-2 border-[#646cff] text-[#646cff] cursor-pointer transition-all duration-300 hover:bg-[rgba(100,108,255,0.1)] ${
            activeTab === 'upload' ? 'bg-[#646cff] text-white' : ''
          }`}
          onClick={() => setActiveTab('upload')}
        >
          Upload CSV
        </button>
        <button
          className={`px-6 py-3 bg-transparent border-2 border-[#646cff] text-[#646cff] cursor-pointer transition-all duration-300 hover:bg-[rgba(100,108,255,0.1)] ${
            activeTab === 'products' ? 'bg-[#646cff] text-white' : ''
          }`}
          onClick={() => setActiveTab('products')}
        >
          Products
        </button>
        <button
          className={`px-6 py-3 bg-transparent border-2 border-[#646cff] text-[#646cff] cursor-pointer transition-all duration-300 hover:bg-[rgba(100,108,255,0.1)] ${
            activeTab === 'webhooks' ? 'bg-[#646cff] text-white' : ''
          }`}
          onClick={() => setActiveTab('webhooks')}
        >
          Webhooks
        </button>
      </nav>
    </header>
  )
}

