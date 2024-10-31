import { DeepPartial, HasCustomFields, VendureEntity } from '@vendure/core'
import { Column, Entity } from 'typeorm'

export class BlogTagCustomFields {}

@Entity()
export class BlogTag extends VendureEntity implements HasCustomFields {
	constructor(input?: DeepPartial<BlogTag>) {
		super(input)
	}

	@Column({ type: "varchar", nullable: false })
	value: string

	@Column(type => BlogTagCustomFields)
	customFields: BlogTagCustomFields
}
