import { Collection, DeepPartial, HasCustomFields, Product, SoftDeletable, VendureEntity } from '@vendure/core'
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToOne, ManyToMany } from 'typeorm'
import { BlogPostStatus, BlogPostContentType } from '../types'
import { BlogAuthor } from './blog-author.entity'
import { BlogCategory } from './blog-category.entity'
import { BlogTag } from './blog-tag.entity'

export class BlogPostCustomFields {}

@Entity()
export class BlogPost extends VendureEntity implements HasCustomFields, SoftDeletable {
	constructor(input?: DeepPartial<BlogPost>) {
		super(input)
	}

	@Column({ type: Date, nullable: true })
   deletedAt: Date | null

   @Column('varchar', { default: 'draft' })
   status: BlogPostStatus

	@Index({ unique: true })
	@Column({ type: "varchar", nullable: false })
	slug: string

	@Column({ type: "varchar", nullable: false })
	title: string

	@Column({ type: "varchar", nullable: true })
	excerpt: string

	@Column({ type: "varchar", default: 'html' })
	contentType: BlogPostContentType

	@Column({ type: "text", nullable: true })
	content: string | null
	
	@Column({ type: "text", nullable: true })
	description: string | null

	@Column({ type: "text", nullable: true })
   keywords: string | null

	@Column({ type: "jsonb", nullable: true })
	metadata: Record<string, any> | null

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
}
