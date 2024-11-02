import { 
	Collection, 
	DeepPartial, 
	HasCustomFields, 
	LocaleString,
	Product, 
	SoftDeletable, 
	Translatable,
	Translation,
	VendureEntity 
} from '@vendure/core'
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToOne, ManyToMany, OneToMany } from 'typeorm'
import { BlogPostStatus, BlogPostContentType } from '../types'
import { BlogPostTranslation } from './blog-post-translation'
import { BlogAuthor } from './blog-author.entity'
import { BlogCategory } from './blog-category.entity'
import { BlogTag } from './blog-tag.entity'

export class BlogPostCustomFields {}

@Entity()
export class BlogPost extends VendureEntity implements HasCustomFields, SoftDeletable, Translatable {
	constructor(input?: DeepPartial<BlogPost>) {
		super(input)
	}

	@Column({ type: Date, nullable: true })
   deletedAt: Date | null

   @Column('varchar', { default: 'draft' })
   status: BlogPostStatus

	@Column({ type: "varchar", default: 'html' })
	contentType: BlogPostContentType

	// translatable fields
	slug: LocaleString
	title: LocaleString
	excerpt: LocaleString
	content: LocaleString
	description: LocaleString

	@ManyToOne(() => BlogAuthor)
	@JoinColumn({ name: "author_id" })
	author: BlogAuthor
	
	@ManyToOne(() => BlogCategory)
	@JoinColumn({ name: "category_id" })
	category: BlogCategory

	@ManyToMany(() => BlogTag)
	@JoinTable({
		name: "blog_tags",
		joinColumn: {
			name: "post_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "tag_id",
			referencedColumnName: "id",
		},
	})
	tags: BlogTag[]
	
	@ManyToMany(() => Product)
	@JoinTable({
		name: "blog_product_tags",
		joinColumn: {
			name: "post_id",
			referencedColumnName: "id",
		},
		inverseJoinColumn: {
			name: "product_id",
			referencedColumnName: "id",
		},
	})
	products: Product[]

	@Column(type => BlogPostCustomFields)
	customFields: BlogPostCustomFields

	@OneToMany(type => BlogPostTranslation, translation => translation.base, { eager: true })
	translations: Array<Translation<BlogPost>>
}
