import { useQuery } from '@tanstack/react-query'
import type { TierList } from '@godtier/shared'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { tierListApi } from '../services/api'

export function HomePage() {
    const { isAuthenticated, user, logout } = useAuth()

    const { data: tierLists, isLoading } = useQuery<TierList[]>({
        queryKey: ['tierLists'],
        queryFn: tierListApi.getAll,
    })

    // Since the user might be logged out and the API might require auth, we handle errors gracefully?
    // But for now, let's just display what we have.

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">GodTier Lists</h1>
                <div className="space-x-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <span>Welcome, {user?.name || user?.email}</span>
                            <button
                                onClick={logout}
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-x-4">
                            <Link to="/login" className="text-blue-600 hover:text-blue-800 transition">
                                Login
                            </Link>
                            <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div>Loading...</div>
            ) : (
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
                    {!tierLists?.length && (
                        <p className="text-gray-500">No tier lists found.</p>
                    )}
                </div>
            )}
        </div>
    )
}
