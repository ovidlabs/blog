import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewChild
} from '@angular/core'
import {
	DataService,
	Dialog,
	ItemOf, 
	SharedModule
} from '@vendure/admin-ui/core'
import { Observable } from 'rxjs'
import { NgSelectComponent } from '@ng-select/ng-select'
import { 
	GetPostListDocument,
	GetPostListQuery
} from '../../gql/graphql'

@Component({
	selector: 'post-selector-dialog',
	template: `
		<ng-template vdrDialogTitle>Select Posts</ng-template>
		<p class="mb-2"><b>Warning: </b>This action will replace any existing related posts for the selected products.</p>
		<ng-select [items]="items$ | async"
			appendTo="body" 
			[multiple]="true" 
			[hideSelected]="true"
			bindLabel="title"
			bindValue="id"
			[(ngModel)]="editedIds">
		</ng-select>
		<ng-template vdrDialogButtons>
			<button type="button" class="btn" (click)="cancel()">{{ 'common.cancel' | translate }}</button>
			<button type="button" (click)="save()" [disabled]="editedIds === productIds" class="btn btn-primary">Save</button>
		</ng-template>
	`,
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [SharedModule],
})
export class PostSelectorDialogComponent implements Dialog<string>, OnInit, AfterViewInit {
	@ViewChild(NgSelectComponent) private ngSelect: NgSelectComponent
	resolveWith: (result?: string) => void
	items$: Observable<ItemOf<GetPostListQuery, 'blogPosts'>[]>
	editedIds: string[] = []

	constructor(private dataService: DataService) {}

	ngOnInit(): void {
		this.items$ = this.dataService.query(GetPostListDocument, { options: {}}).mapSingle(data => data.blogPosts.items)
	}

	ngAfterViewInit() {
		setTimeout(() => this.ngSelect.focus(), 0)
	}

	save() {
		const postIdsAsString = this.editedIds.join(',')
		this.resolveWith(postIdsAsString)
	}

	cancel() {
		this.resolveWith()
	}
}