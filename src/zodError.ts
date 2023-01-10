/** @format */

import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

/**
 * Zod error handler for express middleware
 * @param handler Custom error handler function to override default error handler
 * @returns Express middleware function to handle zod errors
 *
 * @example
 * // Example usage with express
 * import express from 'express'
 * import { zodError } from 'express-zod'
 *
 * const app = express()
 *
 * app.use(zodError())
 *
 * // If you want to handle zod errors differently, you can provide a custom error handler
 * // This custom error handler will override the default error handler
 * app.use(
 *   zodError((err, req, res, next) => {
 *     // Handle zod errors here
 *   })
 * )
 */
export const zodError = (
  handler?: (
    error: ZodError,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
) => {
  return async (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    // Check if error is a zod error and handle it accordingly
    if (err instanceof ZodError) {
      // If custom error handler is provided, use it instead of default error handler
      if (handler) return handler(err, req, res, next)

      // Default error handler for zod errors (returns 400 status code)
      // You can customize this to return a different status code or error message format if you want
      return res.status(400).json({
        error: {
          message: err.flatten().fieldErrors,
        },
      })
    }

    next(err)
  }
}
