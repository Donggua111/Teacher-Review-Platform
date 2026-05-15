import { Profile, Role } from "@/types"

export function canReview(user: Profile | null): boolean {
  return user !== null && user.status === "active"
}

export function canModerate(user: Profile | null): boolean {
  return user !== null && (user.role === "moderator" || user.role === "admin")
}

export function canAdmin(user: Profile | null): boolean {
  return user !== null && user.role === "admin"
}

export function canReport(user: Profile | null): boolean {
  return user !== null && user.status === "active"
}

export function hasRole(user: Profile | null, role: Role): boolean {
  return user !== null && user.role === role
}

export function isActive(user: Profile | null): boolean {
  return user !== null && user.status === "active"
}
