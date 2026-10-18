import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

// Projetos do portfólio. O build falha se algum campo estiver ausente ou inválido.
// Só registre informação verificável: nada de cliente, resultado ou depoimento sem confirmação.
const projetos = defineCollection({
  loader: file('src/content/projetos.json'),
  schema: ({ image }) =>
    z.object({
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
      titulo: z.string().min(3),
      categoria: z.string().min(3),
      formato: z.enum(['vertical', 'horizontal']),
      // ID de vídeo do YouTube: exatamente 11 caracteres [A-Za-z0-9_-].
      video: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
      descricao: z.string().min(10),
      capa: image(),
      en: z.object({
        title: z.string().min(3), category: z.string().min(3),
        context: z.string().min(20), role: z.string().min(3), focus: z.string().min(20),
        note: z.string(), group: z.enum(['work', 'estudo']),
      }),
      ordem: z.number().int().positive(),
    }),
});

export const collections = { projetos };
