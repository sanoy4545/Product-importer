import { useState } from 'react'

export function usePagination(itemsPerPage: number = 10) {
  const [currentPage, setCurrentPage] = useState(1)

  const paginate = <T,>(items: T[]) => {
    return items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }

  const totalPages = (totalItems: number) => {
    return Math.ceil(totalItems / itemsPerPage) || 1
  }

  const goToPage = (page: number, maxPage: number) => {
    setCurrentPage(Math.max(1, Math.min(maxPage, page)))
  }

  const nextPage = (maxPage: number) => {
    setCurrentPage((prev) => Math.min(maxPage, prev + 1))
  }

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  return {
    currentPage,
    setCurrentPage,
    paginate,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
  }
}

