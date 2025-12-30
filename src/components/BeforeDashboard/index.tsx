import React from 'react'

const BeforeDashboard: React.FC = () => {
  return (
    <div className="mb-6 p-4 bg-[#6D4AF9]/10 rounded-lg border border-[#6D4AF9]/20">
      <h2 className="text-lg font-semibold text-[#6D4AF9]">Welcome to PollWarehouse</h2>
      <p className="text-sm text-gray-600 mt-1">
        Create and manage your polls from this dashboard. Use the sidebar to navigate between collections.
      </p>
    </div>
  )
}

export default BeforeDashboard
