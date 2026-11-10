import type { ChangeEvent } from 'react'
import { Button } from '@/components/ui/Button'
import { Field } from '@/components/ui/Field'
import { Input, Select } from '@/components/ui/Input'
import type { PriceRange, ProductFilters, SortOrder } from '../products.types'

interface ProductToolbarProps {
  categories: string[]
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  onReset: () => void
}

const PRICE_OPTIONS: { value: PriceRange; label: string }[] = [
  { value: 'all', label: 'Any price' },
  { value: 'under-50', label: 'Under $50' },
  { value: '50-100', label: '$50 – $100' },
  { value: 'over-100', label: 'Over $100' },
]

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

// <select> values are plain strings, so map them back to the typed options
// instead of using an unsafe `as` cast.
function findOption<T extends string>(
  options: { value: T }[],
  value: string,
  fallback: T,
): T {
  return options.find((option) => option.value === value)?.value ?? fallback
}

function ProductToolbar({
  categories,
  filters,
  onFiltersChange,
  onReset,
}: ProductToolbarProps) {
  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    onFiltersChange({ ...filters, query: event.target.value })
  }

  function handleCategoryChange(event: ChangeEvent<HTMLSelectElement>) {
    onFiltersChange({ ...filters, category: event.target.value })
  }

  function handlePriceChange(event: ChangeEvent<HTMLSelectElement>) {
    const price = findOption(PRICE_OPTIONS, event.target.value, 'all')
    onFiltersChange({ ...filters, price })
  }

  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    const sort = findOption(SORT_OPTIONS, event.target.value, 'featured')
    onFiltersChange({ ...filters, sort })
  }

  return (
    // 1 column on phones; from 600px the search takes its own full row and
    // the three filters sit side by side with the reset button.
    <form
      className="grid items-end gap-3 min-[600px]:grid-cols-[repeat(3,1fr)_auto]"
      aria-label="Filter products"
      onSubmit={(event) => event.preventDefault()}
    >
      <Field
        htmlFor="filter-search"
        label="Search"
        className="min-[600px]:col-span-full"
      >
        <Input
          id="filter-search"
          type="search"
          placeholder="Search by product name"
          value={filters.query}
          onChange={handleQueryChange}
        />
      </Field>

      <Field htmlFor="filter-category" label="Category">
        <Select
          id="filter-category"
          value={filters.category}
          onChange={handleCategoryChange}
        >
          <option value="all">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </Field>

      <Field htmlFor="filter-price" label="Price">
        <Select
          id="filter-price"
          value={filters.price}
          onChange={handlePriceChange}
        >
          {PRICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Field htmlFor="sort" label="Sort by">
        <Select id="sort" value={filters.sort} onChange={handleSortChange}>
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </Field>

      <Button variant="secondary" onClick={onReset}>
        Reset filters
      </Button>
    </form>
  )
}

export default ProductToolbar
