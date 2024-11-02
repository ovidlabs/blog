import { ChangeDetectionStrategy, Component } from '@angular/core'
import { SharedModule, TypedBaseListComponent } from '@vendure/admin-ui/core'
import { GetPostListDocument } from '../../gql/graphql' // generated document from GET_POST_LIST
import { PostStatusLabelComponent } from '../post-status-label/post-status-label.component'

@Component({
	selector: 'post-list',
	templateUrl: './post-list.html',
	styleUrls: ['./post-list.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [SharedModule, PostStatusLabelComponent],
})

export class PostListComponent extends TypedBaseListComponent<typeof GetPostListDocument, 'blogPosts'> {
	customFields = this.getCustomFieldConfig('BlogPost')

	// Here we set up the filters that will be available to use in the data table
	readonly filters = this.createFilterCollection()
		.addDateFilters()
		.addFilter({
			name: 'status',
			type: {
				kind: 'select',
				options: [
					{ value: 'draft', label: 'Draft' },
					{ value: 'published', label: 'Published' },
					{ value: 'archived', label: 'Archived' },
				],
			},
			label: 'Status',
			filterField: 'status',
		})
		.addFilter({
			name: 'slug',
			type: { kind: 'text' },
			label: 'Slug',
			filterField: 'slug'
		})
		.addFilter({
			name: 'title',
			type: { kind: 'text' },
			label: 'Title',
			filterField: 'title'
		})
		.addFilter({
			name: 'excerpt',
			type: { kind: 'text' },
			label: 'Excerpt',
			filterField: 'excerpt'
		})
		.addFilter({
			name: 'contentType',
			type: {
				kind: 'select',
				options: [
					{ value: 'html', label: 'HTML' },
					{ value: 'markdown', label: 'Markdown' }
				],
			},
			label: 'Content Type',
			filterField: 'contentType'
		})
		.addFilter({
			name: 'content',
			type: { kind: 'text' },
			label: 'Content',
			filterField: 'content'
		})
		.addFilter({
			name: 'description',
			type: { kind: 'text' },
			label: 'Description',
			filterField: 'description'
		})
		.addFilter({
			name: 'authorName',
			type: { kind: 'text' },
			label: 'Author',
			filterField: 'authorName'
		})
		.addFilter({
			name: 'categoryName',
			type: { kind: 'text' },
			label: 'Category',
			filterField: 'categoryName'
		})
		.addCustomFieldFilters(this.customFields)
		.connectToRoute(this.route);

	// Here we set up the sorting options that will be available to use in the data table
	readonly sorts = this.createSortCollection()
		.defaultSort('createdAt', 'DESC')
		.addSort({ name: 'createdAt' })
		.addSort({ name: 'updatedAt' })
		.addSort({ name: 'status' })
		.addSort({ name: 'slug' })
		.addSort({ name: 'title' })
		.addSort({ name: 'contentType' })
		.addSort({ name: 'authorName' })
		.addSort({ name: 'categoryName' })
		.addCustomFieldSorts(this.customFields)
		.connectToRoute(this.route);

	constructor() {
		super()
		super.configure({
			document: GetPostListDocument,
			getItems: data => data.blogPosts,
			setVariables: (skip, take) => ({
				options: {
					skip,
					take,
					filter: {
						title: {
							contains: this.searchTermControl.value ?? undefined,
						},
						...this.filters.createFilterInput(),
					},
					sort: this.sorts.createSortInput(),
				},
			}),
			refreshListOnChanges: [this.filters.valueChanges, this.sorts.valueChanges],
		})
	}
}
