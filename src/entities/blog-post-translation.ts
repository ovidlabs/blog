import { LanguageCode } from '@vendure/common/lib/generated-types'
import { DeepPartial } from '@vendure/common/lib/shared-types'
import { HasCustomFields, Translation, VendureEntity } from '@vendure/core'
import { Column, Entity, Index, ManyToOne } from 'typeorm'

import { BlogPost } from './blog-post.entity'

export class BlogPostCustomFieldsTranslation {}

@Entity()
export class BlogPostTranslation extends VendureEntity implements Translation<BlogPost>, HasCustomFields {
	constructor(input?: DeepPartial<Translation<BlogPostTranslation>>) {
		super(input)
	}

	@Column('varchar') languageCode: LanguageCode

	@Index({ unique: true })
	@Column({ type: "varchar", nullable: false })
	slug: string

	@Column({ type: "varchar", nullable: false })
	title: string

	@Column({ type: "varchar", nullable: true })
	excerpt: string

	@Column({ type: "text", nullable: true })
	content: string

	@Column({ type: "text", nullable: true })
	description: string

	@Index()
	@ManyToOne(type => BlogPost, base => base.translations, { onDelete: 'CASCADE' })
	base: BlogPost

	@Column(type => BlogPostCustomFieldsTranslation)
	customFields: BlogPostCustomFieldsTranslation
}
