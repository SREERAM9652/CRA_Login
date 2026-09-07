import accountsData from "@/data/accounts.json"
import ordersData from "@/data/orders.json"

export interface JSONSystemAccount {
  id: string
  role: "c1" | "c2" | "customer"
  personaKey: string
  name: string
  roleTitle: string
  code: string
  mobile: string
  email: string
  password: string
  targetDashboard: string
  description: string
  badgeColor: string
  city?: string
  introducer?: {
    id: string
    name: string
    code: string
  } | null
  aliases?: string[]
}

export interface JSONBeneficiary {
  id: string
  fullName: string
  relation: "Self" | "Father" | "Mother" | "Wife" | "Son" | "Daughter" | "Other"
  age: number
  gender: "Male" | "Female" | "Other"
  address: string
  city: string
  pincode: string
  selectedTests: string[]
}

export interface JSONPrescription {
  id: string
  customerName: string
  mobile: string
  uploadedFileUrl?: string
  fileName?: string
  notes?: string
  requestedAt: string
  status: string
  recommendedTests: string[]
}

export interface JSONOrgProfile {
  orgName: string
  tagline: string
  supportPhone: string
  supportEmail: string
  headquarters: string
}

/**
 * Fetch accounts dynamically from JSON dataset
 */
export async function fetchAccountsFromJSON(): Promise<JSONSystemAccount[]> {
  try {
    if (typeof window !== "undefined") {
      const res = await fetch("/data/accounts.json")
      if (res.ok) {
        const json = await res.json()
        return json.systemAccounts || accountsData.systemAccounts
      }
    }
  } catch (err) {
    console.warn("Using bundled accounts JSON dataset", err)
  }
  return accountsData.systemAccounts as JSONSystemAccount[]
}

/**
 * Synchronous JSON accounts dataset loader
 */
export function getAccountsFromJSON(): JSONSystemAccount[] {
  return accountsData.systemAccounts as JSONSystemAccount[]
}

export function getC1FromJSON() {
  return accountsData.c1
}

export function getC2ListFromJSON() {
  return accountsData.c2List
}

export function getDefaultCustomerFromJSON() {
  return accountsData.defaultCustomer
}

export function getBeneficiariesFromJSON(): JSONBeneficiary[] {
  return ordersData.beneficiaries as JSONBeneficiary[]
}

export function getPrescriptionsFromJSON(): JSONPrescription[] {
  return ordersData.prescriptions as JSONPrescription[]
}

export function getOrgProfileFromJSON(): JSONOrgProfile {
  return ordersData.orgProfile
}

/**
 * Dynamic account finder using JSON dataset
 */
export function findAccountByCredentials(identifier: string): JSONSystemAccount | null {
  const rawTrimmed = (identifier || "").trim()
  const cleanId = rawTrimmed.toLowerCase()
  const cleanDigits = rawTrimmed.replace(/[\s\-()]/g, "").replace(/^(\+91|91|0)/, "")

  const accounts = getAccountsFromJSON()

  return accounts.find((acc) => {
    const codeMatch = acc.code.toLowerCase() === cleanId
    const emailMatch = acc.email.toLowerCase() === cleanId
    const mobileMatch = cleanDigits.length === 10 && acc.mobile.replace(/\D/g, "").slice(-10) === cleanDigits.slice(-10)
    const personaMatch = acc.personaKey.toLowerCase() === cleanId
    const idMatch = acc.id.toLowerCase() === cleanId
    const nameMatch = acc.name.toLowerCase() === cleanId
    const aliasMatch = acc.aliases?.some(
      (a) =>
        a.toLowerCase() === cleanId ||
        (cleanDigits.length === 10 && a.replace(/\D/g, "").slice(-10) === cleanDigits.slice(-10))
    )
    return codeMatch || emailMatch || mobileMatch || personaMatch || idMatch || nameMatch || aliasMatch
  }) || null
}
