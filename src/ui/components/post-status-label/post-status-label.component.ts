import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { SharedModule } from '@vendure/admin-ui/core'

export type PostStatus = 'published' | 'draft' | 'archived'

@Component({
    selector: 'post-status-label',
    templateUrl: './post-status-label.html',
    styleUrls: ['./post-status-label.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [SharedModule],
})
export class PostStatusLabelComponent {
    @Input() status: PostStatus

    getIcon(status: PostStatus) {
        switch (status) {
            case 'draft':
                return 'exclamation-circle';
            case 'published':
                return 'check-circle';
				case 'archived':
					return 'times-circle';
        }
    }
}
