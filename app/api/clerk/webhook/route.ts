import { api } from '@/convex/_generated/api';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { fetchMutation } from 'convex/nextjs';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const { id } = evt.data;
    const eventType = evt.type;
    console.log(
      `Received webhook with ID ${id} and event type of ${eventType}`
    );
    console.log('Webhook payload:', evt.data);

    switch (eventType) {
      case 'user.created': {
        const { email_addresses, first_name, last_name } = evt.data;
        const emailAddress = email_addresses[0]?.email_address ?? '';
        const firstName = first_name ?? '';
        const lastName = last_name ?? '';

        await fetchMutation(api.mutations.users.createUser, {
          email: emailAddress,
          name: `${firstName} ${lastName}`.trim(),
          userId: id!,
        });

        return new Response('Webhook received: user.created', { status: 200 });
      }

      case 'user.updated': {
        const { email_addresses, first_name, last_name, id } = evt.data;
        const emailAddress = email_addresses[0]?.email_address ?? '';
        const firstName = first_name ?? '';
        const lastName = last_name ?? '';

        await fetchMutation(api.mutations.users.updateUser, {
          email: emailAddress,
          name: `${firstName} ${lastName}`.trim(),
          userId: id,
        });

        console.log(`Updated user with ID: ${id}`);
        return new Response('Webhook received: user.updated', { status: 200 });
      }

      case 'user.deleted': {
        const userId = evt.data.id;

        console.log(`Deleted user with ID: ${userId}`);
        return new Response('Webhook received: user.deleted', { status: 200 });
      }

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
        return new Response('Webhook received but no action taken', {
          status: 200,
        });
    }
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
