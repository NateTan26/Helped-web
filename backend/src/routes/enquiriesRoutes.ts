// Enquiries Routes
// Define all API endpoints for enquiries operations

import express, { Router } from 'express'
import { getEnquiries, createEnquiry } from '../controllers/enquiriesController'

const router: Router = express.Router()

/**
 * GET /api/enquiries
 * Fetch all enquiries
 */
router.get('/', getEnquiries)

/**
 * POST /api/enquiries
 * Create a new enquiry
 */
router.post('/', createEnquiry)

export default router