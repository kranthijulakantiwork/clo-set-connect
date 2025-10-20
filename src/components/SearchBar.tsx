"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSearchKeyword } from "../store/contentSlice"
import type { RootState } from "../store/store"

export default function SearchBar() {
  const dispatch = useDispatch()
  const searchKeyword = useSelector((state: RootState) => state.content.filters.searchKeyword)
  const [localSearch, setLocalSearch] = useState(searchKeyword)

  useEffect(() => {
    setLocalSearch(searchKeyword)
  }, [searchKeyword])

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setSearchKeyword(localSearch))
    }, 300)

    return () => clearTimeout(timer)
  }, [localSearch, dispatch])

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Find the items you're looking for"
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="w-full px-4 py-3 pr-12 bg-[#1a1f2e] border border-gray-700 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </div>
  )
}
