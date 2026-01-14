import { HttpError } from './Error'

export class ResourceNotFoundError extends HttpError {
  constructor(resource = 'Resource Not Found') {
    super(404, 'RESOURCE_NOT_FOUND', `${resource}`)
  }
}

export class BadRequest extends HttpError {
  constructor(message = 'Bad Request') {
    super(400, 'BAD_REQUEST', message)
  }
}
