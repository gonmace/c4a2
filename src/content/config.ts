import { defineCollection, z } from 'astro:content';

const wwaCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  }),
});
export const collections = {
  'wwa': wwaCollection,
  'services': servicesCollection,
}; 