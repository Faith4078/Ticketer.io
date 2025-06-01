import { ConvexError, v } from 'convex/values';
import { query, mutation } from '../_generated/server';

export const getAllEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query('events')
      .filter((q) => q.eq(q.field('is_cancelled'), undefined))
      .collect();
  },
});
