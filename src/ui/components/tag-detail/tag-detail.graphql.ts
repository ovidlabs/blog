import { graphql } from '../../gql'

export const GET_TAG_DETAIL = graphql(`
	query GetTagDetail($id: ID!) {
		blogTag(id: $id) {
			...Tag
		}
	}
`)

export const CREATE_TAG = graphql(`
	mutation CreateTag($value: String!) {
		createBlogTag(value: $value) {
			...Tag
		}
	}
`)

export const UPDATE_TAG = graphql(`
	mutation UpdateTag($id: ID!, $value: String!) {
		updateBlogTag(id: $id, value: $value) {
			...Tag
		}
	}
`)

export const DELETE_TAG = graphql(`
	mutation DeleteTag($id: ID!) {
		deleteBlogTag(id: $id) {
			...on DeletionResponse {
				result
			}
		}
	}
`)