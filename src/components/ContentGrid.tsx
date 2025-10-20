"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Virtuoso } from "react-virtuoso";
import type { RootState } from "../store/store";
import { loadMoreItems, fetchContent } from "../store/contentSlice";
import ContentCard from "./ContentCard";
import SkeletonCard from "./SkeletonCard";

export default function ContentGrid() {
  const dispatch = useDispatch();
  const { displayedItems, filteredItems, loading, hasMoreToFetch } =
    useSelector((state: RootState) => state.content);
  const [columnCount, setColumnCount] = useState(4);

  const hasMoreDisplayed = displayedItems.length < filteredItems.length;

  useEffect(() => {
    const updateColumnCount = () => {
      const width = window.innerWidth;
      if (width < 480) setColumnCount(1);
      else if (width < 768) setColumnCount(2);
      else if (width < 1200) setColumnCount(3);
      else setColumnCount(4);
    };

    updateColumnCount();
    window.addEventListener("resize", updateColumnCount);
    return () => window.removeEventListener("resize", updateColumnCount);
  }, []);

  const rows = [];
  for (let i = 0; i < displayedItems.length; i += columnCount) {
    rows.push(displayedItems.slice(i, i + columnCount));
  }

  const handleEndReached = () => {
    if (loading) return;

    if (hasMoreDisplayed) {
      dispatch(loadMoreItems());
    }

    const shouldFetchMore =
      hasMoreDisplayed &&
      displayedItems.length >= filteredItems.length - 20 &&
      hasMoreToFetch;

    if (shouldFetchMore) {
      dispatch(fetchContent() as any);
    }
  };

  if (loading && displayedItems.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (displayedItems.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-300">
          No items found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="w-full pt-6">
      <Virtuoso
        useWindowScroll
        data={rows}
        endReached={handleEndReached}
        overscan={200}
        itemContent={(_, rowItems) => (
          <div
            className="grid gap-4 pb-4"
            style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
          >
            {rowItems.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        )}
        components={{
          Footer: () => {
            if (loading) {
              return (
                <div
                  className="grid gap-4 pb-4"
                  style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
                >
                  {Array.from({ length: columnCount * 2 }).map((_, index) => (
                    <SkeletonCard key={`skeleton-${index}`} />
                  ))}
                </div>
              );
            }
            if (
              !hasMoreDisplayed &&
              !hasMoreToFetch &&
              displayedItems.length > 0
            ) {
              return (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No more items to load
                </div>
              );
            }
            return null;
          },
        }}
      />
    </div>
  );
}
