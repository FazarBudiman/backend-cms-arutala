import { upload } from '../../shared/services/upload'
import { AuthUser } from '../../types/auth.type'
import { ApiResponse } from '../../types/response.type'
import { generateContentText } from '../../utils/convertContentTeks'
import { ResponseHelper } from '../../utils/responseHelper'
import { generateUniquePageSlug } from '../../utils/slug'
import { PageService } from '../pages/page/page.service'
import {
  ArticleCoverProps,
  ArticleProps,
  ArticleUpdateProps,
  ParamsArticleProps,
} from './article.model'
import { ArticleService } from './article.service'

export class ArticleController {
  static async addArticleController(
    payload: ArticleProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { title } = await ArticleService.extractArticleMeta(
      payload.contentBlocks
    )

    const parentPageId = await PageService.getParentPageId('Article')
    const pageSlug = await generateUniquePageSlug(title, 'Article')

    const { page_id } = await PageService.addPage(
      title,
      parentPageId,
      pageSlug,
      user.user_id
    )

    const contentTeks = await generateContentText(payload.contentBlocks)

    const articleId = await ArticleService.addArticle(
      page_id,
      payload,
      contentTeks,
      user.user_id,
      title
    )
    return ResponseHelper.created('Menambah article berhasil', articleId)
  }

  static async addCoverArticleController(
    payload: ArticleCoverProps,
    params: ParamsArticleProps
  ): Promise<ApiResponse> {
    const { articleId } = params
    await ArticleService.verifyArticleIsExist(articleId)

    const coverUrl = await upload(payload.cover_image, '/article')

    const { article_title } = await ArticleService.addCoverArticle(
      articleId,
      coverUrl,
      payload.cover_description
    )

    return ResponseHelper.success(
      `Menambah cover article pada: ${article_title} berhasil`
    )
  }

  static async getAllArticleController(): Promise<ApiResponse> {
    const articles = await ArticleService.getAllArticle()
    return ResponseHelper.success(
      'Mengambil semua data article berhasil',
      articles
    )
  }

  static async getArticleByIdController(
    params: ParamsArticleProps
  ): Promise<ApiResponse> {
    const { articleId } = params
    await ArticleService.verifyArticleIsExist(articleId)
    const article = await ArticleService.getArticleById(articleId)
    return ResponseHelper.success('Mengambil data article berhasil', article)
  }

  static async updateArticleController(
    payload: ArticleUpdateProps,
    params: ParamsArticleProps,
    user: AuthUser
  ): Promise<ApiResponse> {
    const { articleId } = params
    await ArticleService.verifyArticleIsExist(articleId)

    let derivedData: {
      title?: string
      coverUrl?: string
      contentText?: string
      contentBlocks?: any[]
    } = {}

    if (payload.contentBlocks) {
      const { title } = await ArticleService.extractArticleMeta(
        payload.contentBlocks
      )
      const contentText = await generateContentText(payload.contentBlocks)

      derivedData = {
        title,
        contentText,
        contentBlocks: payload.contentBlocks,
      }
    }

    const { article_title } = await ArticleService.updateArticle(
      articleId,
      {
        status: payload.status,
        ...derivedData,
      },
      user.user_id
    )

    return ResponseHelper.success(
      `Mengubah article: '${article_title}' berhasil`
    )
  }

  static async deleteArticleController(
    params: ParamsArticleProps
  ): Promise<ApiResponse> {
    const { articleId } = params
    await ArticleService.verifyArticleIsExist(articleId)
    const { article_title } = await ArticleService.deleteArticle(articleId)
    return ResponseHelper.success(
      `Menghapus article : '${article_title}' berhasil`
    )
  }
}
