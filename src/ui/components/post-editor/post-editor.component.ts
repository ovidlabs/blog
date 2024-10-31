import { ResultOf } from '@graphql-typed-document-node/core'
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { BehaviorSubject, Subscription } from 'rxjs'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { CodeEditor } from '@acrodata/code-editor'
import {
	DataService,
	LanguageCode,
	NotificationService,
	SharedModule,
	TypedBaseDetailComponent
} from '@vendure/admin-ui/core'
import { 
	GetPostDetailDocument,
	UpdatePostDocument
} from '../../gql/graphql'

@Component({
	selector: 'post-editor',
	templateUrl: './post-editor.html',
	styleUrls: ['./post-editor.scss'],
	// changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [SharedModule, CodeEditor],
})
export class PostEditorComponent extends TypedBaseDetailComponent<typeof GetPostDetailDocument, 'blogPost'> implements OnInit, OnDestroy {

	// @ts-ignore
	detailForm = this.formBuilder.group({
		content: ['', Validators.required],
	})

	contentType: string = 'html'
	// content$: Observable<String> // needed for preview
	content$: BehaviorSubject<string | undefined>
	contentSubscription: Subscription

	constructor(
		protected dataService: DataService, 
		private formBuilder: FormBuilder,
		private notificationService: NotificationService,
	) {
		super()
	}

	ngOnInit() {
		this.init()
		this.contentType = this.entity?.contentType || 'html'
		this.content$ = new BehaviorSubject<string | undefined>(this.entity?.content || '')
		this.contentSubscription = this.detailForm.valueChanges.subscribe(values => {
			this.content$.next(values.content || '')
		})

		if (this.entity) this.setFormValues(this.entity, this.languageCode)
	}

	ngOnDestroy() {
	}

	update() {
		let { content } = this.detailForm.value
		if (!content) return
		this.dataService.mutate(UpdatePostDocument, {
			input: { 
				id: this.id, 
				content: DOMPurify.sanitize(content),
			},
		}).subscribe(() => {
			this.notificationService.success('Post updated')
		})
	}

	sanitize(content: string): string {
		if (this.contentType === 'html') {
			return DOMPurify.sanitize(content)
		} else {
			// convert markdown to html
			return DOMPurify.sanitize(marked.parse(content) as string)
		}
	}

	protected setFormValues(entity: NonNullable<ResultOf<typeof GetPostDetailDocument>['blogPost']>, languageCode: LanguageCode): void {
		this.detailForm.patchValue({
			content: entity.content,
		})
	}
}
