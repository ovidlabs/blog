import { DeepPartial, HasCustomFields, VendureEntity } from '@vendure/core'
import { Column, Entity, OneToMany } from 'typeorm'
import { BlogPost } from './blog-post.entity'

export class BlogAuthorCustomFields {}

@Entity()
export class BlogAuthor extends VendureEntity implements HasCustomFields {
	constructor(input?: DeepPartial<BlogAuthor>) {
		super(input)
	}

	@Column({ type: "varchar", nullable: false })
	name: string

	@Column({ type: "varchar", nullable: true })
	bio: string

   @OneToMany(type => BlogPost, post => post.author)
   posts: BlogPost[]

	@Column(type => BlogAuthorCustomFields)
	customFields: BlogAuthorCustomFields
}
