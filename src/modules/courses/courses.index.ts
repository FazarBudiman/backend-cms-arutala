import { Elysia } from 'elysia'
import { courseField } from './courses-field/courses-field.route'
import { courseCategory } from './courses-category/course-category.route'
import { course } from './course/course.route'
import { courseBatch } from './course/course-batch/course-batch.route'
import { courseBenefit } from './courses-benefit/course-benefit.route'

export const courses = new Elysia({ prefix: '/courses' })
  .use(courseField)
  .use(courseCategory)
  .use(courseBenefit)
  .use(course)
  .use(courseBatch)
