import { ChangeDetectionStrategy, Component } from '@angular/core'
import { SharedModule, TypedBaseListComponent } from '@vendure/admin-ui/core'
import { GetAuthorListDocument } from '../../gql/graphql' // generated document from GET_AUTHOR_LIST

@Component({
	selector: 'author-list',
	templateUrl: './author-list.html',
	styleUrls: ['./author-list.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [SharedModule],
})

export class AuthorListComponent extends TypedBaseListComponent<typeof GetAuthorListDocument, 'blogAuthors'> {
	customFields = this.getCustomFieldConfig('BlogTag')

	// Here we set up the filters that will be available to use in the data table
	readonly filters = this.createFilterCollection()
		.addDateFilters()
		.addFilter({
			name: 'name',
			type: { kind: 'text' },
			label: 'Name',
			filterField: 'name'
		})
		.addFilter({
			name: 'bio',
			type: { kind: 'text' },
			label: 'Bio',
			filterField: 'bio'
		})
		.addCustomFieldFilters(this.customFields)
		.connectToRoute(this.route);

	// Here we set up the sorting options that will be available to use in the data table
	readonly sorts = this.createSortCollection()
		.defaultSort('createdAt', 'DESC')
		.addSort({ name: 'createdAt' })
		.addSort({ name: 'updatedAt' })
		.addSort({ name: 'name' })
		.addSort({ name: 'bio' })
		.addCustomFieldSorts(this.customFields)
		.connectToRoute(this.route);

	constructor() {
		super()
		super.configure({
			document: GetAuthorListDocument,
			getItems: data => data.blogAuthors,
			setVariables: (skip, take) => ({
				options: {
					skip,
					take,
					filter: {
						name: {
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
