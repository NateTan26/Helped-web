// PostgreSQL Database Connection Configuration
// This file establishes and manages the connection to the PostgreSQL database using the pg library

import pkg from 'pg'
import dotenv from 'dotenv'

const { Pool } = pkg

// Load environment variables from .env file
dotenv.config()

// Create a connection pool for better performance
// The pool manages multiple connections to the database automatically
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'maid_agency_db',
})

// Handle connection errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
})

/**
 * Execute a database query
 * @param text - SQL query string
 * @param params - Query parameters for prepared statements (prevents SQL injection)
 * @returns Query result with rows array
 */
export const query = async (text: string, params: unknown[] = []) => {
  try {
    const result = await pool.query(text, params)
    return result
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

/**
 * Get a single client from the pool for transaction handling
 * @returns Database client for manual transaction management
 */
export const getClient = async () => {
  return await pool.connect()
}

export default pool
