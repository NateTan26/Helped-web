// Company Controller
// Handles all business logic for company profile, MOM personnel, and testimonials

import { Request, Response } from 'express'
import { query } from '../db'

interface CompanyProfile {
  id?: number
  company_name: string
  short_name: string
  license_no: string
  address_line1: string
  address_line2?: string
  postal_code: string
  country: string
  contact_person?: string
  contact_phone?: string
  contact_email?: string
  contact_fax?: string
  contact_website?: string
  office_hours_regular?: string
  office_hours_other?: string
  social_facebook?: string
  social_whatsapp_number?: string
  social_whatsapp_message?: string
  branding_theme_color?: string
  branding_button_color?: string
}

interface MOMPersonnel {
  id?: number
  company_id: number
  name: string
  registration_number: string
}

interface Testimonial {
  id?: number
  company_id: number
  message: string
  author: string
}

/**
 * GET /api/company
 * Fetch complete company profile including MOM personnel and testimonials
 */
export const getCompanyProfile = async (req: Request, res: Response) => {
  try {
    // Fetch company profile - for now, we'll get the first company (ID 1)
    // You can modify this to fetch by company_id parameter if you have multiple companies
    const companyResult = await query(
      'SELECT * FROM company_profile WHERE id = $1',
      [1]
    )

    if (companyResult.rows.length === 0) {
      return res.status(404).json({ error: 'Company profile not found' })
    }

    const company = companyResult.rows[0]

    // Fetch all MOM personnel for this company
    const momResult = await query(
      'SELECT * FROM mom_personnel WHERE company_id = $1 ORDER BY id ASC',
      [company.id]
    )

    // Fetch all testimonials for this company
    const testimonialResult = await query(
      'SELECT * FROM testimonials WHERE company_id = $1 ORDER BY created_at DESC',
      [company.id]
    )

    // Combine all data into a single response object
    const response = {
      companyProfile: company,
      momPersonnel: momResult.rows,
      testimonials: testimonialResult.rows,
    }

    res.status(200).json(response)
  } catch (error) {
    console.error('Error fetching company profile:', error)
    res.status(500).json({ error: 'Failed to fetch company profile' })
  }
}

/**
 * PUT /api/company
 * Update company profile information
 * Accepts JSON body with company profile fields to update
 */
export const updateCompanyProfile = async (req: Request, res: Response) => {
  try {
    const updates = req.body as Partial<CompanyProfile>

    // Build dynamic UPDATE query based on provided fields
    const fields: string[] = []
    const values: unknown[] = []
    let paramCounter = 1

    // Only include fields that were provided in the request
    const allowedFields = [
      'company_name',
      'short_name',
      'license_no',
      'address_line1',
      'address_line2',
      'postal_code',
      'country',
      'contact_person',
      'contact_phone',
      'contact_email',
      'contact_fax',
      'contact_website',
      'office_hours_regular',
      'office_hours_other',
      'social_facebook',
      'social_whatsapp_number',
      'social_whatsapp_message',
      'branding_theme_color',
      'branding_button_color',
    ]

    for (const field of allowedFields) {
      const value = updates[field as keyof CompanyProfile]
      if (value !== undefined) {
        fields.push(`${field} = $${paramCounter}`)
        values.push(value)
        paramCounter++
      }
    }

    // If no fields to update, return error
    if (fields.length === 0) {
      return res
        .status(400)
        .json({ error: 'No valid fields provided for update' })
    }

    // Add updated_at timestamp
    fields.push(`updated_at = $${paramCounter}`)
    values.push(new Date())
    paramCounter++

    // Add company ID to where clause
    values.push(1) // Company ID = 1 (first company)

    // Build and execute the UPDATE query
    const updateQuery = `
      UPDATE company_profile 
      SET ${fields.join(', ')}
      WHERE id = $${paramCounter}
      RETURNING *
    `

    const result = await query(updateQuery, values)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company profile not found' })
    }

    res.status(200).json({
      message: 'Company profile updated successfully',
      companyProfile: result.rows[0],
    })
  } catch (error) {
    console.error('Error updating company profile:', error)
    res.status(500).json({ error: 'Failed to update company profile' })
  }
}

