import { graphql } from '../../gql'

export const GET_AUTHOR_DETAIL = graphql(`
	query GetAuthorDetail($id: ID!) {
		blogAuthor(id: $id) {
			...Author
		}
	}
`)

export const CREATE_AUTHOR = graphql(`
	mutation CreateAuthor($input: CreateBlogAuthorInput!) {
		createBlogAuthor(input: $input) {
			...Author
		}
	}
`)

export const UPDATE_AUTHOR = graphql(`
	mutation UpdateAuthor($input: UpdateBlogAuthorInput!) {
		updateBlogAuthor(input: $input) {
			...Author
		}
	}
`)