// Enquiries Controller
// Handles all business logic for enquiries

import { Request, Response } from 'express'
// import { query } from '../db'

interface Enquiry {
  id?: number
  username: string
  email: string
  phone?: string
  message: string
  created_at?: string
}

// Mock data for development
const mockEnquiries: Enquiry[] = [
  {
    id: 1,
    username: "Rajni",
    email: "rajnirose305@gmail.com",
    phone: "+918872486884",
    message: "M best in cooking.\n\nEmployer Requirement:\nNationality: Indian\nType: Ex-Singapore Maid\nAge: 41 and above\nDuty: Taking care of infant\nLanguage: English",
    created_at: "2026-03-23T12:58:00Z"
  },
  {
    id: 2,
    username: "Devina",
    email: "devinachew@gmail.com",
    phone: "81381569",
    message: "Employer Requirement:\nNationality: Indonesian\nType: Transfer Maid\nAge: 31 to 35",
    created_at: "2026-03-23T12:57:00Z"
  },
  {
    id: 3,
    username: "Shaiful",
    email: "hirqa@yahoo.com.sg",
    phone: "98214800",
    message: "urgently need a helper who is above 1.65m tall. must be strong & hygienic. can take care of elderly & disabled.",
    created_at: "2026-03-23T12:00:00Z"
  },
  {
    id: 4,
    username: "Jit",
    email: "jitchu@yahoo.com",
    phone: "90275978",
    message: "Employer Requirement:\nNationality: Indonesian\nAge: 31 to 35\nDuty: Taking care of elderly / bedridden\nLanguage: English",
    created_at: "2026-03-22T03:59:00Z"
  },
  {
    id: 5,
    username: "William Lawton",
    email: "William.Lawton100@gmail.com",
    phone: "19107283080",
    message: "Live in Spain, will have own apartment, cook, clean, market, massage therapist background as well would be amazing.\n\nEmployer Requirement:\nNationality: Filipino\nAge: 41 and above\nDuty: General Housekeeping\nLanguage: English\nOff-day: No Off-day",
    created_at: "2026-03-22T03:59:00Z"
  },
];

/**
 * GET /api/enquiries
 * Fetch all enquiries
 */
export const getEnquiries = async (req: Request, res: Response) => {
  try {
    // For now, return mock data until database is set up
    res.json(mockEnquiries)
    // const result = await query('SELECT * FROM enquiries ORDER BY created_at DESC')
    // res.json(result.rows)
  } catch (error) {
    console.error('Error fetching enquiries:', error)
    res.status(500).json({ error: 'Failed to fetch enquiries' })
  }
}

/**
 * POST /api/enquiries
 * Create a new enquiry
 */
export const createEnquiry = async (req: Request, res: Response) => {
  try {
    const { username, email, phone, message }: Enquiry = req.body

    if (!username || !email || !message) {
      return res.status(400).json({ error: 'Username, email, and message are required' })
    }

    // For now, just return the data
    const newEnquiry = {
      id: mockEnquiries.length + 1,
      username,
      email,
      phone,
      message,
      created_at: new Date().toISOString()
    }
    res.status(201).json(newEnquiry)
    // const result = await query(
    //   'INSERT INTO enquiries (username, email, phone, message) VALUES ($1, $2, $3, $4) RETURNING *',
    //   [username, email, phone, message]
    // )
    // res.json(result.rows[0])
  } catch (error) {
    console.error('Error creating enquiry:', error)
    res.status(500).json({ error: 'Failed to create enquiry' })
  }
}