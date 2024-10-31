import { graphql } from '../../gql'

export const GET_POST_DETAIL = graphql(`
	query GetPostDetail($id: ID!) {
		blogPost(id: $id) {
			...Post
		}
	}
`)

export const GET_POST_HISTORY = graphql(`
	query GetPostHistory($id: ID!, $options: HistoryEntryListOptions) {
		blogPostHistory(id: $id, options: $options) {
			totalItems
			items {
				id
				type
				createdAt
				isPublic
				administrator {
					id
					firstName
					lastName
				}
				data
			}
		}
	}
`)

export const CREATE_POST = graphql(`
	mutation CreatePost($input: CreateBlogPostInput!) {
		createBlogPost(input: $input) {
			...Post
		}
	}
`)

export const UPDATE_POST = graphql(`
	mutation UpdatePost($input: UpdateBlogPostInput!) {
		updateBlogPost(input: $input) {
			...Post
		}
	}
`)

export const PUBLISH_POST = graphql(`
	mutation PublishPost($id: ID!) {
		publishBlogPost(id: $id) {
			...Post
		}
	}
`)

export const ARCHIVE_POST = graphql(`
	mutation ArchivePost($id: ID!) {
		archiveBlogPost(id: $id) {
			...Post
		}
	}
`)

export const ADD_POST_NOTE = graphql(`
	mutation AddPostNote($id: ID!, $note: String!) {
		addBlogPostNote(id: $id, note: $note) {
			id
			type
			createdAt
			isPublic
			administrator {
				id
				firstName
				lastName
			}
			data
		}
	}
`)

export const UPDATE_POST_NOTE = graphql(`
	mutation UpdatePostNote($id: ID!, $note: String!) {
		updateBlogPostNote(id: $id, note: $note) {
			id
			type
			createdAt
			isPublic
			administrator {
				id
				firstName
				lastName
			}
			data
		}
	}
`)

export const DELETE_POST_NOTE = graphql(`
	mutation DeletePostNote($id: ID!) {
		deleteBlogPostNote(id: $id)
	}
`)

