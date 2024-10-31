import { graphql } from '../../gql'

export const GET_CATEGORY_DETAIL = graphql(`
	query GetCategoryDetail($id: ID!) {
		blogCategory(id: $id) {
			...Category
		}
	}
`)

export const CREATE_CATEGORY = graphql(`
	mutation CreateCategory($input: CreateBlogCategoryInput!) {
		createBlogCategory(input: $input) {
			...Category
		}
	}
`)

export const UPDATE_CATEGORY = graphql(`
	mutation UpdateCategory($input: UpdateBlogCategoryInput!) {
		updateBlogCategory(input: $input) {
			...Category
		}
	}
`)