import { graphql } from '../../gql'

export const GET_AUTHOR_LIST = graphql(`
	query GetAuthorList($options: BlogAuthorListOptions) {
		blogAuthors(options: $options) {
			items {
				...Author
			}
			totalItems
		}
	}
`)

export const DELETE_AUTHOR = graphql(`
	mutation DeleteBlogAuthor($id: ID!) {
		deleteBlogAuthor(id: $id) {
			result
		}
	}
`)