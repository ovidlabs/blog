import gql from 'graphql-tag'

export const AUTHOR_FRAGMENT = gql`
	fragment Author on BlogAuthor {
		id
		createdAt
		updatedAt
		name
		bio
	}
`

export const CATEGORY_FRAGMENT = gql`
	fragment Category on BlogCategory {
		id
		createdAt
		updatedAt
		slug
		name
		description
		keywords
		metadata
	}
`

export const POST_FRAGMENT = gql`
	fragment Post on BlogPost {
		id
		createdAt
		updatedAt
		status
		slug
		title
		excerpt
		contentType
		content
		description
		keywords
		metadata
		author {
			id
			name
		}
		category {
			id
			name
		}
		tags {
			id
			value
		}
		products {
			id
			name
		}
	}
`

export const TAG_FRAGMENT = gql`
	fragment Tag on BlogTag {
		id
		createdAt
		updatedAt
		value
	}
`
