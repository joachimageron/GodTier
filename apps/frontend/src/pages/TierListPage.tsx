import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent, DragOverEvent } from '@dnd-kit/core';
import type { TierCategory, Logo, TierList } from '@godtier/shared';
import { TIER_CATEGORIES, TIER_DESCRIPTIONS } from '@godtier/shared';
import { tierListApi, logoApi } from '../services/api';

function DraggableLogo({ logo }: { logo: Logo }) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: logo.id,
        data: { logo }
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`w-20 h-20 bg-white rounded shadow-sm border p-1 cursor-grab active:cursor-grabbing flex items-center justify-center relative group ${isDragging ? 'opacity-30' : ''}`}
        >
            <img src={logo.imageUrl} alt={logo.name} className="max-w-full max-h-full object-contain" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded" />
            <span className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-[10px] p-0.5 text-center truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {logo.name}
            </span>
        </div>
    );
}

function TierRow({ category, logos }: { category: TierCategory, logos: Logo[] }) {
    const { setNodeRef, isOver } = useDroppable({
        id: category,
    });

    const colors: Record<TierCategory, string> = {
        S: 'bg-red-400',
        A: 'bg-orange-400',
        B: 'bg-yellow-400',
        C: 'bg-green-400',
        D: 'bg-blue-400',
    };

    return (
        <div className="flex mb-2 min-h-[100px] bg-gray-900 border-2 border-gray-800">
            <div className={`${colors[category]} w-24 flex-shrink-0 flex flex-col items-center justify-center p-2 border-r-2 border-gray-800`}>
                <span className="text-4xl font-black text-white drop-shadow-md">{category}</span>
                <span className="text-xs text-center font-medium mt-1 text-black/60 hidden sm:block">{TIER_DESCRIPTIONS[category]}</span>
            </div>
            <div
                ref={setNodeRef}
                className={`flex-1 p-2 flex flex-wrap gap-2 transition-colors ${isOver ? 'bg-gray-800' : 'bg-gray-700/50'}`}
            >
                {logos.map(logo => (
                    <DraggableLogo key={logo.id} logo={logo} />
                ))}
            </div>
        </div>
    );
}

