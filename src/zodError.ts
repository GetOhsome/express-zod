/** @format */

import type { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

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
    if (err instanceof ZodError) {
      if (handler) return handler(err, req, res, next)

      return res.status(400).json({
        error: {
          message: err.flatten().fieldErrors,
        },
      })
    }

    next(err)
  }
}
