import { graphql } from '../../gql'

export const GET_CATEGORY_LIST = graphql(`
	query GetCategoryList($options: BlogCategoryListOptions) {
		blogCategories(options: $options) {
			items {
				...Category
			}
			totalItems
		}
	}
`)

export const DELETE_CATEGORY = graphql(`
	mutation DeleteBlogCategory($id: ID!) {
		deleteBlogCategory(id: $id) {
			result
		}
	}
`)