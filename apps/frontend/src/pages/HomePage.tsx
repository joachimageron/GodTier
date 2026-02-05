import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { TierList } from '@godtier/shared'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { tierListApi } from '../services/api'

export function HomePage() {
    const { isAuthenticated, user, logout } = useAuth()
    const queryClient = useQueryClient()
    const [isCreating, setIsCreating] = useState(false)
    const [newTitle, setNewTitle] = useState('')

    const { data: tierLists, isLoading } = useQuery<TierList[]>({
        queryKey: ['myTierLists'],
        queryFn: tierListApi.getMyLists,
        enabled: isAuthenticated,
    })

    const createMutation = useMutation({
        mutationFn: tierListApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myTierLists'] })
            setIsCreating(false)
            setNewTitle('')
        }
    })

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault()
        if (newTitle.trim()) {
            createMutation.mutate({ title: newTitle })
        }
    }

    const handleDownloadPdf = async () => {
        try {
            const blob = await tierListApi.downloadSummary();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'tier-lists-summary.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Failed to download PDF summary', error);
            alert('Failed to download PDF summary');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">GodTier Lists</h1>
                <div className="space-x-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <span className="text-gray-600">Welcome, {user?.name || user?.email}</span>
                            <button
                                onClick={handleDownloadPdf}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>
                                PDF Summary
                            </button>
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

            {isAuthenticated && (
                <div className="mb-8">
                    {!isCreating ? (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition flex items-center gap-2 font-semibold"
                        >
                            <span>+</span> Create New Tier List
                        </button>
                    ) : (
                        <form onSubmit={handleCreate} className="bg-white p-6 rounded-lg shadow-md max-w-md border border-gray-100">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">New Tier List</h3>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="e.g. Best Burgers"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createMutation.isPending}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50 font-semibold"
                                >
                                    {createMutation.isPending ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {!isAuthenticated ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Join to create your own Tier Lists</h2>
                    <p className="text-gray-600 mb-6">Rank everything from logos to legends.</p>
                </div>
            ) : isLoading ? (
                <div className="text-center py-10 text-gray-500">Loading your lists...</div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tierLists?.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <p className="text-lg">You haven't created any Tier Lists yet.</p>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="text-blue-600 hover:underline mt-2"
                            >
                                Create your first one now!
                            </button>
                        </div>
                    )}
                    {tierLists?.map((list) => (
                        <Link key={list.id} to={`/tier-lists/${list.id}`} className="block">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer group h-full flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">{list.title}</h3>
                                </div>
                                <p className="text-gray-600 mb-4 text-sm line-clamp-2 flex-grow">{list.description || 'No description provided.'}</p>
                                <div className="flex justify-between items-end border-t pt-4 mt-auto">
                                    <span className="text-xs text-gray-400">
                                        {new Date(list.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                    </span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        {Object.values(list.items || {}).reduce((acc, curr) => acc + (curr as any[]).length, 0)} Logos
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
