/** @format */

import type { Request, Response, NextFunction, RequestHandler } from 'express'
import { z, AnyZodObject } from 'zod'

interface Validatable {
  body?: Record<string, any>
  params?: Record<string, any>
  query?: Record<string, any>
}

interface Validation<
  B extends AnyZodObject,
  P extends AnyZodObject,
  Q extends AnyZodObject
> {
  body?: B
  params?: P
  query?: Q
}

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
