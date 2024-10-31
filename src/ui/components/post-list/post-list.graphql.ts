import { graphql } from '../../gql'

export const GET_POST_LIST = graphql(`
	query GetPostList($options: BlogPostListOptions) {
		blogPosts(options: $options) {
			items {
				...Post
			}
			totalItems
		}
	}
`)

export const DELETE_POST = graphql(`
	mutation DeleteBlogPost($id: ID!) {
		deleteBlogPost(id: $id) {
			result
		}
	}
`)