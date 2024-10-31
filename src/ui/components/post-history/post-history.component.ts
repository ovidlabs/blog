import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import {
	SharedModule,
	TimelineDisplayType
} from '@vendure/admin-ui/core'
import { BlogPost, GetPostHistoryQuery, HistoryEntryType } from '../../gql/graphql'

export type TimelineHistoryEntry = NonNullable<GetPostHistoryQuery['blogPostHistory']>['items'][number]

@Component({
	selector: 'post-history',
	templateUrl: './post-history.html',
	styleUrls: ['./post-history.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [SharedModule]
})
export class PostHistoryComponent {
	@Input() post: BlogPost
	@Input() history: TimelineHistoryEntry[]
	@Output() addNote = new EventEmitter<{ note: string }>()
	@Output() updateNote = new EventEmitter<TimelineHistoryEntry>()
	@Output() deleteNote = new EventEmitter<TimelineHistoryEntry>()
	note = ''
	expanded = false
	readonly type = HistoryEntryType

	getDisplayType(entry: TimelineHistoryEntry): TimelineDisplayType {
		if (entry.type === HistoryEntryType.BLOG_POST_PUBLISHED) {
			return 'success'
		}
		if (entry.type === HistoryEntryType.BLOG_POST_ARCHIVED) {
			return 'warning'
		}
		return 'default'
	}

	getTimelineIcon(entry: TimelineHistoryEntry) {
		if (entry.type === HistoryEntryType.BLOG_POST_PUBLISHED) {
			return 'airplane'
		}
		if (entry.type === HistoryEntryType.BLOG_POST_ARCHIVED) {
			return 'archive'
		}
		if (entry.type === HistoryEntryType.BLOG_POST_NOTE) {
			return 'note'
		}
		if (entry.type === HistoryEntryType.BLOG_POST_CREATED) {
			return 'asterisk'
		}
	}

	isFeatured(entry: TimelineHistoryEntry): boolean {
		switch (entry.type) {
			case HistoryEntryType.BLOG_POST_CREATED:
			case HistoryEntryType.BLOG_POST_PUBLISHED:
			case HistoryEntryType.BLOG_POST_ARCHIVED:
			case HistoryEntryType.BLOG_POST_NOTE:
				return true
			default:
				return false
		}
	}

	getName(entry: TimelineHistoryEntry): string {
		const { administrator } = entry;
		if (administrator) {
			return `${administrator.firstName} ${administrator.lastName}`
		}
		return ''
	}

	addNoteToBlogPost() {
		this.addNote.emit({ note: this.note })
		this.note = ''
	}
}
