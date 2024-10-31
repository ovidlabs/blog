import { ResultOf } from '@graphql-typed-document-node/core'
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { TagInputModule } from 'ngx-chips'
import {
	getCustomFieldsDefaults,
	DataService,
	LanguageCode,
	ModalService,
	NotificationService,
	SharedModule,
	TypedBaseDetailComponent,
} from '@vendure/admin-ui/core'
import { 
	GetAuthorDetailDocument,
	CreateAuthorDocument,
	UpdateAuthorDocument
} from '../../gql/graphql'

@Component({
	selector: 'author-detail',
	templateUrl: './author-detail.html',
	styleUrls: ['./author-detail.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [SharedModule, TagInputModule],
})
export class AuthorDetailComponent extends TypedBaseDetailComponent<typeof GetAuthorDetailDocument, 'blogAuthor'> implements OnInit, OnDestroy {

	// @ts-ignore
	customFields = this.getCustomFieldConfig('BlogAuthor')

	// @ts-ignore
	detailForm = this.formBuilder.group({
		name: ['', Validators.required],
		bio: '',
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
		let { name, bio, customFields } = this.detailForm.value
		if (!name) {
			this.notificationService.error('Author name is required')
			return
		}
		this.dataService.mutate(CreateAuthorDocument, {
			input: { 
				name,
				bio,
				customFields
			},
		}).subscribe((result) => {
			this.notificationService.success('Author created')
			this.detailForm.markAsPristine()
			this.router.navigate(['../', result.createBlogAuthor.id], { relativeTo: this.route })
		})
	}

	update() {
		let { name, bio, customFields } = this.detailForm.value
		this.dataService.mutate(UpdateAuthorDocument, {
			input: { 
				id: this.id, 
				name,
				bio,
				customFields
			},
		}).subscribe(() => {
			this.notificationService.success('Author updated')
		})
	}

	canDeactivate(): boolean {
		return super.canDeactivate()
	}

	protected setFormValues(entity: NonNullable<ResultOf<typeof GetAuthorDetailDocument>['blogAuthor']>, languageCode: LanguageCode): void {
		this.detailForm.patchValue({
			name: entity?.name,
			bio: entity?.bio
		})
		if (this.customFields.length) {
			this.setCustomFieldFormValues(this.customFields, this.detailForm.get('customFields'), entity)
	  	}
	}
}
