import React from 'react'

interface SearchFiltersProps{
    setShowFilters: (value: React.SetStateAction<boolean>) => void;
    selectedBranch: string;
    setSelectedBranch: (value: React.SetStateAction<string>) => void;
    selectedHall: string
    setSelectedHall: (value: React.SetStateAction<string>) => void;
    selectedBatch: string
    setSelectedBatch: (value: React.SetStateAction<string>) => void;
    branches: string[];
    batches: string[];
    halls: string[];
}

const SearchFilters = ({
    setShowFilters,
    selectedBranch,
    setSelectedBranch,
    selectedHall,
    setSelectedHall,
    selectedBatch,
    setSelectedBatch,
    branches,
    batches,
    halls}:SearchFiltersProps) => {
    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 sm:p-8"
            onClick={() => setShowFilters(false)}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
                    Filter Profiles
                </h2>

                <div className="space-y-5">
                    {/* Branch Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Branch
                        </label>
                        <select
                            value={selectedBranch}
                            onChange={(e) => setSelectedBranch(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-neutral-800 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Branches</option>
                            {branches.map((branch) => (
                                <option key={branch} value={branch}>
                                    {branch}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Hostel Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Hostel
                        </label>
                        <select
                            value={selectedHall}
                            onChange={(e) => setSelectedHall(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-neutral-800 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Hostels</option>
                            {halls.map((hall) => (
                                <option key={hall} value={hall}>
                                    {hall}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Batch Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Batch
                        </label>
                        <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-neutral-800 text-sm border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Batches</option>
                            {batches.map((batch) => (
                                <option key={batch} value={batch}>
                                    {batch}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    onClick={() => setShowFilters(false)}
                    className="w-full mt-6 py-2.5 text-center font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
                >
                    Apply Filters
                </button>
            </div>
        </div>

    )
}

export default SearchFilters