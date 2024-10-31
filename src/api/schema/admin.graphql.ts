import gql from 'graphql-tag'
import { commonApiExtensions } from './common.graphql'

export const adminApiExtensions = gql`
	${commonApiExtensions}

	extend enum HistoryEntryType {
      BLOG_POST_CREATED,
		BLOG_POST_UPDATED,
		BLOG_POST_DELETED,
		BLOG_POST_PUBLISHED,
		BLOG_POST_ARCHIVED,
		BLOG_POST_NOTE
   }

	extend type BlogAuthor implements Node {
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	extend type BlogCategory implements Node {
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	extend type BlogPost implements Node {
		createdAt: DateTime!
		deletedAt: DateTime!
	}

	extend type BlogTag implements Node {
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	input CreateBlogAuthorInput {
		name: String!
		bio: String
	}

	input UpdateBlogAuthorInput {
		id: ID!
		name: String
		bio: String
	}

	input CreateBlogCategoryInput {
		slug: String!
		name: String!
		description: String
		keywords: String
		metadata: JSON
	}

	input UpdateBlogCategoryInput {
		id: ID!
		slug: String
		name: String
		description: String
		keywords: String
		metadata: JSON
	}

	input CreateBlogPostInput {
		status: BlogPostStatus
		slug: String!
		title: String!
		excerpt: String
		contentType: BlogPostContentType
		content: String
		description: String
		keywords: String
		metadata: JSON
		authorId: ID
		categoryId: ID
		productIds: [ID]
		tagIds: [ID]
	}

	input UpdateBlogPostInput {
		id: ID!
		status: BlogPostStatus
		slug: String
		title: String
		excerpt: String
		contentType: BlogPostContentType
		content: String
		description: String
		keywords: String
		metadata: JSON
		authorId: ID
		categoryId: ID
		productIds: [ID]
		tagIds: [ID]
	}

	input CreateBlogTagInput {
		value: String!
	}

	input UpdateBlogTagInput {
		id: ID!
		value: String
	}

	extend type Query {
		blogPostHistory(id: ID!, options: HistoryEntryListOptions): HistoryEntryList!
	}

	extend type Mutation {
		createBlogAuthor(input: CreateBlogAuthorInput!): BlogAuthor!
		updateBlogAuthor(input: UpdateBlogAuthorInput!): BlogAuthor!
		deleteBlogAuthor(id: ID!): DeletionResponse!
		createBlogCategory(input: CreateBlogCategoryInput!): BlogCategory!
		updateBlogCategory(input: UpdateBlogCategoryInput!): BlogCategory!
		deleteBlogCategory(id: ID!): DeletionResponse!
		createBlogPost(input: CreateBlogPostInput!): BlogPost!
		updateBlogPost(input: UpdateBlogPostInput!): BlogPost!
		deleteBlogPost(id: ID!): DeletionResponse!
		publishBlogPost(id: ID!): BlogPost!
		archiveBlogPost(id: ID!): BlogPost!
		addBlogPostNote(id: ID!, note: String!): HistoryEntry!
		updateBlogPostNote(id: ID!, note: String!): HistoryEntry!
		deleteBlogPostNote(id: ID!): Boolean
		createBlogTag(value: String!): BlogTag!
		updateBlogTag(id: ID!, value: String!): BlogTag!
		deleteBlogTag(id: ID!): DeletionResponse!
		addBlogTag(id: ID!, tagId: ID!): Boolean
		removeBlogTag(id: ID!, tagId: ID!): Boolean
		addBlogProductTag(id: ID!, productId: ID!): Boolean
		removeBlogProductTag(id: ID!, productId: ID!): Boolean
	}
`