import {
	addActionBarItem,
	addNavMenuSection,
	DataService,
	ModalService,
	registerBulkAction,
	registerCustomDetailComponent,
	registerPageTab
} from '@vendure/admin-ui/core'
import { 
	BlogPostStatus,
	DeleteBlogAuthorDocument,
	DeleteBlogCategoryDocument,
	DeleteBlogPostDocument,
	DeleteBlogTagDocument,
	GetPostDetailDocument,
	UpdatePostDocument
} from './gql/graphql'
import { PostSelectorDialogComponent } from './components/post-selector/post-selector.component'
import { PostListComponent } from './components/post-list/post-list.component'

export const navMenu = addNavMenuSection({
	id: 'blog',
	label: 'Blog',
	items: [
		{
			id: 'blog-posts',
			label: 'Posts',
			routerLink: ['/extensions/blog/posts'],
			icon: 'note',
		},
		{
			id: 'blog-categories',
			label: 'Categories',
			routerLink: ['/extensions/blog/categories'],
			icon: 'folder-open',
		  },
		{
			id: 'blog-authors',
			label: 'Authors',
			routerLink: ['/extensions/blog/authors'],
			icon: 'users',
		},
		{
			id: 'blog-tags',
			label: 'Tags',
			routerLink: ['/extensions/blog/tags'],
			icon: 'tags',
		}
	],
})

export const bulkActions = [
	registerBulkAction({
		location: 'author-list',
		label: 'Delete',
		icon: 'trash',
		iconClass: 'is-danger',
		onClick: ({ injector, selection, hostComponent }) => {
			const modalService = injector.get(ModalService)
			const dataService = injector.get(DataService)
			modalService
				.dialog({
					title: `Delete ${selection.length} authors?`,
					buttons: [
							{ type: 'secondary', label: 'cancel' },
							{ type: 'danger', label: 'Delete', returnValue: true },
					],
				})
				.subscribe(response => {
					if (response) {
							selection.map(item => 
								dataService.mutate(DeleteBlogAuthorDocument, { id: item.id }).subscribe(() => {})
							)
							hostComponent.refresh()
						}
					})
				},
	}),
	registerBulkAction({
		location: 'category-list',
		label: 'Delete',
		icon: 'trash',
		iconClass: 'is-danger',
		onClick: ({ injector, selection, hostComponent }) => {
			const modalService = injector.get(ModalService)
			const dataService = injector.get(DataService)
			modalService
				.dialog({
					title: `Delete ${selection.length} categories?`,
					buttons: [
							{ type: 'secondary', label: 'cancel' },
							{ type: 'danger', label: 'Delete', returnValue: true },
					],
				})
				.subscribe(response => {
					if (response) {
							selection.map(item => 
								dataService.mutate(DeleteBlogCategoryDocument, { id: item.id }).subscribe(() => {})
							)
							hostComponent.refresh()
						}
					})
			},
	}),
	registerBulkAction({
		location: 'post-list',
		label: 'Publish',
		icon: 'airplane',
		iconClass: 'is-success',
		onClick: ({ injector, selection, hostComponent }) => {
			const modalService = injector.get(ModalService)
			const dataService = injector.get(DataService)
			modalService
				.dialog({
					title: `Publish ${selection.length} posts?`,
					buttons: [
							{ type: 'secondary', label: 'cancel' },
							{ type: 'primary', label: 'Delete', returnValue: true },
					],
				})
				.subscribe(response => {
					if (response) {
							selection.map(item => dataService.mutate(UpdatePostDocument, { input: { id: item.id, status: BlogPostStatus.published } }))
							hostComponent.refresh()
						}
					})
		},
	}),
	registerBulkAction({
		location: 'post-list',
		label: 'Archive',
		icon: 'archive',
		iconClass: 'is-warning',
		onClick: ({ injector, selection, hostComponent }) => {
			const modalService = injector.get(ModalService)
			const dataService = injector.get(DataService)
			modalService
				.dialog({
					title: `Archive (unpublish) ${selection.length} posts?`,
					buttons: [
							{ type: 'secondary', label: 'cancel' },
							{ type: 'primary', label: 'Archive', returnValue: true },
					],
				})
				.subscribe(response => {
					if (response) {
							selection.map(item => dataService.mutate(UpdatePostDocument, { input: { id: item.id, status: BlogPostStatus.archived } }))
							hostComponent.refresh()
						}
					})
		},
	}),
	registerBulkAction({
		location: 'post-list',
		label: 'Delete',
		icon: 'trash',
		iconClass: 'is-danger',
		onClick: ({ injector, selection, hostComponent }) => {
			const modalService = injector.get(ModalService)
			const dataService = injector.get(DataService)
			modalService
				.dialog({
					title: `Delete ${selection.length} posts?`,
					buttons: [
							{ type: 'secondary', label: 'cancel' },
							{ type: 'primary', label: 'Delete', returnValue: true },
					],
				})
				.subscribe(response => {
					if (response) {
							selection.map(item => 
								dataService.mutate(DeleteBlogPostDocument, { id: item.id }).subscribe(() => {})
							)
							hostComponent.refresh()
						}
					})
		},
	}),
	registerBulkAction({
		location: 'tag-list',
		label: 'Delete',
		icon: 'trash',
		iconClass: 'is-danger',
		onClick: ({ injector, selection, hostComponent }) => {
			const modalService = injector.get(ModalService)
			const dataService = injector.get(DataService)
			modalService
				.dialog({
					title: `Delete ${selection.length} tags?`,
					buttons: [
							{ type: 'secondary', label: 'cancel' },
							{ type: 'danger', label: 'Delete', returnValue: true },
					],
				})
				.subscribe(response => {
					if (response) {
							selection.map(item => 
								dataService.mutate(DeleteBlogTagDocument, { id: item.id }).subscribe(() => {})
							)
							hostComponent.refresh()
						}
					})
			},
	}),
	registerBulkAction({
		location: 'product-list',
		label: 'Set Related Posts',
		icon: 'link',
		iconClass: 'is-info',
		onClick: ({ injector, selection, hostComponent}) => {
			const modalService = injector.get(ModalService)
			const dataService = injector.get(DataService)
			modalService
				.fromComponent(PostSelectorDialogComponent, {
					size: 'lg',
					closable: true
				})
				.subscribe((postIdsAsString) => {
					if (postIdsAsString) {
						const postIds = postIdsAsString.split(',')
						postIds.map(postId => {
							let updatedIds: any = []
							dataService.query(GetPostDetailDocument, { id: postId })
								.mapSingle(data => data?.blogPost?.products).subscribe(products => {
									const currentProductIds = products?.map(product => product?.id) || []
									const update = selection.map(product => product.id) || []
									updatedIds = update.concat(currentProductIds)
									dataService.mutate(UpdatePostDocument, {
										input: {
											id: postId,
											productIds: updatedIds
										}
									}).subscribe((res) => {
										// console.log(res)
									})
								})
							})
						}
					})
					hostComponent.refresh()
				}
	}),
	// registerPageTab({
	// 	location: 'product-detail',
	// 	tab: 'Related Posts',
	// 	route: 'posts',
	// 	component: PostListComponent, // Change to list for just that product
	// })
]

export default [
	navMenu, 
	...bulkActions
]