"use client"

import { AlertTriangle, X } from "lucide-react"

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-200 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500 bg-opacity-20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-100">Confirmation Required</h2>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700 p-1 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-300 leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 pt-0">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-slate-100 rounded-lg font-medium transition-all duration-200 border border-slate-600 hover:border-slate-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
