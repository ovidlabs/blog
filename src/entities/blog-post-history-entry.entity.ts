import { ChildEntity, Index, ManyToOne } from 'typeorm'
import { DeepPartial } from '@vendure/core'
import { HistoryEntry } from '@vendure/core/dist/entity/history-entry/history-entry.entity'
import { BlogPost } from './blog-post.entity'

@ChildEntity()
export class BlogPostHistoryEntry extends HistoryEntry {
	constructor(input: DeepPartial<BlogPostHistoryEntry>) {
		super(input)
	}

	@Index()
	@ManyToOne(type => BlogPost, { onDelete: 'CASCADE' })
	blogPost: BlogPost
}