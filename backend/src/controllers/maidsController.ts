// Maids Controller
// Handles all business logic for maids/helpers

import { Request, Response } from 'express'
// import { query } from '../db'

interface MaidProfile {
  id?: number
  fullName: string
  referenceCode: string
  type: string
  nationality: string
  dateOfBirth: string
  placeOfBirth: string
  height: number
  weight: number
  religion: string
  maritalStatus: string
  numberOfChildren: number
  numberOfSiblings: number
  homeAddress: string
  airportRepatriation: string
  educationLevel: string
  languageSkills: Record<string, string>
  skillsPreferences: Record<string, any>
  workAreas: Record<string, any>
  employmentHistory: Array<Record<string, any>>
  introduction: Record<string, any>
  agencyContact: Record<string, any>
}

/**
 * GET /api/maids
 * Fetch all maids
 */
export const getMaids = async (req: Request, res: Response) => {
  try {
    // For now, return empty array until database is set up
    res.json([])
    // const result = await query('SELECT * FROM maids ORDER BY created_at DESC')
    // res.json(result.rows)
  } catch (error) {
    console.error('Error fetching maids:', error)
    res.status(500).json({ error: 'Failed to fetch maids' })
  }
}

/**
 * GET /api/maids/:id
 * Fetch a specific maid by ID
 */
export const getMaidById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    // For now, return null
    res.json(null)
    // const result = await query('SELECT * FROM maids WHERE id = $1', [id])
    // if (result.rows.length === 0) {
    //   return res.status(404).json({ error: 'Maid not found' })
    // }
    // res.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching maid:', error)
    res.status(500).json({ error: 'Failed to fetch maid' })
  }
}

/**
 * POST /api/maids
 * Create a new maid
 */
export const createMaid = async (req: Request, res: Response) => {
  try {
    const maidData: MaidProfile = req.body

    // Validate required fields
    if (!maidData.fullName || !maidData.referenceCode || !maidData.type || !maidData.nationality) {
      return res.status(400).json({ error: 'Full name, reference code, type, and nationality are required' })
    }

    // For now, just return the data with an ID
    const newMaid = {
      id: Date.now(), // temporary ID
      ...maidData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    res.status(201).json(newMaid)

    // Uncomment when database is ready
    // const result = await query(`
    //   INSERT INTO maids (
    //     full_name, reference_code, type, nationality, date_of_birth, place_of_birth,
    //     height, weight, religion, marital_status, number_of_children, number_of_siblings,
    //     home_address, airport_repatriation, education_level, language_skills,
    //     skills_preferences, work_areas, employment_history, introduction, agency_contact
    //   ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
    //   RETURNING *
    // `, [
    //   maidData.fullName, maidData.referenceCode, maidData.type, maidData.nationality,
    //   maidData.dateOfBirth, maidData.placeOfBirth, maidData.height, maidData.weight,
    //   maidData.religion, maidData.maritalStatus, maidData.numberOfChildren, maidData.numberOfSiblings,
    //   maidData.homeAddress, maidData.airportRepatriation, maidData.educationLevel,
    //   JSON.stringify(maidData.languageSkills), JSON.stringify(maidData.skillsPreferences),
    //   JSON.stringify(maidData.workAreas), JSON.stringify(maidData.employmentHistory),
    //   JSON.stringify(maidData.introduction), JSON.stringify(maidData.agencyContact)
    // ])
    // res.status(201).json(result.rows[0])
  } catch (error) {
    console.error('Error creating maid:', error)
    res.status(500).json({ error: 'Failed to create maid' })
  }
}

/**
 * PUT /api/maids/:id
 * Update a maid
 */
export const updateMaid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const maidData: Partial<MaidProfile> = req.body

    // For now, just return the updated data
    const updatedMaid = {
      id: parseInt(id),
      ...maidData,
      updated_at: new Date().toISOString()
    }
    res.json(updatedMaid)

    // Uncomment when database is ready
    // const fields = []
    // const values = []
    // let paramIndex = 1

    // Object.keys(maidData).forEach(key => {
    //   if (maidData[key as keyof MaidProfile] !== undefined) {
    //     const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
    //     fields.push(`${dbKey} = $${paramIndex}`)
    //     values.push(maidData[key as keyof MaidProfile])
    //     paramIndex++
    //   }
    // })

    // if (fields.length === 0) {
    //   return res.status(400).json({ error: 'No fields to update' })
    // }

    // values.push(id)
    // const result = await query(
    //   `UPDATE maids SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`,
    //   values
    // )

    // if (result.rows.length === 0) {
    //   return res.status(404).json({ error: 'Maid not found' })
    // }

    // res.json(result.rows[0])
  } catch (error) {
    console.error('Error updating maid:', error)
    res.status(500).json({ error: 'Failed to update maid' })
  }
}

/**
 * DELETE /api/maids/:id
 * Delete a maid
 */
export const deleteMaid = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    // For now, just return success
    res.json({ message: 'Maid deleted successfully' })

    // Uncomment when database is ready
    // const result = await query('DELETE FROM maids WHERE id = $1 RETURNING *', [id])
    // if (result.rows.length === 0) {
    //   return res.status(404).json({ error: 'Maid not found' })
    // }
    // res.json({ message: 'Maid deleted successfully' })
  } catch (error) {
    console.error('Error deleting maid:', error)
    res.status(500).json({ error: 'Failed to delete maid' })
  }
}