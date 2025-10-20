"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { setFiltersFromURL } from "../store/contentSlice";
import type { PricingOption, SortOption } from "../types";

export const useURLSync = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.content.filters);

  // Read from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const pricingStrings =
      params.get("pricing")?.split(",").filter(Boolean) || [];
    const pricingOptions = pricingStrings
      .map((str) => Number.parseInt(str, 10))
      .filter(
        (num) => !Number.isNaN(num) && num >= 0 && num <= 2
      ) as PricingOption[];
    const searchKeyword = params.get("search") || "";
    const sortBy = (params.get("sort") as SortOption) || "name";
    const priceMin = Number.parseInt(params.get("priceMin") || "0");
    const priceMax = Number.parseInt(params.get("priceMax") || "999");

    if (
      pricingOptions.length > 0 ||
      searchKeyword ||
      sortBy !== "name" ||
      priceMin !== 0 ||
      priceMax !== 999
    ) {
      dispatch(
        setFiltersFromURL({
          pricingOptions,
          searchKeyword,
          sortBy,
          priceRange: [priceMin, priceMax],
        })
      );
    }
  }, [dispatch]);

  // Write to URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.pricingOptions.length > 0) {
      params.set("pricing", filters.pricingOptions.join(","));
    }

    if (filters.searchKeyword) {
      params.set("search", filters.searchKeyword);
    }

    if (filters.sortBy !== "name") {
      params.set("sort", filters.sortBy);
    }

    if (filters.priceRange[0] !== 0) {
      params.set("priceMin", filters.priceRange[0].toString());
    }

    if (filters.priceRange[1] !== 999) {
      params.set("priceMax", filters.priceRange[1].toString());
    }

    const newURL = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, "", newURL);
  }, [filters]);
};
