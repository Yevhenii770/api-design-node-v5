import type { Request, Response, NextFunction } from 'express'
import { type ZodSchema, ZodError } from 'zod'

// Middleware to validate request body against a Zod schema
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body)
      req.body = validatedData
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: e.issues.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            
          })),
        })
      }
      next(e)
    }
  }
}
// Middleware to validate request params against a Zod schema
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params)
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid URL parameters',
          details: e.issues.map((err) => {
            return {
              field: err.path.join('.'),
              message: err.message,
            }
          }),
        })
      }
      next(e)
    }
  }
}
// Middleware to validate request query against a Zod schema
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query)
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        return res.status(400).json({
          error: 'Invalid Query Params',
          details: e.issues.map((err) => {
            return {
              field: err.path.join('.'),
              message: err.message,
            }
          }),
        })
      }
      next(e)
    }
  }
}
