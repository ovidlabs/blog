import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core'
import { AdminUiExtension } from '@vendure/ui-devkit/compiler'
import * as path from 'path'

import { BLOG_PLUGIN_OPTIONS } from './constants'
import { PluginInitOptions } from './types'

import { adminApiExtensions } from './api/schema/admin.graphql'
import { shopApiExtensions } from './api/schema/shop.graphql'

import { CommonResolver } from './api/resolvers/common.resolver'
import { AdminResolver } from './api/resolvers/admin.resolver'
import { ShopResolver } from './api/resolvers/shop.resolver'
import { ProductResolver } from './api/resolvers/product.resolver'

import { BlogAuthor } from './entities/blog-author.entity'
import { BlogCategory } from './entities/blog-category.entity'
import { BlogPost } from './entities/blog-post.entity'
import { BlogPostHistoryEntry } from './entities/blog-post-history-entry.entity'
import { BlogTag } from './entities/blog-tag.entity'

import { BlogService } from './services/blog.service'
import { BlogPostHistoryService } from './services/history.service'

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [{ provide: BLOG_PLUGIN_OPTIONS, useFactory: () => BlogPlugin.options }, BlogService, BlogPostHistoryService],
    configuration: config => {
		// console.log('config', config)
		// console.log('BlogPlugin.options', BlogPlugin.options)
        // Plugin-specific configuration
        // such as custom fields, custom permissions,
        // strategies etc. can be configured here by
        // modifying the `config` object.
        return config
    },
    compatibility: '^3.0.0',
    entities: [BlogAuthor, BlogCategory, BlogPost, BlogPostHistoryEntry, BlogTag],
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [AdminResolver, CommonResolver, ProductResolver]
    },
	 shopApiExtensions: {
		schema: shopApiExtensions,
	   resolvers: [ShopResolver, CommonResolver, ProductResolver]
  	}
})
export class BlogPlugin {
	static options: PluginInitOptions

	static init(options: PluginInitOptions): Type<BlogPlugin> {
		this.options = options
		return BlogPlugin
	}

	static uiExtensions: AdminUiExtension = {
		extensionPath: path.join(__dirname, 'ui'),
		routes: [{ route: 'blog', filePath: 'routes.ts' }],
		providers: ['providers.ts'],
		translations: {
			en: path.join(__dirname, 'ui/translations/*.en.json')
		}
   }
}
