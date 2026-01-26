import { Elysia } from 'elysia'
import { courseField } from './courses-field/courses-field.route'
import { courseCategory } from './courses-category/course-category.route'
import { course } from './course/course.route'

export const courses = new Elysia({ prefix: '/courses' })
  .use(course)
  .use(courseField)
  .use(courseCategory)