/**
 * POST /api/company/mom-personnel
 * Add a new MOM personnel entry
 */
export const addMOMPersonnel = async (req: Request, res: Response) => {
  try {
    const { name, registration_number } = req.body

    if (!name || !registration_number) {
      return res
        .status(400)
        .json({ error: 'Name and registration number are required' })
    }

    const result = await query(
      `INSERT INTO mom_personnel (company_id, name, registration_number) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [1, name, registration_number] // Company ID = 1
    )

    res.status(201).json({
      message: 'MOM personnel added successfully',
      momPersonnel: result.rows[0],
    })
  } catch (error) {
    console.error('Error adding MOM personnel:', error)
    res.status(500).json({ error: 'Failed to add MOM personnel' })
  }
}

/**
 * PUT /api/company/mom-personnel/:id
 * Update MOM personnel entry
 */
export const updateMOMPersonnel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, registration_number } = req.body

    if (!name && !registration_number) {
      return res.status(400).json({
        error: 'At least one field (name or registration_number) is required',
      })
    }

    const fields: string[] = []
    const values: unknown[] = []
    let paramCounter = 1

    if (name !== undefined) {
      fields.push(`name = $${paramCounter}`)
      values.push(name)
      paramCounter++
    }

    if (registration_number !== undefined) {
      fields.push(`registration_number = $${paramCounter}`)
      values.push(registration_number)
      paramCounter++
    }

    values.push(id)

    const result = await query(
      `UPDATE mom_personnel 
       SET ${fields.join(', ')}
       WHERE id = $${paramCounter}
       RETURNING *`,
      values
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'MOM personnel not found' })
    }

    res.status(200).json({
      message: 'MOM personnel updated successfully',
      momPersonnel: result.rows[0],
    })
  } catch (error) {
    console.error('Error updating MOM personnel:', error)
    res.status(500).json({ error: 'Failed to update MOM personnel' })
  }
}

/**
 * DELETE /api/company/mom-personnel/:id
 * Delete MOM personnel entry
 */
export const deleteMOMPersonnel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const result = await query(
      'DELETE FROM mom_personnel WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'MOM personnel not found' })
    }

    res.status(200).json({
      message: 'MOM personnel deleted successfully',
      deletedMOMPersonnel: result.rows[0],
    })
  } catch (error) {
    console.error('Error deleting MOM personnel:', error)
    res.status(500).json({ error: 'Failed to delete MOM personnel' })
  }
}

/**
 * POST /api/company/testimonials
 * Add a new testimonial
 */
export const addTestimonial = async (req: Request, res: Response) => {
  try {
    const { message, author } = req.body

    if (!message || !author) {
      return res
        .status(400)
        .json({ error: 'Message and author are required' })
    }

    const result = await query(
      `INSERT INTO testimonials (company_id, message, author) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [1, message, author] // Company ID = 1
    )

    res.status(201).json({
      message: 'Testimonial added successfully',
      testimonial: result.rows[0],
    })
  } catch (error) {
    console.error('Error adding testimonial:', error)
    res.status(500).json({ error: 'Failed to add testimonial' })
  }
}

/**
 * DELETE /api/company/testimonials/:id
 * Delete testimonial
 */
export const deleteTestimonial = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const result = await query(
      'DELETE FROM testimonials WHERE id = $1 RETURNING *',
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Testimonial not found' })
    }

    res.status(200).json({
      message: 'Testimonial deleted successfully',
      deletedTestimonial: result.rows[0],
    })
  } catch (error) {
    console.error('Error deleting testimonial:', error)
    res.status(500).json({ error: 'Failed to delete testimonial' })
  }
}
