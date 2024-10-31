import { 
	Administrator,
	AdministratorService,
	EventBus, 
	ID,
	HistoryEntryEvent,
	HistoryService,
	ListQueryBuilder, 
	PaginatedList,
	RequestContext,
	TransactionalConnection,
	Type
} from '@vendure/core'
import { 
	HistoryEntryListOptions,
	HistoryEntryType,
	CreateBlogPostInput,
	UpdateBlogPostInput
} from '../generated-admin-types'
import { HistoryEntry } from '@vendure/core/dist/entity/history-entry/history-entry.entity'
import { BlogPostHistoryEntry } from '../entities/blog-post-history-entry.entity'

export interface BlogPostHistoryEntryData {
	[HistoryEntryType.BLOG_POST_CREATED]: {
		input: CreateBlogPostInput
	}
	[HistoryEntryType.BLOG_POST_UPDATED]: {
		input: UpdateBlogPostInput
	}
	[HistoryEntryType.BLOG_POST_DELETED]: {
	}
	[HistoryEntryType.BLOG_POST_PUBLISHED]: {
	}
	[HistoryEntryType.BLOG_POST_ARCHIVED]: {
	}
	[HistoryEntryType.BLOG_POST_NOTE]: {
		note: string
	}
}

export interface CreateBlogPostHistoryEntryArgs<T extends keyof BlogPostHistoryEntryData> {
	blogPostId: ID
	ctx: RequestContext
	type: T
	data?: BlogPostHistoryEntryData[T]
}

export interface UpdateBlogPostHistoryEntryArgs<T extends keyof BlogPostHistoryEntryData> {
	entryId: ID
	ctx: RequestContext
	type: T
	data?: BlogPostHistoryEntryData[T]
}

export class BlogPostHistoryService extends HistoryService {
	constructor(
		private myConnection: TransactionalConnection,
		private myAdministratorService: AdministratorService,
		private myListQueryBuilder: ListQueryBuilder,
		private myEventBus: EventBus,
  ) {
		super(myConnection, myAdministratorService, myListQueryBuilder, myEventBus)
  }

	async getHistoryForBlogPost(
		ctx: RequestContext,
		blogPostId: ID,
		options?: HistoryEntryListOptions,
	): Promise<PaginatedList<BlogPostHistoryEntry>> {
		return this.myListQueryBuilder
			.build(HistoryEntry as any as Type<BlogPostHistoryEntry>, options, {
				where: {
					blogPost: { id: blogPostId }
				},
				relations: ['administrator'],
				ctx,
			})
			.getManyAndCount()
			.then(([items, totalItems]) => ({
				items,
				totalItems,
			}))
	}

	async createHistoryEntryForBlogPost<T extends keyof BlogPostHistoryEntryData>(
		args: CreateBlogPostHistoryEntryArgs<T>,
		isPublic = true,
	): Promise<BlogPostHistoryEntry> {
		const { ctx, data, blogPostId, type } = args;
		const administrator = await this.getAdministratorFromCtx(ctx)
		const entry = new BlogPostHistoryEntry({
			// @ts-ignore
			type,
			isPublic,
			data: data as any,
			blogPost: { id: blogPostId },
			administrator,
		})
		const history = await this.myConnection.getRepository(ctx, BlogPostHistoryEntry).save(entry)
		// @ts-ignore
		this.myEventBus.publish(new HistoryEntryEvent(ctx, history, 'created', 'order', { type, data }))
		return history
	}

	async updateBlogPostHistoryEntry<T extends keyof BlogPostHistoryEntryData>(
		ctx: RequestContext,
		args: UpdateBlogPostHistoryEntryArgs<T>,
  ) {
		const entry = await this.myConnection.getEntityOrThrow(ctx, BlogPostHistoryEntry, args.entryId, {
			// @ts-ignore
			 where: { type: args.type },
		})

		if (args.data) {
			 entry.data = args.data
		}
		const administrator = await this.getAdministratorFromCtx(ctx)
		if (administrator) {
			 entry.administrator = administrator
		}
		const newEntry = await this.myConnection.getRepository(ctx, BlogPostHistoryEntry).save(entry)
		// @ts-ignore
		this.myEventBus.publish(new HistoryEntryEvent(ctx, entry, 'updated', 'blogPost', args))
		return newEntry
  }

	async deleteBlogPostHistoryEntry(ctx: RequestContext, id: ID): Promise<void> {
		const entry = await this.myConnection.getEntityOrThrow(ctx, BlogPostHistoryEntry, id)
		const deletedEntry = new BlogPostHistoryEntry(entry)
		await this.myConnection.getRepository(ctx,BlogPostHistoryEntry).remove(entry)
		this.myEventBus.publish(new HistoryEntryEvent(ctx, deletedEntry, 'deleted', 'order', id))
	}

	private async getAdministratorFromCtx(ctx: RequestContext): Promise<Administrator | undefined> {
		const administrator = ctx.activeUserId
			 ? await this.myAdministratorService.findOneByUserId(ctx, ctx.activeUserId)
			 : null
		return administrator ?? undefined
  	}
}