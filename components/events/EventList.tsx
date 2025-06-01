'use client';

import { api } from '@/convex/_generated/api';
import { query } from '@/convex/_generated/server';
import { useQuery } from 'convex/react';

export default function EventList() {
  const events = useQuery(api.mutations.events.getAllEvents);

  return <div>EventList</div>;
}
