import { ChangeDetectionStrategy, Component } from '@angular/core'
import { SharedModule, TypedBaseListComponent } from '@vendure/admin-ui/core'
import { GetTagListDocument } from '../../gql/graphql' // generated document from GET_TAG_LIST

@Component({
	selector: 'tag-list',
	templateUrl: './tag-list.html',
	styleUrls: ['./tag-list.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [SharedModule],
})

export class PostTagListComponent extends TypedBaseListComponent<typeof GetTagListDocument, 'blogTags'> {
	customFields = this.getCustomFieldConfig('BlogTag')

	// Here we set up the filters that will be available to use in the data table
	readonly filters = this.createFilterCollection()
		.addDateFilters()
		.addFilter({
			name: 'value',
			type: { kind: 'text' },
			label: 'Value',
			filterField: 'value'
		})
		.addCustomFieldFilters(this.customFields)
		.connectToRoute(this.route);

	// Here we set up the sorting options that will be available to use in the data table
	readonly sorts = this.createSortCollection()
		.defaultSort('createdAt', 'DESC')
		.addSort({ name: 'createdAt' })
		.addSort({ name: 'updatedAt' })
		.addSort({ name: 'value' })
		.addCustomFieldSorts(this.customFields)
		.connectToRoute(this.route);

	constructor() {
		super()
		super.configure({
			document: GetTagListDocument,
			getItems: data => data.blogTags,
			setVariables: (skip, take) => ({
				options: {
					skip,
					take,
					filter: {
						value: {
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
