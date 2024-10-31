import { ChangeDetectionStrategy, Component } from '@angular/core'
import { SharedModule, TypedBaseListComponent } from '@vendure/admin-ui/core'
import { GetCategoryListDocument } from '../../gql/graphql' // generated document from GET_COMPLAINTS_LIST
// import { ComplaintStatusLabelComponent } from '../complaint-status-label/complaint-status-label.component'

@Component({
	selector: 'category-list',
	templateUrl: './category-list.html',
	styleUrls: ['./category-list.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	// imports: [SharedModule, ComplaintStatusLabelComponent],
	imports: [SharedModule],
})

export class CategoryListComponent extends TypedBaseListComponent<typeof GetCategoryListDocument, 'blogCategories'> {
	customFields = this.getCustomFieldConfig('BlogCategory')

	// Here we set up the filters that will be available to use in the data table
	readonly filters = this.createFilterCollection()
		.addDateFilters()
		.addFilter({
			name: 'slug',
			type: { kind: 'text' },
			label: 'Slug',
			filterField: 'slug',
		})
		.addFilter({
			name: 'name',
			type: { kind: 'text' },
			label: 'Name',
			filterField: 'name',
		})
		.addFilter({
			name: 'description',
			type: { kind: 'text' },
			label: 'Description',
			filterField: 'description',
		})
		.addFilter({
			name: 'keywords',
			type: { kind: 'text' },
			label: 'Keywords',
			filterField: 'keywords',
		})
		.addCustomFieldFilters(this.customFields)
		.connectToRoute(this.route);

	// Here we set up the sorting options that will be available to use in the data table
	readonly sorts = this.createSortCollection()
		.defaultSort('createdAt', 'DESC')
		.addSort({ name: 'createdAt' })
		.addSort({ name: 'updatedAt' })
		.addSort({ name: 'slug' })
		.addSort({ name: 'name' })
		.addSort({ name: 'description' })
		.addSort({ name: 'keywords' })
		.addCustomFieldSorts(this.customFields)
		.connectToRoute(this.route);

	constructor() {
		super()
		super.configure({
			document: GetCategoryListDocument,
			getItems: data => data.blogCategories,
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
