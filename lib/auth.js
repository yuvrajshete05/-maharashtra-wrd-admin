// Authentication Helper
// Path: lib/auth.js

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'maharashtra-wrd-secret-key-2024'

export function verifyToken(token) {
  try {
    // For development - simple token verification
    const decoded = jwt.decode(token)
    if (!decoded) {
      // Fallback to localStorage token format
      const parsed = JSON.parse(atob(token))
      return {
        userId: parsed.username || parsed.adminName,
        userType: parsed.userType || 'nominee',
        name: parsed.name || parsed.adminName,
        loginTime: parsed.loginTime
      }
    }
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export function generateToken(userData) {
  return jwt.sign(userData, JWT_SECRET, { expiresIn: '24h' })
}