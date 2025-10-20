"use client"

import type React from "react"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../store/store"
import { setPricingOptions, resetFilters, setSortBy, setPriceRange } from "../store/contentSlice"
import { PricingOption, type SortOption } from "../types"
import PriceRangeSlider from "./PriceRangeSlider"

export default function FilterPanel() {
  const dispatch = useDispatch()
  const filters = useSelector((state: RootState) => state.content.filters)

  const pricingOptionLabels: Record<PricingOption, string> = {
    [PricingOption.Paid]: "Paid",
    [PricingOption.Free]: "Free",
    [PricingOption.ViewOnly]: "View Only",
  }

  const handlePricingChange = (option: PricingOption) => {
    const newOptions = filters.pricingOptions.includes(option)
      ? filters.pricingOptions.filter((o) => o !== option)
      : [...filters.pricingOptions, option]
    dispatch(setPricingOptions(newOptions))
  }

  const handleReset = () => {
    dispatch(resetFilters())
  }

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setSortBy(e.target.value as SortOption))
  }

  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-gray-800">
      {/* Left side: Pricing Options and Price Slider */}
      <div className="flex flex-col sm:flex-row items-start gap-6 flex-1">
        {/* Pricing Options */}
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-3">Pricing Option</h3>
          <div className="flex flex-wrap gap-4">
            {[PricingOption.Paid, PricingOption.Free, PricingOption.ViewOnly].map((option) => (
              <label key={option} className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.pricingOptions.includes(option)}
                  onChange={() => handlePricingChange(option)}
                  className="w-4 h-4 text-indigo-600 bg-gray-700 border-gray-600 rounded focus:ring-indigo-500 cursor-pointer"
                />
                <span className="ml-2 text-sm text-gray-300 group-hover:text-white">{pricingOptionLabels[option]}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Slider */}
        <div className="flex-1 min-w-[280px]">
          <PriceRangeSlider
            min={0}
            max={999}
            value={filters.priceRange}
            onChange={(range) => dispatch(setPriceRange(range))}
            disabled={!filters.pricingOptions.includes(PricingOption.Paid)}
          />
        </div>
      </div>

      {/* Right side: Sort and Reset */}
      <div className="flex items-center gap-4">
        {/* Sorting */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Sort by</label>
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="px-4 py-2 bg-[#1a1f2e] border border-gray-700 rounded text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[160px]"
          >
            <option value="relevance">Relevance</option>
            <option value="name">Item Name</option>
            <option value="priceHigh">Higher Price</option>
            <option value="priceLow">Lower Price</option>
          </select>
        </div>

        {/* Reset Button */}
        <div className="pt-6">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white font-medium uppercase tracking-wider transition-colors"
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  )
}
