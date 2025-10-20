"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchContent } from "./store/contentSlice"
import type { AppDispatch } from "./store/store"
import { useURLSync } from "./hooks/useURLSync"
import Header from "./components/Header"
import FilterPanel from "./components/FilterPanel"
import ContentGrid from "./components/ContentGrid"

function App() {
  const dispatch = useDispatch<AppDispatch>()

  useURLSync()

  useEffect(() => {
    dispatch(fetchContent())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Header />
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-x-hidden">
        <div className="space-y-6">
          <FilterPanel />
          <main className="w-full">
            <ContentGrid />
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