export function TierListPage() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [selectedLogoId, setSelectedLogoId] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<TierCategory>('S');
    const [activeLogo, setActiveLogo] = useState<Logo | null>(null);

    const { data: tierList, isLoading: listLoading } = useQuery({
        queryKey: ['tierList', id],
        queryFn: () => tierListApi.getOne(id!),
        enabled: !!id,
    });

    const { data: allLogos } = useQuery({
        queryKey: ['logos'],
        queryFn: logoApi.getAll,
    });

    const addLogoMutation = useMutation({
        mutationFn: (data: { id: string; name: string; imageUrl: string; category: TierCategory }) =>
            tierListApi.addLogo(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tierList', id] });
            setSelectedLogoId('');
        }
    });

    const moveLogoMutation = useMutation({
        mutationFn: (data: { logoId: string; categoryId: TierCategory }) =>
            tierListApi.moveLogo(id!, data),
        onMutate: async (newData) => {
            await queryClient.cancelQueries({ queryKey: ['tierList', id] });
            const previousTierList = queryClient.getQueryData<TierList>(['tierList', id]);

            queryClient.setQueryData<TierList>(['tierList', id], (old) => {
                if (!old) return old;

                const newItems = { ...old.items };
                let logo: Logo | undefined;

                for (const cat of TIER_CATEGORIES) {
                    const index = newItems[cat]?.findIndex(l => l.id === newData.logoId);
                    if (index !== undefined && index !== -1) {
                        logo = newItems[cat]![index];
                        newItems[cat] = [...newItems[cat]!];
                        newItems[cat]!.splice(index, 1);
                        break;
                    }
                }

                if (logo) {
                    newItems[newData.categoryId] = [...(newItems[newData.categoryId] || []), logo];
                }

                return { ...old, items: newItems };
            });

            return { previousTierList };
        },
        onError: (_err, _newTodo, context) => {
            queryClient.setQueryData(['tierList', id], context?.previousTierList);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['tierList', id] });
        }
    });

    const handleAddLogo = (e: React.FormEvent) => {
        e.preventDefault();
        const logo = allLogos?.find(l => l.id === selectedLogoId);
        if (logo) {
            addLogoMutation.mutate({
                id: logo.id,
                name: logo.name,
                imageUrl: logo.imageUrl,
                category: selectedCategory
            });
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveLogo(event.active.data.current?.logo as Logo);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const logoId = active.id as string;
        const overId = over.id as string;

        // If over a category container (which is just the category string id)
        const targetCategory = overId as TierCategory;
        if (!TIER_CATEGORIES.includes(targetCategory)) return;

        // Optimistically update the UI by moving the item in the query cache
        queryClient.setQueryData<TierList>(['tierList', id], (old) => {
            if (!old) return old;

            // Find current category
            let currentCategory: TierCategory | undefined;
            for (const cat of TIER_CATEGORIES) {
                if (old.items[cat]?.some(l => l.id === logoId)) {
                    currentCategory = cat;
                    break;
                }
            }

            // If already in the target category, do nothing
            if (!currentCategory || currentCategory === targetCategory) return old;

            const newItems = { ...old.items };

            // Remove from old
            const logo = newItems[currentCategory]!.find(l => l.id === logoId);
            if (!logo) return old;

            newItems[currentCategory] = newItems[currentCategory]!.filter(l => l.id !== logoId);

            // Add to new
            newItems[targetCategory] = [...(newItems[targetCategory] || []), logo];

            return { ...old, items: newItems };
        });
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveLogo(null);

        if (over && active.id) {
            const logoId = active.id as string;
            const targetCategory = over.id as TierCategory;

            if (TIER_CATEGORIES.includes(targetCategory)) {
                moveLogoMutation.mutate({
                    logoId: logoId,
                    categoryId: targetCategory
                });
            }
        }
    };

    if (listLoading) return <div className="p-8 text-center">Loading tier list...</div>;
    if (!tierList) return <div className="p-8 text-center">Tier List not found</div>;

    const totalLogos = Object.values(tierList.items || {}).reduce((acc, curr) => acc + curr.length, 0);

    return (
        <div className="min-h-screen p-12 bg-gray-950 text-white">
            <Link to="/" className="text-gray-400 hover:text-white mb-4 inline-block">&larr; Back to Dashboard</Link>

            <div className="mb-8 flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold mb-2">{tierList.title}</h1>
                    <p className="text-gray-400">{tierList.description}</p>
                </div>

                {/* Add Logo Panel */}
                <div className="bg-gray-900 p-4 rounded border border-gray-800 w-full max-w-md">
                    <h3 className="font-bold mb-2 text-sm uppercase tracking-wider text-gray-400">Add Logo ({totalLogos}/10)</h3>
                    {totalLogos >= 10 ? (
                        <p className="text-red-400 text-sm">Limit of 10 logos reached.</p>
                    ) : (
                        <form onSubmit={handleAddLogo} className="flex gap-2">
                            <select
                                value={selectedLogoId}
                                onChange={e => setSelectedLogoId(e.target.value)}
                                className="flex-1 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                                required
                            >
                                <option value="">Select a logo...</option>
                                {allLogos?.map(logo => (
                                    <option key={logo.id} value={logo.id}>{logo.name}</option>
                                ))}
                            </select>
                            <select
                                value={selectedCategory}
                                onChange={e => setSelectedCategory(e.target.value as TierCategory)}
                                className="w-20 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500"
                            >
                                {TIER_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <button
                                type="submit"
                                disabled={addLogoMutation.isPending || !selectedLogoId}
                                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition disabled:opacity-50"
                            >
                                Add
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver} onDragStart={handleDragStart}>
                <div className="select-none">
                    {TIER_CATEGORIES.map(category => (
                        <TierRow
                            key={category}
                            category={category}
                            logos={tierList.items?.[category] || []}
                        />
                    ))}
                </div>
                <DragOverlay>
                    {activeLogo ? (
                        <div className="w-20 h-20 bg-white rounded shadow-xl border p-1 flex items-center justify-center opacity-80 cursor-grabbing">
                            <img src={activeLogo.imageUrl} alt={activeLogo.name} className="max-w-full max-h-full object-contain" />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
