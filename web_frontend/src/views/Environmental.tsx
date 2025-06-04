import axios from "axios"
import { useEffect } from "react"

export const Environmental = () => {
  useEffect(() => {
    axios.get("")
  }, [])

  return (
    <div style={{ height: '100%', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '24px' }}>
        {[1, 2, 3].map(() => (
          <div style={{ 
            height: '182px',
            flex: '1',
            backgroundColor: '#fff',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)', 
            padding: '20px 24px 8px'
          }}>
            <div>温度</div>
            <div>33c</div>
          </div>
        ))}
      </div>

      <div></div>
    </div>
  )
}