import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { DeletionResponse, Permission } from '@vendure/common/lib/generated-types'
import {
	Allow,
	Ctx,
	ID,
	RequestContext,
	Transaction
} from '@vendure/core'
import { BlogAuthor } from '../../entities/blog-author.entity'
import { BlogCategory } from '../../entities/blog-category.entity'
import { BlogPost } from '../../entities/blog-post.entity'
import { BlogTag } from '../../entities/blog-tag.entity'
import { BlogService } from '../../services/blog.service'
import { BlogPostHistoryService } from '../../services/history.service'
import { 
	HistoryEntryListOptions,
	SortOrder,
	CreateBlogAuthorInput,
	CreateBlogCategoryInput,
	CreateBlogPostInput,
	UpdateBlogAuthorInput,
	UpdateBlogCategoryInput,
	UpdateBlogPostInput,
	MutationAddBlogProductTagArgs,
	MutationAddBlogTagArgs,
	MutationRemoveBlogProductTagArgs,
	MutationRemoveBlogTagArgs,
	MutationAddBlogPostNoteArgs,
	MutationUpdateBlogPostNoteArgs,
	MutationDeleteBlogPostNoteArgs,
	QueryBlogPostHistoryArgs
} from '../../generated-admin-types'

@Resolver()
export class AdminResolver {
	constructor(private blogService: BlogService, private historyService: BlogPostHistoryService) {}

	@Query()
	@Allow(Permission.UpdateCatalog)
	async blogPostHistory(@Ctx() ctx: RequestContext, @Args() args: QueryBlogPostHistoryArgs) {
		const options: HistoryEntryListOptions = { ...args.options }
		if (!options.sort) {
			options.sort = { createdAt: SortOrder.ASC }
		}
		return this.historyService.getHistoryForBlogPost(ctx, args.id, args.options)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async createBlogAuthor(@Ctx() ctx: RequestContext, @Args() args: { input: CreateBlogAuthorInput }): Promise<BlogAuthor> {
		return this.blogService.createAuthor(ctx, args.input)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async updateBlogAuthor(@Ctx() ctx: RequestContext, @Args() args: { input: UpdateBlogAuthorInput }): Promise<BlogAuthor> {
		return this.blogService.updateAuthor(ctx, args.input)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async deleteBlogAuthor(@Ctx() ctx: RequestContext, @Args() args: { id: ID }): Promise<DeletionResponse> {
		return this.blogService.deleteAuthor(ctx, args.id)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async createBlogCategory(@Ctx() ctx: RequestContext, @Args() args: { input: CreateBlogCategoryInput }): Promise<BlogCategory> {
		return this.blogService.createCategory(ctx, args.input)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async updateBlogCategory(@Ctx() ctx: RequestContext, @Args() args: { input: UpdateBlogCategoryInput }): Promise<BlogCategory> {
		return this.blogService.updateCategory(ctx, args.input)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async deleteBlogCategory(@Ctx() ctx: RequestContext, @Args() args: { id: ID }): Promise<DeletionResponse> {
		return this.blogService.deleteCategory(ctx, args.id)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async createBlogPost(@Ctx() ctx: RequestContext, @Args() args: { input: CreateBlogPostInput }): Promise<BlogPost> {
		return this.blogService.createPost(ctx, args.input)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async updateBlogPost(@Ctx() ctx: RequestContext, @Args() args: { input: UpdateBlogPostInput }): Promise<BlogPost> {
		return this.blogService.updatePost(ctx, args.input)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async deleteBlogPost(@Ctx() ctx: RequestContext, @Args() args: { id: ID }): Promise<DeletionResponse> {
		return this.blogService.deletePost(ctx, args.id)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async publishBlogPost(@Ctx() ctx: RequestContext, @Args() args: { id: ID }): Promise<BlogPost> {
		return this.blogService.publishPost(ctx, args.id)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async archiveBlogPost(@Ctx() ctx: RequestContext, @Args() args: { id: ID }): Promise<BlogPost> {
		return this.blogService.archivePost(ctx, args.id)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async addBlogPostNote(@Ctx() ctx: RequestContext, @Args() { id, note }: MutationAddBlogPostNoteArgs) {
		return this.blogService.addPostNote(ctx, { id, note })
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async updateBlogPostNote(@Ctx() ctx: RequestContext, @Args() { id, note }: MutationUpdateBlogPostNoteArgs) {
		return this.blogService.updatePostNote(ctx, { id, note })
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async deleteBlogPostNote(@Ctx() ctx: RequestContext, @Args() { id }: MutationDeleteBlogPostNoteArgs) {
		return this.blogService.deletePostNote(ctx, { id })
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async createBlogTag(@Ctx() ctx: RequestContext, @Args() args: { value: string }): Promise<BlogTag> {
		return this.blogService.createTag(ctx, args.value)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async updateBlogTag(@Ctx() ctx: RequestContext, @Args() args: { id: ID, value: string }): Promise<BlogTag> {
		return this.blogService.updateTag(ctx, args.id, args.value)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async deleteBlogTag(@Ctx() ctx: RequestContext, @Args() args: { id: ID }): Promise<DeletionResponse> {
		return this.blogService.deleteTag(ctx, args.id)
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async addBlogTag(@Ctx() ctx: RequestContext, @Args() { id, tagId }: MutationAddBlogTagArgs): Promise<Boolean> {
		return await this.blogService.addBlogTag(ctx, { id, tagId })
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async removeBlogTag(@Ctx() ctx: RequestContext, @Args() { id, tagId }: MutationRemoveBlogTagArgs): Promise<Boolean> {
		return await this.blogService.removeBlogTag(ctx, { id, tagId })
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async addBlogProductTag(@Ctx() ctx: RequestContext, @Args() { id, productId }: MutationAddBlogProductTagArgs): Promise<Boolean> {
		return await this.blogService.addBlogProductTag(ctx, { id, productId })
	}

	@Mutation()
	@Transaction()
	@Allow(Permission.UpdateCatalog)
	async removeBlogProductTag(@Ctx() ctx: RequestContext, @Args() { id, productId }: MutationRemoveBlogProductTagArgs): Promise<Boolean> {
		return await this.blogService.removeBlogProductTag(ctx, { id, productId })
	}
}
