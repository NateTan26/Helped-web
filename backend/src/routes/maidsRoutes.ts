// Maids Routes
// Define all API endpoints for maids operations

import express, { Router } from 'express'
import {
  getMaids,
  getMaidById,
  createMaid,
  updateMaid,
  deleteMaid
} from '../controllers/maidsController'

const router: Router = express.Router()

/**
 * GET /api/maids
 * Fetch all maids
 */
router.get('/', getMaids)

/**
 * GET /api/maids/:id
 * Fetch a specific maid by ID
 */
router.get('/:id', getMaidById)

/**
 * POST /api/maids
 * Create a new maid
 */
router.post('/', createMaid)

/**
 * PUT /api/maids/:id
 * Update a maid
 */
router.put('/:id', updateMaid)

/**
 * DELETE /api/maids/:id
 * Delete a maid
 */
router.delete('/:id', deleteMaid)

export default router