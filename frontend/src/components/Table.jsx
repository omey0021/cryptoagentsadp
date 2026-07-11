import React from 'react'

export default function Table({ columns, data, onRowClick }) {
  return (
    <div
      className="overflow-x-auto rounded-2xl"
      style={{
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-4 text-left font-medium text-[#4a4a6a]/80 whitespace-nowrap text-xs uppercase tracking-wider">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={row.id || i}
              onClick={() => onRowClick?.(row)}
              className="transition-all duration-200"
              style={{
                borderTop: '1px solid rgba(255,255,255,0.1)',
                background: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                cursor: onRowClick ? 'pointer' : undefined,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)' }}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-3 text-[#1a1a2e] whitespace-nowrap">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-10 text-[#4a4a6a]/50">No data available</div>
      )}
    </div>
  )
}