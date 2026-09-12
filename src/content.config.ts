import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projectImage = z.object({
  src: z.string(),
  alt: z.string().default(''),
  wide: z.boolean().default(false),
  position: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects',
  }),

  schema: z.object({
    title: z.string(),

    // Named `projectSlug` (not `slug`) because Astro's content collections
    // treat a frontmatter field literally called `slug` as the entry's own
    // routing slug — which collides between the .en/.fr files of the same project.
    projectSlug: z.string(),

    language: z.enum(['en', 'fr']),
    year: z.number(),
    yearLabel: z.string().optional(),
    role: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    order: z.number().default(99),

    // Editorial framing
    kicker: z.string().default(''),
    badgeLabel: z.string().default(''),
    coverImage: z.string(),
    coverPosition: z.string().default('center'),
    thumbImage: z.string().optional(),
    thumbPosition: z.string().default('center'),
    shortDescription: z.string(),
    quote: z.string().optional(),

    // Variant sections — a project page only renders the sections
    // whose data is present.
    posterImage: z.string().optional(),

    hasVideo: z.boolean().default(false),
    videoSectionTitle: z.string().optional(),
    videoCaption: z.string().optional(),
    videoUrl: z.string().optional(),

    decorsSectionTitle: z.string().optional(),
    decorsCaption: z.string().optional(),
    decorsLayout: z.enum(['grid4', 'grid2wide', 'finalgallery', 'portraitfull']).default('grid4'),
    decors: z.array(projectImage).default([]),

    characterGroups: z
      .array(
        z.object({
          name: z.string(),
          layout: z.enum(['default', 'stacked', 'stacked-grid', 'grid2wide', 'main-top']).default('default'),
          images: z.array(projectImage),
        }),
      )
      .default([]),

    researchSectionTitle: z.string().optional(),
    researchGroups: z
      .array(
        z.object({
          name: z.string(),
          layout: z.enum(['default', 'stacked', 'stacked-grid', 'grid2wide', 'grid4']).default('default'),
          images: z.array(projectImage),
        }),
      )
      .default([]),

    researchVideos: z
      .array(
        z.object({
          name: z.string(),
          src: z.string(),
        }),
      )
      .default([]),

    storyboardImages: z.array(projectImage).default([]),
    hasAnimatic: z.boolean().default(false),
    animaticUrl: z.string().optional(),

    colorScript: z.array(z.string()).default([]),
    colorScriptImage: z.string().optional(),

    finalGallery: z.array(projectImage).default([]),

    processCaption: z.string().optional(),
    process: z
      .array(
        z.object({
          image: z.string(),
          caption: z.string(),
        }),
      )
      .default([]),

    vectorizationSectionTitle: z.string().optional(),
    vectorizationCaption: z.string().optional(),
    vectorization: z.array(projectImage).default([]),

    illustrations: z.array(projectImage).default([]),

    palettes: z
      .array(
        z.object({
          label: z.string().optional(),
          colors: z.array(z.string()),
        }),
      )
      .default([]),

    skillsShown: z.array(z.string()).default([]),

    externalLinks: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        }),
      )
      .default([]),
  }),
});

export const collections = { projects };