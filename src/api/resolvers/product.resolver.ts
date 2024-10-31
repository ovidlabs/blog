import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Allow, Collection, Ctx, ListQueryBuilder, Permission, RequestContext } from '@vendure/core'
import { BlogPost } from '../../entities/blog-post.entity'
import { QueryBlogPostsArgs } from '../../generated-admin-types'

@Resolver('Product')
export class ProductResolver {
	constructor(private listQueryBuilder: ListQueryBuilder) {}

	@ResolveField()
	@Allow(Permission.UpdateCatalog)
	async posts(@Ctx() ctx: RequestContext, @Parent() collection: Collection, @Args() args: QueryBlogPostsArgs) {
		return this.listQueryBuilder
			// @ts-ignore
			.build(BlogPost, args.options || undefined, {
				where: { collections: { id: collection.id } },
				relations: ['product', 'customer', 'order'],
				ctx
			})
			.getManyAndCount()
			.then(([items, totalItems]) => ({
				items,
				totalItems
			}))
	}
}
