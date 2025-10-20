export enum PricingOption {
  Paid = 0,
  Free = 1,
  ViewOnly = 2,
}

export interface ContentItem {
  id: string
  title: string
  userName: string
  imagePath: string
  pricingOption: PricingOption
  price?: number
}

export interface FilterState {
  pricingOptions: PricingOption[]
  searchKeyword: string
  sortBy: SortOption
  priceRange: [number, number]
}

export type SortOption = "relevance" | "name" | "priceHigh" | "priceLow"
