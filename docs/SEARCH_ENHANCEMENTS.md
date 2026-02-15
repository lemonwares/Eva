# Search Enhancement: Alias & Sub-Tag Resolution

## Overview

The `/api/search` endpoint now supports intelligent query expansion using category aliases and sub-tags for smarter filtering and relevance ranking.

## Features

### 1. Category Alias Resolution

When a user searches for a category (e.g., `?category=makeup`), the system automatically resolves it to the actual category slug (e.g., `makeup-artists`) if an alias match is found.

**Resolution Priority:**

- Level 1 (Boost: 3): Exact slug match → highest relevance
- Level 2 (Boost: 2): Alias match → medium relevance
- Level 3 (Boost: 1.5): Sub-tag match → lower relevance

### 2. Sub-Tag Relevance Boosting

When distance-filtered results are returned, each provider gets a `relevanceBoost` score based on whether their tags match the category's sub-tags.

**Calculation:**

- Base relevanceBoost = 1.0
- Each matching provider tag → +0.5
- Example: A provider in "makeup-artists" category with tags `["bridal-makeup", "airbrush"]` gets +1.0 boost if both tags match sub-tags

### 3. Search Modes

#### Text Search (`searchType=text` or `q=...`)

- Expands search terms across tags, categories, and sub-tags
- Returns providers matching any expanded term
- Example: `?q=bridal` → matches providers tagged with "bridal-makeup" or in categories with "bridal-makeup" sub-tag

#### Tag-Based Search (`searchType=tags` or `tags=...`)

- Comma-separated list of tag search terms
- Resolves via aliases and sub-tags to find category matches
- Searches across tags, categories, subcategories, and culture tags
- Example: `?tags=makeup,hair` → finds makeup-artists, hair-stylists categories and matching providers

#### Slug Search (`searchType=slug` or `slug=...`)

- Direct provider slug match (highest priority, returns single provider if found)

#### Combined Search (`searchType=all`)

- Applies all filters simultaneously
- Maintains distance-based sorting with relevance boost

### 4. Sorting Options

- `sort=distance` (default): Nearest providers first
- `sort=rating`: Highest-rated providers first
- `sort=price`: Lowest-price providers first
- `sort=relevance`: Relevance boost score + distance tie-breaker

## API Query Examples

```bash
# Search for makeup vendors (resolves alias to makeup-artists category)
GET /api/search?postcode=SW1A1AA&category=makeup&radius=5

# Search by multiple tags with expansion
GET /api/search?postcode=SW1A1AA&tags=bridal,makeup&radius=5

# Text search with sub-tag expansion
GET /api/search?postcode=SW1A1AA&q=bridal&radius=5

# Combined search with relevance sorting
GET /api/search?postcode=SW1A1AA&category=makeup-artists&tags=airbrush&sort=relevance&radius=5

# Tag search with pagination
GET /api/search?postcode=SW1A1AA&tags=wedding-planning&page=1&limit=20
```

## Response Fields

Each provider in the results includes:

- `distance` (number): Distance from search location (miles)
- `distanceKm` (number): Distance from search location (km)
- `matchMode` (string): Which distance matching mode applied ("modeA", "modeB", or "both")
- `relevanceBoost` (number): Multiplier based on tag/sub-tag intersection (≥ 1.0)

## Implementation Details

### Category Model Extensions

```typescript
model Category {
  // ... existing fields ...
  aliases: String[]        // Synonyms for the category
  subTags: String[]        // Filterable keywords within the category

  @@index([aliases])       // For fast alias lookups
  @@index([subTags])       // For fast sub-tag lookups
}
```

### Helper Function: `resolveCategoryAliases()`

- Fetches all categories with slug, aliases, and sub-tags
- Maps search terms to matching categories with relevance boosting
- Returns array of `{ categoryMatch, relevanceBoost }`

### Distance Filtering with Relevance

- Calculates Haversine distance from user location to provider
- Applies Mode A (user within vendor radius) or Mode B (vendor covers user) matching
- Computes relevance boost by checking provider tag/category sub-tag intersection
- Sorts by relevance (if requested), then by distance

## Example Taxonomy

**Category:** Makeup Artists

- **Slug:** `makeup-artists`
- **Aliases:** `["makeup", "makeup-artists", "mua"]`
- **Sub-Tags:** `["bridal-makeup", "airbrush", "theatrical-makeup", "special-effects"]`

**Provider:** XYZ Makeup Studio

- **Categories:** `["makeup-artists"]`
- **Tags:** `["bridal-makeup", "airbrush"]`

**Search Scenario:**

1. User searches `?q=bridal`
2. System resolves "bridal" → matches "bridal-makeup" sub-tag → adds "makeup-artists" to expanded search
3. XYZ Makeup Studio appears in results
4. Since XYZ's tags ("bridal-makeup") match the category's sub-tags, relevanceBoost = 1.0 + (1 × 0.5) = 1.5
5. If sorted by relevance, XYZ appears higher than other makeup artists without "bridal-makeup" tag

## Backward Compatibility

All existing search parameters continue to work:

- `postcode`, `radius`, `searchMode`, `category`, `priceFrom`, `priceTo`, `rating`, `cultureTags`, `verifiedOnly`, `city`, `sort`, `page`, `limit`

New parameters are optional and defaults maintain existing behavior.
