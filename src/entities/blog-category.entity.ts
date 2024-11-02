import { DeepPartial, HasCustomFields, VendureEntity } from '@vendure/core'
import { Column, Entity, Index, OneToMany } from 'typeorm'
import { BlogPost } from './blog-post.entity'

export class BlogCategoryCustomFields {}

@Entity()
export class BlogCategory extends VendureEntity implements HasCustomFields {
	constructor(input?: DeepPartial<BlogCategory>) {
		super(input)
	}

	@Index({ unique: true })
   @Column({ type: "varchar", nullable: false })
   slug: string | null

   @Column({ type: "varchar", nullable: false })
   name: string

   @Column({ type: "text", nullable: true })
   description: string | null

   @OneToMany(type => BlogPost, post => post.category)
   posts: BlogPost[]

	@Column(type => BlogCategoryCustomFields)
	customFields: BlogCategoryCustomFields
}
