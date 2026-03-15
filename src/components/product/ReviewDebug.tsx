'use client';
// Temporary debug component — shows raw review API response in browser console
// Remove this file and its import from the product page once reviews are working
import { useEffect } from 'react';
import type { DigiReview } from '@/lib/digiseller';

export default function ReviewDebug({ reviews }: { reviews: DigiReview[] }) {
  useEffect(() => {
    if (reviews.length > 0) {
      console.log('[ReviewDebug] Reviews loaded:', reviews.length, 'First review:', reviews[0]);
    } else {
      console.log('[ReviewDebug] No reviews returned from API');
    }
  }, [reviews]);
  return null; // renders nothing
}
