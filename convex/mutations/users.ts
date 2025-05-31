import { v } from 'convex/values';
import { mutation, query } from '../_generated/server';

// create new user
export const createUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { userId, name, email }) => {
    // Create new user
    const newUserId = await ctx.db.insert('users', {
      userId,
      name,
      email,
      stripeConnectId: undefined,
    });

    return newUserId;
  },
});

export const updateUser = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, { userId, name, email }) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .first();

    await ctx.db.patch(existingUser!._id, {
      name,
      email,
    });
    return existingUser!._id;
  },
});
// delete user
export const deleteUser = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, { userId }) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query('users')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .first();
    if (!existingUser) {
      throw new Error('user not found');
    }

    await ctx.db.delete(existingUser!._id);
    return existingUser!._id;
  },
});

export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db
      .query('users')
      .withIndex('by_user_id', (q) => q.eq('userId', userId))
      .first();

    return user;
  },
});
