import { registerRouteComponent } from '@vendure/admin-ui/core'

import { AuthorListComponent } from './components/author-list/author-list.component'
import { AuthorDetailComponent } from './components/author-detail/author-detail.component'
import { GET_AUTHOR_DETAIL } from './components/author-detail/author-detail.graphql'
import { CategoryListComponent } from './components/category-list/category-list.component'
import { CategoryDetailComponent } from './components/category-detail/category-detail.component'
import { GET_CATEGORY_DETAIL } from './components/category-detail/category-detail.graphql'
import { PostListComponent } from './components/post-list/post-list.component'
import { PostDetailComponent } from './components/post-detail/post-detail.component'
import { GET_POST_DETAIL } from './components/post-detail/post-detail.graphql'
import { PostEditorComponent } from './components/post-editor/post-editor.component'
import { PostTagListComponent } from './components/tag-list/tag-list.component'
import { PostTagDetailComponent } from './components/tag-detail/tag-detail.component'
import { GET_TAG_DETAIL } from './components/tag-detail/tag-detail.graphql'

export default [
	registerRouteComponent({
		path: 'authors',
		component: AuthorListComponent,
		breadcrumb: [{ label: 'Blog Authors', link: ['/extensions', 'blog', 'authors'] }],
	}),
	registerRouteComponent({
		path: 'authors/:id',
		component: AuthorDetailComponent,
		query: GET_AUTHOR_DETAIL,
		entityKey: 'blogAuthor',
		getBreadcrumbs: entity => [
			{ label: 'Blog Authors', link: ['/extensions/blog/authors'] },
			{
				label: entity ? `${entity?.name}` : 'Create New Author',
				link: [entity?.id],
			}
		],
	}),
	registerRouteComponent({
		path: 'categories',
		component: CategoryListComponent,
		breadcrumb: [{ label: 'Blog Categories', link: ['/extensions', 'blog', 'categories'] }],
	}),
	registerRouteComponent({
		path: 'categories/:id',
		component: CategoryDetailComponent,
		query: GET_CATEGORY_DETAIL,
		entityKey: 'blogCategory',
		getBreadcrumbs: entity => [
			{ label: 'Blog Categories', link: ['/extensions/blog/categories'] },
			{
				label: entity ? `${entity?.name}` : 'Create New Category',
				link: [entity?.id],
			}
		],
	}),
	registerRouteComponent({
		path: 'posts',
		component: PostListComponent,
		breadcrumb: [{ label: 'Blog Posts', link: ['/extensions', 'blog', 'posts'] }],
	}),
	registerRouteComponent({
		path: 'posts/:id',
		component: PostDetailComponent,
		query: GET_POST_DETAIL,
		entityKey: 'blogPost',
		getBreadcrumbs: entity => [
			{ label: 'Blog Posts', link: ['/extensions/blog/posts'] },
			{
				label: entity ? `${entity?.title}` : 'Create New Post',
				link: [entity?.id],
			}
		],
	}),
	registerRouteComponent({
		path: 'posts/:id/editor',
		component: PostEditorComponent,
		query: GET_POST_DETAIL,
		entityKey: 'blogPost',
		getBreadcrumbs: entity => [
			{ label: 'Blog Posts', link: ['/extensions/blog/posts'] },
			{
				label: entity ? `${entity?.title}` : 'Post Not Found',
				link: [`/extensions/blog/posts/${entity?.id}`],
			},
			{
				label: 'Editor',
				link: [entity?.id],
			}
		],
	}),
	registerRouteComponent({
		path: 'tags',
		component: PostTagListComponent,
		breadcrumb: [{ label: 'Blog Tags', link: ['/extensions', 'blog', 'tags'] }],
	}),
	registerRouteComponent({
		path: 'tags/:id',
		component: PostTagDetailComponent,
		query: GET_TAG_DETAIL,
		entityKey: 'blogTag',
		getBreadcrumbs: entity => [
			{ label: 'Blog Tags', link: ['/extensions/blog/tags'] },
			{
				label: entity ? `${entity?.value}` : 'Create New Tag',
				link: [entity?.id],
			}
		],
	}),
]
