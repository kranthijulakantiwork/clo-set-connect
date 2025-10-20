"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { loadMoreItems, fetchContent } from "../store/contentSlice";
import ContentCard from "./ContentCard";
import SkeletonCard from "./SkeletonCard";

export default function ContentGrid() {
  const dispatch = useDispatch();
  const { displayedItems, filteredItems, loading, hasMoreToFetch } =
    useSelector((state: RootState) => state.content);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMoreDisplayed = displayedItems.length < filteredItems.length;

  const shouldFetchMore =
    hasMoreDisplayed &&
    displayedItems.length >= filteredItems.length - 20 &&
    hasMoreToFetch &&
    !loading;

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          if (hasMoreDisplayed) {
            dispatch(loadMoreItems());
          }
          if (shouldFetchMore) {
            dispatch(fetchContent() as any);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
        // rootMargin: `${window.innerHeight}px`, // Trigger when one viewport height away
      }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasMoreDisplayed, shouldFetchMore, loading, dispatch]);

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
    <div className="w-full pt-6" ref={containerRef}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {displayedItems.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>

      {loading && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index}`} />
          ))}
        </div>
      )}

      {/* Intersection observer target - positioned one viewport away */}
      {(hasMoreDisplayed || hasMoreToFetch) && !loading && (
        <div ref={loadMoreRef} className="h-4 w-full" />
      )}

      {!hasMoreDisplayed && !hasMoreToFetch && displayedItems.length > 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No more items to load
        </div>
      )}
    </div>
  );
}
