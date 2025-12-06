import { BreadcrumbItem } from "@/components/ui/breadcrumb"
import { categoryGroups } from "./categories"

export function generateBreadcrumbs(path: string): BreadcrumbItem[] {
  const segments = path.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  // Category page
  if (segments[0] === 'category' && segments[1]) {
    const category = categoryGroups.find(c => c.id === segments[1])
    if (category) {
      breadcrumbs.push({ label: category.title, href: `/category/${segments[1]}` })
    }
  }
  
  // Tool pages
  else if (segments.length >= 2) {
    const categoryId = segments[0]
    const category = categoryGroups.find(c => 
      c.categories.some(cat => categoryId.includes(cat))
    )
    
    if (category) {
      breadcrumbs.push({ label: category.title, href: `/category/${category.id}` })
    }
    
    // Add tool name (capitalize and format)
    const toolName = segments[segments.length - 1]
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    
    breadcrumbs.push({ 
      label: toolName, 
      href: `/${segments.join('/')}` 
    })
  }

  return breadcrumbs
}
