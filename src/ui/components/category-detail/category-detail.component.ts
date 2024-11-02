import { ResultOf } from '@graphql-typed-document-node/core'
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import {
	getCustomFieldsDefaults,
	DataService,
	LanguageCode,
	ModalService,
	NotificationService,
	SharedModule,
	TypedBaseDetailComponent,
} from '@vendure/admin-ui/core'
import { normalizeString } from '@vendure/common/lib/normalize-string'
import { 
	GetCategoryDetailDocument,
	CreateCategoryDocument,
	UpdateCategoryDocument
} from '../../gql/graphql'

@Component({
	selector: 'category-detail',
	templateUrl: './category-detail.html',
	styleUrls: ['./category-detail.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [SharedModule],
})
export class CategoryDetailComponent extends TypedBaseDetailComponent<typeof GetCategoryDetailDocument, 'blogCategory'> implements OnInit, OnDestroy {

	// @ts-ignore
	customFields = this.getCustomFieldConfig('BlogCategory')

	// @ts-ignore
	detailForm = this.formBuilder.group({
		slug: ['', Validators.required],
		name: ['', Validators.required],
		description: '',
		// @ts-ignore
		customFields: this.formBuilder.group(getCustomFieldsDefaults(this.customFields))
	})

	constructor(
		protected dataService: DataService, 
		private formBuilder: FormBuilder, 
		private modalService: ModalService,
		private notificationService: NotificationService,
	) {
		super()
	}

	ngOnInit(): void {
		this.init()
	}

	ngOnDestroy(): void {
		this.destroy()
	}

	create() {
		let { slug, name, description, customFields } = this.detailForm.value
		if (!slug || !name) {
			this.notificationService.error('Category name and slug are required')
			return
		}
		this.dataService.mutate(CreateCategoryDocument, {
			input: { 
				slug,
				name,
				description,
				customFields
			},
		}).subscribe((result) => {
			this.notificationService.success('Category created')
			this.detailForm.markAsPristine()
			this.router.navigate(['../', result.createBlogCategory.id], { relativeTo: this.route })
		})
	}

	update() {
		let { slug, name, description, customFields } = this.detailForm.value
		this.dataService.mutate(UpdateCategoryDocument, {
			input: { 
				id: this.id, 
				slug,
				name,
				description,
				customFields
			},
		}).subscribe(() => {
			this.notificationService.success('Category updated')
		})
	}

	updateSlug(nameValue: string) {
		const slugInput = this.detailForm.get(['slug'])
		if (slugInput && slugInput.pristine && !this.entity?.slug) {
			slugInput.setValue(normalizeString(`${nameValue}`, '-'));
		}
  	}

	canDeactivate(): boolean {
		return super.canDeactivate()
	}

	protected setFormValues(entity: NonNullable<ResultOf<typeof GetCategoryDetailDocument>['blogCategory']>, languageCode: LanguageCode): void {
		this.detailForm.patchValue({
			slug: entity?.slug,
			name: entity?.name,
			description: entity?.description,
		})
		if (this.customFields.length) {
			this.setCustomFieldFormValues(this.customFields, this.detailForm.get('customFields'), entity)
	  	}
	}
}
