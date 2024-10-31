import { Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { DeletionResponse, DeletionResult, JobState } from '@vendure/common/lib/generated-types'
import {
	CustomFieldRelationService,
	ID, 
	JobQueue, 
	JobQueueService,
	ListQueryBuilder,
	ListQueryOptions,
	PaginatedList,
	Product,
	RelationPaths,
	RequestContext,
	SerializedRequestContext,
	TransactionalConnection,
	assertFound,
	patchEntity
} from '@vendure/core'
import { BLOG_PLUGIN_OPTIONS } from '../constants'
import { BlogAuthor } from '../entities/blog-author.entity'
import { BlogCategory } from '../entities/blog-category.entity'
import { BlogPost } from '../entities/blog-post.entity'
import { BlogPostHistoryService } from './history.service'
import { BlogTag } from '../entities/blog-tag.entity'
import { PluginInitOptions } from '../types'
import { 
	HistoryEntryType,
	CreateBlogAuthorInput,
	UpdateBlogAuthorInput,
	CreateBlogCategoryInput,
	UpdateBlogCategoryInput,
	CreateBlogPostInput,
	UpdateBlogPostInput,
	MutationAddBlogProductTagArgs,
	MutationAddBlogTagArgs,
	MutationRemoveBlogProductTagArgs,
	MutationRemoveBlogTagArgs,
	MutationAddBlogPostNoteArgs,
	MutationUpdateBlogPostNoteArgs,
	MutationDeleteBlogPostNoteArgs
} from '../generated-admin-types'

@Injectable()
export class BlogService implements OnModuleInit {
	private myBackgroundTaskQueue: JobQueue<{ ctx: SerializedRequestContext, someArg: string; }>;

	constructor(
		@Inject(BLOG_PLUGIN_OPTIONS) private options: PluginInitOptions,
		private connection: TransactionalConnection,
		private listQueryBuilder: ListQueryBuilder,
		private customFieldRelationService: CustomFieldRelationService,
		private jobQueueService: JobQueueService,
		private historyService: BlogPostHistoryService
	) {}

	public async onModuleInit(): Promise<void> {
		this.myBackgroundTaskQueue = await this.jobQueueService.createQueue({
			name: 'my-background-task',
			process: async job => {
				// Deserialize the RequestContext from the job data
				const ctx = RequestContext.deserialize(job.data.ctx);
				// The "someArg" property is passed in when the job is triggered
				const someArg = job.data.someArg;

				// Inside the `process` function we define how each job
				// in the queue will be processed.
				// Let's simulate some long-running task
				const totalItems = 10;
				for (let i = 0; i < totalItems; i++) {
					await new Promise(resolve => setTimeout(resolve, 500));

					// You can optionally respond to the job being cancelled
					// during processing. This can be useful for very long-running
					// tasks which can be cancelled by the user.
					if (job.state === JobState.CANCELLED) {
						throw new Error('Job was cancelled');
					}

					// Progress can be reported as a percentage like this
					job.setProgress(Math.floor(i / totalItems * 100));
				}

				// The value returned from the `process` function is stored
				// as the "result" field of the job
				return {
					processedCount: totalItems,
					message: `Successfully processed ${totalItems} items`,
				}
			},
		})
	}

	async getAuthors(ctx: RequestContext, options?: ListQueryOptions<BlogAuthor>): Promise<PaginatedList<BlogAuthor>> {
		return this.listQueryBuilder.build(BlogAuthor, options, { ctx }).getManyAndCount().then(([items, totalItems]) => {
			return {
				items,
				totalItems
			}
		})
	}

	async getAuthor(ctx: RequestContext, id: ID, relations?: RelationPaths<BlogAuthor>): Promise<BlogAuthor | null> {
		return await this.connection.getRepository(ctx, BlogAuthor).findOne({
			where: { id },
			relations
		})
	}

	async createAuthor(ctx: RequestContext, input: CreateBlogAuthorInput): Promise<BlogAuthor> {
		let author = new BlogAuthor(input)
		author = await this.connection.getRepository(ctx, BlogAuthor).save(author)
		await this.customFieldRelationService.updateRelations(ctx, BlogAuthor, input, author)
		return assertFound(this.getAuthor(ctx, author.id))
	}

	async updateAuthor(ctx: RequestContext, input: UpdateBlogAuthorInput): Promise<BlogAuthor> {
		let author = await this.connection.getEntityOrThrow(ctx, BlogAuthor, input.id)
		let updatedAuthor = patchEntity(author, input)
		await this.connection.getRepository(ctx, BlogAuthor).save(updatedAuthor)
		await this.customFieldRelationService.updateRelations(ctx, BlogAuthor, input, updatedAuthor)
		return assertFound(this.getAuthor(ctx, updatedAuthor.id))
	}

	async deleteAuthor(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
		const entity = await this.connection.getEntityOrThrow(ctx, BlogAuthor, id)
		try {
			await this.connection.getRepository(ctx, BlogAuthor).remove(entity)
			return {
				result: DeletionResult.DELETED,
			}
		} catch (e: any) {
			return {
				result: DeletionResult.NOT_DELETED,
				message: e.toString(),
			}
		}
	}

	async getCategories(ctx: RequestContext, options?: ListQueryOptions<BlogCategory>): Promise<PaginatedList<BlogCategory>> {
		return this.listQueryBuilder.build(BlogCategory, options, { ctx }).getManyAndCount().then(([items, totalItems]) => {
			return {
				items,
				totalItems
			}
		})
	}

	async getCategory(ctx: RequestContext, input: { id?: ID, slug?: string }, relations?: RelationPaths<BlogCategory>): Promise<BlogCategory | null> {
		const { id, slug } = input
		if (!input.id && !input.slug) return null
		return await this.connection.getRepository(ctx, BlogCategory).findOne({
			where: (id)? { id } : {slug},
			relations
		})
	}

	async createCategory(ctx: RequestContext, input: CreateBlogCategoryInput): Promise<BlogCategory> {
		let category = new BlogCategory(input)
		category = await this.connection.getRepository(ctx, BlogCategory).save(category)
		await this.customFieldRelationService.updateRelations(ctx, BlogCategory, input, category)
		return assertFound(this.getCategory(ctx, { id: category.id }))
	}

	async updateCategory(ctx: RequestContext, input: UpdateBlogCategoryInput): Promise<BlogCategory> {
		let category = await this.connection.getEntityOrThrow(ctx, BlogCategory, input.id)
		let updatedCategory = patchEntity(category, input)
		await this.connection.getRepository(ctx, BlogCategory).save(updatedCategory)
		await this.customFieldRelationService.updateRelations(ctx, BlogCategory, input, updatedCategory)
		return assertFound(this.getCategory(ctx, { id: updatedCategory.id }))
	}

	async deleteCategory(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
		const entity = await this.connection.getEntityOrThrow(ctx, BlogCategory, id)
		try {
			await this.connection.getRepository(ctx, BlogCategory).remove(entity)
			return {
				result: DeletionResult.DELETED,
			}
		} catch (e: any) {
			return {
				result: DeletionResult.NOT_DELETED,
				message: e.toString(),
			}
		}
	}

	async getPosts(ctx: RequestContext, options?: ListQueryOptions<BlogPost>, tagIds?: ID[], relations?: RelationPaths<BlogPost>): Promise<PaginatedList<BlogPost>> {
		if (tagIds) return this.getPostsByTags(ctx, tagIds, options, relations)
		if (ctx.apiType === 'shop') {
			options = {
				...options,
				filter: {
					...options?.filter,
					status: { eq: 'published' }
				}
			}
		}
		return this.listQueryBuilder
			.build(BlogPost, options || undefined, { 
				customPropertyMap: {
					authorName: 'author.name',
					categoryName: 'category.name'
				},
				relations, 
				ctx 
			})
			.getManyAndCount()
			.then(([items, totalItems]) => {
				return {
					items,
					totalItems
				}
			})
	}

	async getPostsByTags(ctx: RequestContext, tagIds: ID[], options?: ListQueryOptions<BlogPost>, relations?: RelationPaths<BlogPost>): Promise<PaginatedList<BlogPost>> {

		// TODO: Implement skip, take, filter, relations
		
		let posts = await this.connection.getRepository(ctx, BlogPost).find({
			relations: ['tags'],
			where: (ctx.apiType === 'shop')? { status: 'published' } : undefined
		})
		posts = posts.filter(post => post.tags.some(tag => tagIds.includes(tag.id)))
		return {
			items: posts,
			totalItems: posts.length
		}
	}

	async getPost(ctx: RequestContext, input: { id?: ID, slug?: string }, relations?: RelationPaths<BlogPost>): Promise<BlogPost | null> {
		const { id, slug } = input
		if (!input.id && !input.slug) return null
		return await this.connection.getRepository(ctx, BlogPost).findOne({
			where: (ctx.apiType === 'shop')? 
				(id)? { id, status: 'published' } : { slug, status: 'published' } :
				(id)? { id } : {slug},
			relations
		})
	}

	async createPost(ctx: RequestContext, input: CreateBlogPostInput): Promise<BlogPost> {
		let post = new BlogPost(input)
		if (input.authorId) post.author = await this.connection.getEntityOrThrow(ctx, BlogAuthor, input.authorId)
		if (input.categoryId) post.category = await this.connection.getEntityOrThrow(ctx, BlogCategory, input.categoryId)
		if (input.productIds) {
			for (const id of input.productIds) {
				const product = await this.connection.getEntityOrThrow(ctx, Product, id)
				if (product) {
					if (!post.products) post.products = []
					post.products.push(product)
				}
			}
		}
		if (input.tagIds) {
			for (const id of input.tagIds) {
				const tag = await this.connection.getEntityOrThrow(ctx, BlogTag, id)
				if (tag) {
					if (!post.tags) post.tags = []
					post.tags.push(tag)
				}
			}
		}
		post = await this.connection.getRepository(ctx, BlogPost).save(post)
		await this.customFieldRelationService.updateRelations(ctx, BlogPost, input, post)
		await this.historyService.createHistoryEntryForBlogPost({
			ctx,
			blogPostId: post.id,
			type: HistoryEntryType.BLOG_POST_CREATED,
			data: {
				input
			}
		})
		return assertFound(this.getPost(ctx, { id: post.id }, ['author', 'category', 'products', 'tags']))
	}

	async updatePost(ctx: RequestContext, input: UpdateBlogPostInput): Promise<BlogPost> {
		let post = await this.connection.getEntityOrThrow(ctx, BlogPost, input.id)
		if (input.authorId) post.author = await this.connection.getEntityOrThrow(ctx, BlogAuthor, input.authorId)
		if (input.categoryId) post.category = await this.connection.getEntityOrThrow(ctx, BlogCategory, input.categoryId)
		if (input.productIds) {
			post.products = []
			for (const id of input.productIds) {
				const product = await this.connection.getEntityOrThrow(ctx, Product, id)
				if (product) {
					post.products.push(product)
				}
			}
		}
		if (input.tagIds) {
			post.tags = []
			for (const id of input.tagIds) {
				const tag = await this.connection.getEntityOrThrow(ctx, BlogTag, id)
				if (tag) {
					post.tags.push(tag)
				}
			}
		}
		let updatedPost = patchEntity(post, input)
		await this.connection.getRepository(ctx, BlogPost).save(updatedPost)
		await this.customFieldRelationService.updateRelations(ctx, BlogPost, input, updatedPost)
		await this.historyService.createHistoryEntryForBlogPost({
			ctx,
			blogPostId: post.id,
			type: HistoryEntryType.BLOG_POST_UPDATED,
			data: {
				input
			}
		})
		return assertFound(this.getPost(ctx, { id: updatedPost.id })) // should include relations, or a waste?
	}

	async deletePost(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
		const entity = await this.connection.getEntityOrThrow(ctx, BlogPost, id)
		try {
			await this.connection.getRepository(ctx, BlogPost).remove(entity)
			await this.historyService.createHistoryEntryForBlogPost({
				ctx,
				blogPostId: id,
				type: HistoryEntryType.BLOG_POST_DELETED,
				data: {}
			})
			return {
				result: DeletionResult.DELETED,
			}
		} catch (e: any) {
			return {
				result: DeletionResult.NOT_DELETED,
				message: e.toString(),
			}
		}
	}

	async publishPost(ctx: RequestContext, id: ID): Promise<BlogPost> {
		let post = await this.connection.getEntityOrThrow(ctx, BlogPost, id)
		if (post.status === 'published') return post
		post.status = 'published'
		post = await this.connection.getRepository(ctx, BlogPost).save(post)
		await this.historyService.createHistoryEntryForBlogPost({
			ctx,
			blogPostId: id,
			type: HistoryEntryType.BLOG_POST_PUBLISHED,
			data: {}
		})
		return post
	}

	async archivePost(ctx: RequestContext, id: ID): Promise<BlogPost> {
		let post = await this.connection.getEntityOrThrow(ctx, BlogPost, id)
		if (post.status === 'archived') return post
		post.status = 'archived'
		post = await this.connection.getRepository(ctx, BlogPost).save(post)
		await this.historyService.createHistoryEntryForBlogPost({
			ctx,
			blogPostId: id,
			type: HistoryEntryType.BLOG_POST_ARCHIVED,
			data: {}
		})
		return post
	}

	async addPostNote(ctx: RequestContext, { id, note }: MutationAddBlogPostNoteArgs) {
		const entry = await this.historyService.createHistoryEntryForBlogPost({
			ctx,
			blogPostId: id,
			type: HistoryEntryType.BLOG_POST_NOTE,
			data: {
				note
			}
		})
		return entry
	}

	async updatePostNote(ctx: RequestContext, { id, note }: MutationUpdateBlogPostNoteArgs) {
		const entry = await this.historyService.updateBlogPostHistoryEntry(ctx, {
			entryId: id,
			ctx,
			type: HistoryEntryType.BLOG_POST_NOTE,
			data: {
				note
			}
		})
		return entry
	}

	async deletePostNote(ctx: RequestContext, { id }: MutationDeleteBlogPostNoteArgs) {
		return await this.historyService.deleteBlogPostHistoryEntry(ctx, id)
	}

	async getTags(ctx: RequestContext, options?: ListQueryOptions<BlogTag>, relations?: RelationPaths<BlogTag>): Promise<PaginatedList<BlogTag>> {
		return this.listQueryBuilder.build(BlogTag, options, { relations, ctx }).getManyAndCount().then(([items, totalItems]) => {
			return {
				items,
				totalItems
			}
		})
	}

	async getTag(ctx: RequestContext, id: ID, relations?: RelationPaths<BlogTag>): Promise<BlogTag | null> {
		return await this.connection.getRepository(ctx, BlogTag).findOne({
			where: { id },
			relations
		})
	}

	async createTag(ctx: RequestContext, value: string): Promise<BlogTag> {
		let tag = new BlogTag({ value})
		tag = await this.connection.getRepository(ctx, BlogTag).save(tag)
		return assertFound(this.getTag(ctx, tag.id))
	}

	async updateTag(ctx: RequestContext, id: ID, value: string): Promise<BlogTag> {
		let tag = await this.connection.getEntityOrThrow(ctx, BlogTag, id)
		let updatedTag = patchEntity(tag, { value })
		await this.connection.getRepository(ctx, BlogTag).save(updatedTag)
		return assertFound(this.getTag(ctx, updatedTag.id))
	}

	async deleteTag(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
		const entity = await this.connection.getEntityOrThrow(ctx, BlogTag, id)
		try {
			await this.connection.getRepository(ctx, BlogTag).remove(entity)
			return {
				result: DeletionResult.DELETED,
			}
		} catch (e: any) {
			return {
				result: DeletionResult.NOT_DELETED,
				message: e.toString(),
			}
		}
	}

	async addBlogTag(ctx: RequestContext, { id, tagId }: MutationAddBlogTagArgs): Promise<Boolean> {
		let post = await this.connection.getEntityOrThrow(ctx, BlogPost, id, {
			relations: ['tags']
		})
		const tag = await this.connection.getEntityOrThrow(ctx, BlogTag, tagId)
		post.tags.push(tag)
		post = await this.connection.getRepository(ctx, BlogPost).save(post)
		return true
	}

	async removeBlogTag(ctx: RequestContext, { id, tagId }: MutationRemoveBlogTagArgs): Promise<Boolean> {
		let post = await this.connection.getEntityOrThrow(ctx, BlogPost, id, {
			relations: ['tags']
		})
		post.tags = post.tags.filter(tag => tag.id !== tagId)
		post = await this.connection.getRepository(ctx, BlogPost).save(post)
		return true
	}

	async addBlogProductTag(ctx: RequestContext, { id, productId }: MutationAddBlogProductTagArgs): Promise<Boolean> {
		let post = await this.connection.getEntityOrThrow(ctx, BlogPost, id, {
			relations: ['products']
		})
		const product = await this.connection.getEntityOrThrow(ctx, Product, productId)
		post.products.push(product)
		post = await this.connection.getRepository(ctx, BlogPost).save(post)
		return true
	}

	async removeBlogProductTag(ctx: RequestContext, { id, productId }: MutationRemoveBlogProductTagArgs): Promise<Boolean> {
		let post = await this.connection.getEntityOrThrow(ctx, BlogPost, id, {
			relations: ['products']
		})
		post.products = post.products.filter(product => product.id !== productId)
		post = await this.connection.getRepository(ctx, BlogPost).save(post)
		return true
	}

	public triggerMyBackgroundTask(ctx: RequestContext) {
		return this.myBackgroundTaskQueue.add({
			ctx: ctx.serialize(),
			someArg: 'foo',
		})
	}
}
