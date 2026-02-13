"use client"

import { useEffect, useState } from "react"
import {
  parseCustomerCSV,
  type Customer,
} from "@/lib/customer-data"

export function useCustomerData() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/customers-1000.csv")
      .then(res => res.text())
      .then(csvContent => {
        const parsed = parseCustomerCSV(csvContent)
        setCustomers(parsed)
        setIsLoading(false)
      })
      .catch(err => {
        console.error("Failed to load customer data:", err)
        setError("Failed to load customer data")
        setIsLoading(false)
      })
  }, [])

  return { customers, isLoading, error }
}
