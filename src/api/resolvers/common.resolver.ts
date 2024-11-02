import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Permission } from '@vendure/common/lib/generated-types'
import {
	Allow,
	Ctx,
	ID,
	ListQueryOptions,
	PaginatedList,
	RelationPaths,
	Relations,
	RequestContext,
	Translated
} from '@vendure/core'
import { BlogAuthor } from '../../entities/blog-author.entity'
import { BlogCategory } from '../../entities/blog-category.entity'
import { BlogPost } from '../../entities/blog-post.entity'
import { BlogTag } from '../../entities/blog-tag.entity'
import { BlogService } from '../../services/blog.service'

@Resolver()
export class CommonResolver {
	constructor(private blogService: BlogService) {}

	@Query()
	async blogAuthor(@Ctx() ctx: RequestContext, @Args() args: { id: ID }, @Relations(BlogAuthor) relations: RelationPaths<BlogAuthor>): Promise<BlogAuthor | null> {
		return this.blogService.getAuthor(ctx, args.id, relations)
	}

	@Query()
	async blogAuthors(@Ctx() ctx: RequestContext, @Args() args: { options: ListQueryOptions<BlogAuthor> }): Promise<PaginatedList<BlogAuthor>> {
		return this.blogService.getAuthors(ctx, args.options)
	}

	@Query()
	async blogCategory(@Ctx() ctx: RequestContext, @Args() args: { id?: ID, slug?: string }, @Relations(BlogCategory) relations: RelationPaths<BlogCategory>): Promise<BlogCategory | null> {
		return this.blogService.getCategory(ctx, { id: args.id, slug: args.slug }, relations)
	}

	@Query()
	async blogCategories(@Ctx() ctx: RequestContext, @Args() args: { options: ListQueryOptions<BlogCategory> }): Promise<PaginatedList<BlogCategory>> {
		return this.blogService.getCategories(ctx, args.options)
	}

	@Query()
	async blogPost(@Ctx() ctx: RequestContext, @Args() args: { id?: ID, slug?: string }, @Relations(BlogPost) relations: RelationPaths<BlogPost>): Promise<Translated<BlogPost> | null> {
		if (args.id) return this.blogService.getPost(ctx, args.id, relations)
		else if (args.slug) return this.blogService.getPostBySlug(ctx, args.slug, relations)
		else return null
	}

	@Query()
	async blogPosts(@Ctx() ctx: RequestContext, @Args() args: { options: ListQueryOptions<BlogPost>, tagIds: ID[] }, @Relations(BlogPost) relations: RelationPaths<BlogPost>): Promise<PaginatedList<BlogPost>> {
		return this.blogService.getPosts(ctx, args.options || undefined, args.tagIds, relations)
	}

	@Query()
	async blogTag(@Ctx() ctx: RequestContext, @Args() args: { id: ID }, @Relations(BlogTag) relations: RelationPaths<BlogTag>): Promise<BlogTag | null> {
		return this.blogService.getTag(ctx, args.id, relations)
	}

	@Query()
	async blogTags(@Ctx() ctx: RequestContext, @Args() args: { options: ListQueryOptions<BlogTag> }, @Relations(BlogTag) relations: RelationPaths<BlogTag>): Promise<PaginatedList<BlogTag>> {
		return this.blogService.getTags(ctx, args.options || undefined, relations)
	}
}
