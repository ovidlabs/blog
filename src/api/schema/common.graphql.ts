import gql from 'graphql-tag'

export const commonApiExtensions = gql`

	enum BlogPostStatus { 
		draft
		published
		archived
	}

	enum BlogPostContentType {
		html
		markdown
	}

	type BlogAuthor implements Node {
		id: ID!
		name: String!
		bio: String
		posts: [BlogPost]
	}

	type BlogCategory implements Node {
		id: ID!
		slug: String!
		name: String!
		description: String
		keywords: String
		metadata: JSON
		posts: [BlogPost]
	}

	type BlogPost implements Node {
		id: ID!
		updatedAt: DateTime!
		status: BlogPostStatus
		slug: String!
		title: String!
		excerpt: String
		contentType: BlogPostContentType
		content: String
		description: String
		keywords: String
		metadata: JSON
		author: BlogAuthor
		category: BlogCategory
		products: [Product]
		tags: [BlogTag]
	}

	type BlogTag implements Node {
		id: ID!
		value: String!
	}

	type BlogAuthorList implements PaginatedList {
		items: [BlogAuthor!]!
		totalItems: Int!
	}

	type BlogCategoryList implements PaginatedList {
		items: [BlogCategory!]!
		totalItems: Int!
	}

	type BlogPostList implements PaginatedList {
		items: [BlogPost!]!
		totalItems: Int!
	}

	type BlogTagList implements PaginatedList {
		items: [BlogTag!]!
		totalItems: Int!
	}

	# Generated at run-time by Vendure
	input BlogAuthorListOptions
	input BlogCategoryListOptions
	input BlogPostListOptions
	input BlogTagListOptions

	# Auto-generated at runtime
	input BlogAuthorFilterParameter

	# Auto-generated at runtime
	input BlogAuthorSortParameter

	# Auto-generated at runtime
	input BlogCategoryFilterParameter

	# Auto-generated at runtime
	input BlogCategorySortParameter

	# Auto-generated at runtime
	input BlogPostFilterParameter {
		authorName: StringOperators
		categoryName: StringOperators
	}

	# Auto-generated at runtime
	input BlogPostSortParameter {
		status: SortOrder
		contentType: SortOrder
		authorName: SortOrder
		categoryName: SortOrder
	}

	# Auto-generated at runtime
	input BlogTagFilterParameter

	# Auto-generated at runtime
	input BlogTagSortParameter

	extend type Query {
		blogAuthor(id: ID!): BlogAuthor
		blogAuthors(options: BlogAuthorListOptions): BlogAuthorList!
		blogCategory(id: ID, slug: String): BlogCategory
		blogCategories(options: BlogCategoryListOptions): BlogCategoryList!
		blogPost(id: ID, slug: String): BlogPost
		blogPosts(options: BlogPostListOptions, tagIds: [String!]): BlogPostList!
		blogTag(id: ID!): BlogTag
		blogTags(options: BlogTagListOptions): BlogTagList!
	}

	extend type Product {
		posts(options: BlogPostListOptions): BlogPostList!
	}
`
