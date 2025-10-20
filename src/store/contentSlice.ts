import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { type ContentItem, PricingOption, type FilterState, type SortOption } from "../types"

interface ContentState {
  allItems: ContentItem[] // Store all fetched items across multiple API calls
  filteredItems: ContentItem[]
  displayedItems: ContentItem[]
  filters: FilterState
  loading: boolean
  error: string | null
  page: number
  itemsPerPage: number
  fetchCount: number // Track how many times we've fetched from API
  hasMoreToFetch: boolean // Track if there's more data to fetch from API
}

const initialState: ContentState = {
  allItems: [],
  filteredItems: [],
  displayedItems: [],
  filters: {
    pricingOptions: [],
    searchKeyword: "",
    sortBy: "relevance",
    priceRange: [0, 999],
  },
  loading: false,
  error: null,
  page: 1,
  itemsPerPage: 12,
  fetchCount: 0,
  hasMoreToFetch: true,
}

function generateUniqueId(item: any, fetchCount: number, index: number): string {
  const timestamp = Date.now()
  const baseId = item.id || item.title || index
  return `${baseId}-${fetchCount}-${index}-${timestamp}`
}

export const fetchContent = createAsyncThunk("content/fetchContent", async (_, { getState }) => {
  const state = getState() as { content: ContentState }
  const fetchCount = state.content.fetchCount

  const response = await fetch("https://closet-recruiting-api.azurewebsites.net/api/data")
  if (!response.ok) {
    throw new Error("Failed to fetch content")
  }
  const data = await response.json()

  return {
    items: data.map((item: any, index: number) => ({
      ...item,
      id: generateUniqueId(item, fetchCount, index),
      pricingOption: item.pricingOption as PricingOption,
    })) as ContentItem[],
    fetchCount,
  }
})

const contentSlice = createSlice({
  name: "content",
  initialState,
  reducers: {
    setPricingOptions: (state, action: PayloadAction<PricingOption[]>) => {
      state.filters.pricingOptions = action.payload
      state.page = 1
      applyFilters(state)
    },
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.filters.searchKeyword = action.payload
      state.page = 1
      applyFilters(state)
    },
    setSortBy: (state, action: PayloadAction<SortOption>) => {
      state.filters.sortBy = action.payload
      state.page = 1
      applyFilters(state)
    },
    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.filters.priceRange = action.payload
      state.page = 1
      applyFilters(state)
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
      state.page = 1
      applyFilters(state)
    },
    loadMoreItems: (state) => {
      state.page += 1
      const startIndex = 0
      const endIndex = state.page * state.itemsPerPage
      state.displayedItems = state.filteredItems.slice(startIndex, endIndex)
    },
    setFiltersFromURL: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload }
      state.page = 1
      applyFilters(state)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false
        state.allItems = [...state.allItems, ...action.payload.items]
        state.fetchCount += 1

        if (action.payload.items.length === 0) {
          state.hasMoreToFetch = false
        }

        applyFilters(state)
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Failed to fetch content"
      })
  },
})

function applyFilters(state: ContentState) {
  let filtered = [...state.allItems] // Use allItems instead of items

  // Apply pricing filter
  if (state.filters.pricingOptions.length > 0) {
    filtered = filtered.filter((item) => state.filters.pricingOptions.includes(item.pricingOption))
  }

  // Apply search keyword
  if (state.filters.searchKeyword.trim()) {
    const keyword = state.filters.searchKeyword.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        (item.title?.toLowerCase() || "").includes(keyword) || (item.userName?.toLowerCase() || "").includes(keyword),
    )
  }

  // Apply price range filter (only for Paid items)
  if (state.filters.pricingOptions.includes(PricingOption.Paid)) {
    filtered = filtered.filter((item) => {
      if (item.pricingOption !== PricingOption.Paid) return true
      if (item.price === undefined) return false
      return item.price >= state.filters.priceRange[0] && item.price <= state.filters.priceRange[1]
    })
  }

  // Apply sorting
  filtered = sortItems(filtered, state.filters.sortBy)

  state.filteredItems = filtered
  state.displayedItems = filtered.slice(0, state.page * state.itemsPerPage)
}

function sortItems(items: ContentItem[], sortBy: SortOption): ContentItem[] {
  const sorted = [...items]

  switch (sortBy) {
    case "relevance":
      return sorted
    case "name":
      return sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""))
    case "priceHigh":
      return sorted.sort((a, b) => {
        const priceA = a.price ?? -1
        const priceB = b.price ?? -1
        return priceB - priceA
      })
    case "priceLow":
      return sorted.sort((a, b) => {
        const priceA = a.price ?? Number.POSITIVE_INFINITY
        const priceB = b.price ?? Number.POSITIVE_INFINITY
        return priceA - priceB
      })
    default:
      return sorted
  }
}

export const {
  setPricingOptions,
  setSearchKeyword,
  setSortBy,
  setPriceRange,
  resetFilters,
  loadMoreItems,
  setFiltersFromURL,
} = contentSlice.actions

export default contentSlice.reducer
