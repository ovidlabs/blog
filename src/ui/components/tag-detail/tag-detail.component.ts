import { ResultOf } from '@graphql-typed-document-node/core'
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { TagInputModule } from 'ngx-chips'
import {
	getCustomFieldsDefaults,
	DataService,
	LanguageCode,
	NotificationService,
	SharedModule,
	TypedBaseDetailComponent
} from '@vendure/admin-ui/core'
import { 
	GetTagDetailDocument,
	CreateTagDocument,
	UpdateTagDocument
} from '../../gql/graphql'

@Component({
	selector: 'post-tag-detail',
	templateUrl: './tag-detail.html',
	styleUrls: ['./tag-detail.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [SharedModule, TagInputModule],
})
export class PostTagDetailComponent extends TypedBaseDetailComponent<typeof GetTagDetailDocument, 'blogTag'> implements OnInit, OnDestroy {

	// @ts-ignore
	customFields = this.getCustomFieldConfig('BlogTag')

	// @ts-ignore
	detailForm = this.formBuilder.group({
		value: ['', Validators.required],
		// @ts-ignore
		customFields: this.formBuilder.group(getCustomFieldsDefaults(this.customFields))
	})

	constructor(
		protected dataService: DataService, 
		private formBuilder: FormBuilder, 
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
		let { value, customFields } = this.detailForm.value
		if (!value) {
			this.notificationService.error('Tag value is required')
			return
		}
		this.dataService.mutate(CreateTagDocument, { value, customFields }).subscribe((result) => {
			this.notificationService.success('Tag created')
			this.detailForm.markAsPristine()
			this.router.navigate(['../', result.createBlogTag.id], { relativeTo: this.route })
		})
	}

	update() {
		let { value, customFields } = this.detailForm.value
		if (!value) {
			this.notificationService.error('Tag value is required')
			return
		}
		this.dataService.mutate(UpdateTagDocument, { id: this.id, value, customFields }).subscribe(() => {
			this.notificationService.success('Tag updated')
		})
	}

	canDeactivate(): boolean {
		return super.canDeactivate()
	}

	protected setFormValues(entity: NonNullable<ResultOf<typeof GetTagDetailDocument>['blogTag']>, languageCode: LanguageCode): void {
		this.detailForm.patchValue({
			value: entity?.value
		})
		if (this.customFields.length) {
			this.setCustomFieldFormValues(this.customFields, this.detailForm.get('customFields'), entity)
	  	}
	}
}
