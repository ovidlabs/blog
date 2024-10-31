import { ResultOf } from '@graphql-typed-document-node/core'
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { EMPTY, Observable, Subject } from 'rxjs'
import { map, startWith, switchMap } from 'rxjs/operators'
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker'
import { TagInputModule } from 'ngx-chips'
import {
	getCustomFieldsDefaults,
	DataService,
	EditNoteDialogComponent,
	GetProductListDocument, 
	GetProductListQuery, 
	ItemOf,
	LanguageCode,
	ModalService,
	NotificationService,
	SharedModule,
	SortOrder,
	TimelineHistoryEntry,
	TypedBaseDetailComponent,
} from '@vendure/admin-ui/core'
import { normalizeString } from '@vendure/common/lib/normalize-string'
import { 
	AddPostNoteDocument,
	ArchivePostDocument,
	BlogPostContentType,
	BlogPostStatus,
	BlogTag,
	CreatePostDocument,
	DeletePostNoteDocument,
	GetAuthorListDocument,
	GetAuthorListQuery,
	GetCategoryListDocument,
	GetCategoryListQuery,
	GetPostDetailDocument,
	GetPostHistoryDocument,
	GetPostHistoryQuery,
	GetTagListDocument,
	PublishPostDocument,
	UpdatePostDocument,
	UpdatePostNoteDocument,
} from '../../gql/graphql'
import { PostStatusLabelComponent } from '../post-status-label/post-status-label.component'
import { PostHistoryComponent } from '../post-history/post-history.component'

@Component({
	selector: 'post-detail',
	templateUrl: './post-detail.html',
	styleUrls: ['./post-detail.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [
		PostHistoryComponent,
		PostStatusLabelComponent,
		SharedModule, 
		TagInputModule
	]
})
export class PostDetailComponent extends TypedBaseDetailComponent<typeof GetPostDetailDocument, 'blogPost'> implements OnInit, OnDestroy {
	private wordCount: number|null = null
	private minutesToRead: number|null = null

	// @ts-ignore
	customFields = this.getCustomFieldConfig('BlogPost')

	// @ts-ignore
	detailForm = this.formBuilder.group({
		title: ['', Validators.required],
		slug: ['', Validators.required],
		status: ['draft' as BlogPostStatus],
		excerpt: '',
		contentType: ['html' as BlogPostContentType],
		description: '',
		keywordsArray: [['']],
		authorId: '',
		categoryId: '',
		tags: [] as any[],
		products: [] as any[],
		// @ts-ignore
		customFields: this.formBuilder.group(getCustomFieldsDefaults(this.customFields))
	})

	status$: Observable<BlogPostStatus> // not handled via formDetail

	history$: Observable<NonNullable<GetPostHistoryQuery['blogPostHistory']>['items'] | undefined>
	fetchHistory = new Subject<void>()

	authors$: Observable<ItemOf<GetAuthorListQuery, 'blogAuthors'>[]>
	categories$: Observable<ItemOf<GetCategoryListQuery, 'blogCategories'>[]>
	products$: Observable<ItemOf<GetProductListQuery, 'products'>[]>
	tags$: Observable<BlogTag[]>


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

		if (!this.entity) this.detailForm.patchValue({ keywordsArray: [] }) // for some reason this is needed to prevent an empty tag when creating a new category

		if (this.entity && this.entity.content) {
			this.wordCount = this.entity.content.split(/\s+/).length
			this.minutesToRead = Math.ceil(this.wordCount / 200)
		}

		this.status$ = this.entity$.pipe(map(entity => entity.status as BlogPostStatus))

		this.history$ = this.fetchHistory.pipe(
			startWith(undefined),
			switchMap(() => this.dataService.query(GetPostHistoryDocument, { 
				id: this.id, 
				options: { sort: { createdAt: SortOrder.DESC } } 
			}).mapStream(data => data.blogPostHistory.items))
		)

