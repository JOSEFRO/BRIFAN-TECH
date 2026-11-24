type SearchableResource = {
  title?: string | null
  category?: string | null
  type?: string | null
  level?: string | null
  excerpt?: string | null
  body?: string | null
}

/** Normaliza el texto para ignorar mayúsculas y tildes en las búsquedas. */
export function normalizeSearchText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()
}

/** Busca cada término en el título, metadatos, resumen y cuerpo del recurso. */
export function matchesLibrarySearch(resource: SearchableResource, query: string): boolean {
  const terms = normalizeSearchText(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return true

  const searchableContent = normalizeSearchText([
    resource.title,
    resource.category,
    resource.type,
    resource.level,
    resource.excerpt,
    resource.body,
  ].filter(Boolean).join(' '))

  return terms.every((term) => searchableContent.includes(term))
}
