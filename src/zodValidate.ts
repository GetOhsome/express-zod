/** @format */

import type { Request, Response, NextFunction, RequestHandler } from 'express'
import { z, AnyZodObject } from 'zod'

/**
 * Validateable interface for express request object
 */
interface Validatable {
  body?: Record<string, any>
  params?: Record<string, any>
  query?: Record<string, any>
}

/**
 * Validation interface
 * @template B Zod object for body
 * @template P Zod object for params
 * @template Q Zod object for query
 */
interface Validation<
  B extends AnyZodObject,
  P extends AnyZodObject,
  Q extends AnyZodObject
> {
  body?: B
  params?: P
  query?: Q
}

/**
 * Validate input with zod object and return parsed object if validation is successful or throw error if validation fails
 * @param input the input to validate
 * @param validation the zod object to validate input with´
 * @returns parsed object if validation is successful
 * @throws error if validation fails
 */
const _validate = async <
  B extends AnyZodObject,
  P extends AnyZodObject,
  Q extends AnyZodObject
>(
  input: Validatable,
  validation: Validation<B, P, Q>
) => {
  if (input.body && validation.body) {
    input.body = await validation.body.parseAsync(input.body)
  }

  if (input.params && validation.params) {
    input.params = await validation.params.parseAsync(input.params)
  }

  if (input.query && validation.query) {
    input.query = await validation.query.parseAsync(input.query)
  }
}

/**
 * Express middleware to validate request body, params, and query with zod object and return parsed object if validation is successful or throw error if validation fails
 *
 * @param validation Validation object containing zod object for body, params, and query
 * @returns Express middleware function
 *
 * @example
 *  // Example usage with express
 *  import express from 'express'
 *  import { validate } from 'express-zod'
 *  import { z } from 'zod'
 *
 *  const app = express()
 *
 *  // Example validation object
 *  const validation = {
 *    body: z.object({
 *      name: z.string(),
 *    }),
 *    params: z.object({
 *      id: z.string(),
 *    }),
 *    query: z.object({
 *      limit: z.number(),
 *    }),
 *  }
 *
 *  app.post('/users/:id', validate(validation), (req, res) => {
 *    // req.body.name is now a string
 *    // req.params.id is now a string
 *    // req.query.limit is now a number
 *  })
 */
export const validate = <
  B extends AnyZodObject,
  P extends AnyZodObject,
  Q extends AnyZodObject
>(
  validation: Validation<B, P, Q>
): RequestHandler<z.infer<P>, {}, z.infer<B>, z.infer<Q>> => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await _validate(req, validation)
      next()
    } catch (error) {
      next(error)
    }
  }
}