		this.authors$ = this.dataService.query(GetAuthorListDocument, { options: {} }).mapSingle(data => data.blogAuthors.items)
		this.categories$ = this.dataService.query(GetCategoryListDocument, { options: {} }).mapSingle(data => data.blogCategories.items)
		this.products$ = this.dataService.query(GetProductListDocument, { options: {}}).mapSingle(data => data.products.items)
		this.tags$ = this.dataService.query(GetTagListDocument, { options: {} }).mapSingle(data => data.blogTags.items)
	}

	ngOnDestroy(): void {
		this.destroy()
	}

	create() {
		let { title, slug, status, excerpt, contentType, description, authorId, categoryId, tags, products, customFields } = this.detailForm.value
		if (!title || !slug) {
			this.notificationService.error('Post title and slug are required')
			return
		}
		this.dataService.mutate(CreatePostDocument, {
			input: { 
				title,
				slug,
				status,
				excerpt,
				contentType,
				description,
				authorId,
				categoryId,
				tagIds: tags.map(tag => tag.id),
				productIds: products.map(product => product.id),
				customFields
			},
		}).subscribe((result) => {
			this.fetchHistory.next()
			this.notificationService.success('Post created')
			this.detailForm.markAsPristine()
			this.router.navigate(['../', result.createBlogPost.id], { relativeTo: this.route })
		})
	}

	update() {
		let { title, slug, status, excerpt, contentType, description, authorId, categoryId, tags, products, customFields } = this.detailForm.value
		this.dataService.mutate(UpdatePostDocument, {
			input: { 
				id: this.id, 
				title,
				slug,
				status,
				excerpt,
				contentType,
				description,
				authorId,
				categoryId,
				tagIds: tags.map(tag => tag.id),
				productIds: products.map(product => product.id),
				customFields
			},
		}).subscribe(() => {
			this.fetchHistory.next()
			this.notificationService.success('Post updated')
			if (authorId) this.detailForm.get('authorId')?.setValue(authorId)
			if (categoryId) this.detailForm.get('categoryId')?.setValue(categoryId)
			this.detailForm.get('products')?.setValue(products)
			this.detailForm.get('tags')?.setValue(tags)
			this.detailForm.markAsPristine
		})
	}

	publish() {
		this.dataService.mutate(PublishPostDocument, { id: this.id })
			.subscribe(() => {
				this.fetchHistory.next()
				this.notificationService.success('Post published')
			})
	}

	archive() {
		this.dataService.mutate(ArchivePostDocument, { id: this.id })
			.subscribe(() => {
				this.fetchHistory.next()
				this.notificationService.success('Post archived')
			})
	}

	addNote(event: { note: string }) {
		const { note } = event
		this.dataService.mutate(AddPostNoteDocument, { id: this.id, note }).subscribe(() => {
			this.fetchHistory.next()
			this.notificationService.success('Note added')
		})

	}

	updateNote(entry: TimelineHistoryEntry) {
		this.modalService
			.fromComponent(EditNoteDialogComponent, {
				size: 'lg',
				closable: true,
				locals: {
					displayPrivacyControls: false,
					note: entry.data.note
				},
			})
			.pipe(
				switchMap(result => {
					if (result) {
						return this.dataService.mutate(UpdatePostNoteDocument, {
							id: entry.id,
							note: result.note,
						})
					} else {
						return EMPTY
					}
				}),
			)
			.subscribe(result => {
				this.fetchHistory.next()
				this.notificationService.success(_('common.notify-update-success'), {
					entity: 'Note'
				})
			})
	}

	deleteNote(entry: TimelineHistoryEntry) {
		return this.modalService
			.dialog({
				title: _('common.confirm-delete-note'),
				body: entry.data.note,
				buttons: [
					{ type: 'secondary', label: _('common.cancel') },
					{ type: 'danger', label: _('common.delete'), returnValue: true },
				],
			})
			.pipe(switchMap(res => (res ? this.dataService.mutate(DeletePostNoteDocument, { id: entry.id }) : EMPTY)))
			.subscribe(() => {
				this.fetchHistory.next();
				this.notificationService.success(_('common.notify-delete-success'), {
					entity: 'Note'
				})
			})
	}

	private displayNavigationModal(title?: string): Observable<string | undefined> {
		return this.modalService.dialog({
			title: title || _('common.confirm-navigation'),
			body: 'You have unsaved changes that will be lost.  Do you want to save now?',
			buttons: [
				{ type: 'secondary', label: _('common.cancel-navigation') },
				{ type: 'danger', label: _('common.discard-changes'), returnValue: 'discard' },
				{ type: 'primary', label: _('common.update'), returnValue: 'save' },
			],
		}).pipe(map(res => (res ? res : undefined)))
	}

	openEditor() {
		if (!this.detailForm.pristine) {
			this.displayNavigationModal('Open Content Editor').subscribe(res => {
				if (res === 'save') {
					this.update()
					this.router.navigate(['editor'], { relativeTo: this.route })
				}
			})
		} else {
			this.router.navigate(['editor'], { relativeTo: this.route })
		}
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

	protected setFormValues(entity: NonNullable<ResultOf<typeof GetPostDetailDocument>['blogPost']>, languageCode: LanguageCode): void {
		this.detailForm.patchValue({
			title: entity?.title,
			slug: entity?.slug,
			status: entity?.status,
			excerpt: entity?.excerpt,
			contentType: entity?.contentType,
			description: entity?.description,
			keywordsArray: entity?.keywords?.split(',')?.map(value => value.trim()) || [],
			authorId: entity?.author?.id,
			categoryId: entity?.category?.id,
			tags: entity?.tags as any[],
			products: entity?.products as any[],
		})
		if (this.customFields.length) {
			this.setCustomFieldFormValues(this.customFields, this.detailForm.get('customFields'), entity)
	  	}
	}
}
