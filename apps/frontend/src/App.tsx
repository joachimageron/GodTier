import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { TierList } from '@godtier/shared'
import './App.css'

function App() {
  const { data: tierLists, isLoading } = useQuery<TierList[]>({
    queryKey: ['tierLists'],
    queryFn: async () => {
      const response = await axios.get('/api/tier-lists')
      return response.data
    },
  })

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">GodTier Lists</h1>
      <div className="grid gap-4">
        {tierLists?.map((list) => (
          <div key={list.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{list.title}</h2>
            <p>{list.description}</p>
            <div className="mt-2">
              {list.items.map((item) => (
                <span key={item.id} className="inline-block bg-gray-200 rounded px-2 py-1 text-sm mr-2">
                  {item.content} ({item.rank})
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
