import { graphql } from '../../gql'

export const GET_TAG_LIST = graphql(`
	query GetTagList($options: BlogTagListOptions) {
		blogTags(options: $options) {
			items {
				...Tag
			}
			totalItems
		}
	}
`)

export const DELETE_TAG = graphql(`
	mutation DeleteBlogTag($id: ID!) {
		deleteBlogTag(id: $id) {
			result
		}
	}
`)