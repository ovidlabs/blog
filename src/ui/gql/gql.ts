/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n\tquery GetAuthorDetail($id: ID!) {\n\t\tblogAuthor(id: $id) {\n\t\t\t...Author\n\t\t}\n\t}\n": types.GetAuthorDetailDocument,
    "\n\tmutation CreateAuthor($input: CreateBlogAuthorInput!) {\n\t\tcreateBlogAuthor(input: $input) {\n\t\t\t...Author\n\t\t}\n\t}\n": types.CreateAuthorDocument,
    "\n\tmutation UpdateAuthor($input: UpdateBlogAuthorInput!) {\n\t\tupdateBlogAuthor(input: $input) {\n\t\t\t...Author\n\t\t}\n\t}\n": types.UpdateAuthorDocument,
    "\n\tquery GetAuthorList($options: BlogAuthorListOptions) {\n\t\tblogAuthors(options: $options) {\n\t\t\titems {\n\t\t\t\t...Author\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n": types.GetAuthorListDocument,
    "\n\tmutation DeleteBlogAuthor($id: ID!) {\n\t\tdeleteBlogAuthor(id: $id) {\n\t\t\tresult\n\t\t}\n\t}\n": types.DeleteBlogAuthorDocument,
    "\n\tquery GetCategoryDetail($id: ID!) {\n\t\tblogCategory(id: $id) {\n\t\t\t...Category\n\t\t}\n\t}\n": types.GetCategoryDetailDocument,
    "\n\tmutation CreateCategory($input: CreateBlogCategoryInput!) {\n\t\tcreateBlogCategory(input: $input) {\n\t\t\t...Category\n\t\t}\n\t}\n": types.CreateCategoryDocument,
    "\n\tmutation UpdateCategory($input: UpdateBlogCategoryInput!) {\n\t\tupdateBlogCategory(input: $input) {\n\t\t\t...Category\n\t\t}\n\t}\n": types.UpdateCategoryDocument,
    "\n\tquery GetCategoryList($options: BlogCategoryListOptions) {\n\t\tblogCategories(options: $options) {\n\t\t\titems {\n\t\t\t\t...Category\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n": types.GetCategoryListDocument,
    "\n\tmutation DeleteBlogCategory($id: ID!) {\n\t\tdeleteBlogCategory(id: $id) {\n\t\t\tresult\n\t\t}\n\t}\n": types.DeleteBlogCategoryDocument,
    "\n\tquery GetPostDetail($id: ID!) {\n\t\tblogPost(id: $id) {\n\t\t\t...Post\n\t\t}\n\t}\n": types.GetPostDetailDocument,
    "\n\tquery GetPostHistory($id: ID!, $options: HistoryEntryListOptions) {\n\t\tblogPostHistory(id: $id, options: $options) {\n\t\t\ttotalItems\n\t\t\titems {\n\t\t\t\tid\n\t\t\t\ttype\n\t\t\t\tcreatedAt\n\t\t\t\tisPublic\n\t\t\t\tadministrator {\n\t\t\t\t\tid\n\t\t\t\t\tfirstName\n\t\t\t\t\tlastName\n\t\t\t\t}\n\t\t\t\tdata\n\t\t\t}\n\t\t}\n\t}\n": types.GetPostHistoryDocument,
    "\n\tmutation CreatePost($input: CreateBlogPostInput!) {\n\t\tcreateBlogPost(input: $input) {\n\t\t\t...Post\n\t\t}\n\t}\n": types.CreatePostDocument,
    "\n\tmutation UpdatePost($input: UpdateBlogPostInput!) {\n\t\tupdateBlogPost(input: $input) {\n\t\t\t...Post\n\t\t}\n\t}\n": types.UpdatePostDocument,
    "\n\tmutation PublishPost($id: ID!) {\n\t\tpublishBlogPost(id: $id) {\n\t\t\t...Post\n\t\t}\n\t}\n": types.PublishPostDocument,
    "\n\tmutation ArchivePost($id: ID!) {\n\t\tarchiveBlogPost(id: $id) {\n\t\t\t...Post\n\t\t}\n\t}\n": types.ArchivePostDocument,
    "\n\tmutation AddPostNote($id: ID!, $note: String!) {\n\t\taddBlogPostNote(id: $id, note: $note) {\n\t\t\tid\n\t\t\ttype\n\t\t\tcreatedAt\n\t\t\tisPublic\n\t\t\tadministrator {\n\t\t\t\tid\n\t\t\t\tfirstName\n\t\t\t\tlastName\n\t\t\t}\n\t\t\tdata\n\t\t}\n\t}\n": types.AddPostNoteDocument,
    "\n\tmutation UpdatePostNote($id: ID!, $note: String!) {\n\t\tupdateBlogPostNote(id: $id, note: $note) {\n\t\t\tid\n\t\t\ttype\n\t\t\tcreatedAt\n\t\t\tisPublic\n\t\t\tadministrator {\n\t\t\t\tid\n\t\t\t\tfirstName\n\t\t\t\tlastName\n\t\t\t}\n\t\t\tdata\n\t\t}\n\t}\n": types.UpdatePostNoteDocument,
    "\n\tmutation DeletePostNote($id: ID!) {\n\t\tdeleteBlogPostNote(id: $id)\n\t}\n": types.DeletePostNoteDocument,
    "\n\tquery GetPostList($options: BlogPostListOptions) {\n\t\tblogPosts(options: $options) {\n\t\t\titems {\n\t\t\t\t...Post\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n": types.GetPostListDocument,
    "\n\tmutation DeleteBlogPost($id: ID!) {\n\t\tdeleteBlogPost(id: $id) {\n\t\t\tresult\n\t\t}\n\t}\n": types.DeleteBlogPostDocument,
    "\n\tquery GetTagDetail($id: ID!) {\n\t\tblogTag(id: $id) {\n\t\t\t...Tag\n\t\t}\n\t}\n": types.GetTagDetailDocument,
    "\n\tmutation CreateTag($value: String!) {\n\t\tcreateBlogTag(value: $value) {\n\t\t\t...Tag\n\t\t}\n\t}\n": types.CreateTagDocument,
    "\n\tmutation UpdateTag($id: ID!, $value: String!) {\n\t\tupdateBlogTag(id: $id, value: $value) {\n\t\t\t...Tag\n\t\t}\n\t}\n": types.UpdateTagDocument,
    "\n\tmutation DeleteTag($id: ID!) {\n\t\tdeleteBlogTag(id: $id) {\n\t\t\t...on DeletionResponse {\n\t\t\t\tresult\n\t\t\t}\n\t\t}\n\t}\n": types.DeleteTagDocument,
    "\n\tquery GetTagList($options: BlogTagListOptions) {\n\t\tblogTags(options: $options) {\n\t\t\titems {\n\t\t\t\t...Tag\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n": types.GetTagListDocument,
    "\n\tmutation DeleteBlogTag($id: ID!) {\n\t\tdeleteBlogTag(id: $id) {\n\t\t\tresult\n\t\t}\n\t}\n": types.DeleteBlogTagDocument,
    "\n\tfragment Author on BlogAuthor {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tname\n\t\tbio\n\t}\n": types.AuthorFragmentDoc,
    "\n\tfragment Category on BlogCategory {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tslug\n\t\tname\n\t\tdescription\n\t\tkeywords\n\t\tmetadata\n\t}\n": types.CategoryFragmentDoc,
    "\n\tfragment Post on BlogPost {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tstatus\n\t\tslug\n\t\ttitle\n\t\texcerpt\n\t\tcontentType\n\t\tcontent\n\t\tdescription\n\t\tkeywords\n\t\tmetadata\n\t\tauthor {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t\tcategory {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t\ttags {\n\t\t\tid\n\t\t\tvalue\n\t\t}\n\t\tproducts {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t}\n": types.PostFragmentDoc,
    "\n\tfragment Tag on BlogTag {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tvalue\n\t}\n": types.TagFragmentDoc,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery GetAuthorDetail($id: ID!) {\n\t\tblogAuthor(id: $id) {\n\t\t\t...Author\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetAuthorDetail($id: ID!) {\n\t\tblogAuthor(id: $id) {\n\t\t\t...Author\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation CreateAuthor($input: CreateBlogAuthorInput!) {\n\t\tcreateBlogAuthor(input: $input) {\n\t\t\t...Author\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation CreateAuthor($input: CreateBlogAuthorInput!) {\n\t\tcreateBlogAuthor(input: $input) {\n\t\t\t...Author\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation UpdateAuthor($input: UpdateBlogAuthorInput!) {\n\t\tupdateBlogAuthor(input: $input) {\n\t\t\t...Author\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation UpdateAuthor($input: UpdateBlogAuthorInput!) {\n\t\tupdateBlogAuthor(input: $input) {\n\t\t\t...Author\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery GetAuthorList($options: BlogAuthorListOptions) {\n\t\tblogAuthors(options: $options) {\n\t\t\titems {\n\t\t\t\t...Author\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetAuthorList($options: BlogAuthorListOptions) {\n\t\tblogAuthors(options: $options) {\n\t\t\titems {\n\t\t\t\t...Author\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation DeleteBlogAuthor($id: ID!) {\n\t\tdeleteBlogAuthor(id: $id) {\n\t\t\tresult\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation DeleteBlogAuthor($id: ID!) {\n\t\tdeleteBlogAuthor(id: $id) {\n\t\t\tresult\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery GetCategoryDetail($id: ID!) {\n\t\tblogCategory(id: $id) {\n\t\t\t...Category\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCategoryDetail($id: ID!) {\n\t\tblogCategory(id: $id) {\n\t\t\t...Category\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation CreateCategory($input: CreateBlogCategoryInput!) {\n\t\tcreateBlogCategory(input: $input) {\n\t\t\t...Category\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation CreateCategory($input: CreateBlogCategoryInput!) {\n\t\tcreateBlogCategory(input: $input) {\n\t\t\t...Category\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation UpdateCategory($input: UpdateBlogCategoryInput!) {\n\t\tupdateBlogCategory(input: $input) {\n\t\t\t...Category\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation UpdateCategory($input: UpdateBlogCategoryInput!) {\n\t\tupdateBlogCategory(input: $input) {\n\t\t\t...Category\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery GetCategoryList($options: BlogCategoryListOptions) {\n\t\tblogCategories(options: $options) {\n\t\t\titems {\n\t\t\t\t...Category\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetCategoryList($options: BlogCategoryListOptions) {\n\t\tblogCategories(options: $options) {\n\t\t\titems {\n\t\t\t\t...Category\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation DeleteBlogCategory($id: ID!) {\n\t\tdeleteBlogCategory(id: $id) {\n\t\t\tresult\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation DeleteBlogCategory($id: ID!) {\n\t\tdeleteBlogCategory(id: $id) {\n\t\t\tresult\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery GetPostDetail($id: ID!) {\n\t\tblogPost(id: $id) {\n\t\t\t...Post\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetPostDetail($id: ID!) {\n\t\tblogPost(id: $id) {\n\t\t\t...Post\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery GetPostHistory($id: ID!, $options: HistoryEntryListOptions) {\n\t\tblogPostHistory(id: $id, options: $options) {\n\t\t\ttotalItems\n\t\t\titems {\n\t\t\t\tid\n\t\t\t\ttype\n\t\t\t\tcreatedAt\n\t\t\t\tisPublic\n\t\t\t\tadministrator {\n\t\t\t\t\tid\n\t\t\t\t\tfirstName\n\t\t\t\t\tlastName\n\t\t\t\t}\n\t\t\t\tdata\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetPostHistory($id: ID!, $options: HistoryEntryListOptions) {\n\t\tblogPostHistory(id: $id, options: $options) {\n\t\t\ttotalItems\n\t\t\titems {\n\t\t\t\tid\n\t\t\t\ttype\n\t\t\t\tcreatedAt\n\t\t\t\tisPublic\n\t\t\t\tadministrator {\n\t\t\t\t\tid\n\t\t\t\t\tfirstName\n\t\t\t\t\tlastName\n\t\t\t\t}\n\t\t\t\tdata\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation CreatePost($input: CreateBlogPostInput!) {\n\t\tcreateBlogPost(input: $input) {\n\t\t\t...Post\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation CreatePost($input: CreateBlogPostInput!) {\n\t\tcreateBlogPost(input: $input) {\n\t\t\t...Post\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation UpdatePost($input: UpdateBlogPostInput!) {\n\t\tupdateBlogPost(input: $input) {\n\t\t\t...Post\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation UpdatePost($input: UpdateBlogPostInput!) {\n\t\tupdateBlogPost(input: $input) {\n\t\t\t...Post\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation PublishPost($id: ID!) {\n\t\tpublishBlogPost(id: $id) {\n\t\t\t...Post\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation PublishPost($id: ID!) {\n\t\tpublishBlogPost(id: $id) {\n\t\t\t...Post\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation ArchivePost($id: ID!) {\n\t\tarchiveBlogPost(id: $id) {\n\t\t\t...Post\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation ArchivePost($id: ID!) {\n\t\tarchiveBlogPost(id: $id) {\n\t\t\t...Post\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation AddPostNote($id: ID!, $note: String!) {\n\t\taddBlogPostNote(id: $id, note: $note) {\n\t\t\tid\n\t\t\ttype\n\t\t\tcreatedAt\n\t\t\tisPublic\n\t\t\tadministrator {\n\t\t\t\tid\n\t\t\t\tfirstName\n\t\t\t\tlastName\n\t\t\t}\n\t\t\tdata\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation AddPostNote($id: ID!, $note: String!) {\n\t\taddBlogPostNote(id: $id, note: $note) {\n\t\t\tid\n\t\t\ttype\n\t\t\tcreatedAt\n\t\t\tisPublic\n\t\t\tadministrator {\n\t\t\t\tid\n\t\t\t\tfirstName\n\t\t\t\tlastName\n\t\t\t}\n\t\t\tdata\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation UpdatePostNote($id: ID!, $note: String!) {\n\t\tupdateBlogPostNote(id: $id, note: $note) {\n\t\t\tid\n\t\t\ttype\n\t\t\tcreatedAt\n\t\t\tisPublic\n\t\t\tadministrator {\n\t\t\t\tid\n\t\t\t\tfirstName\n\t\t\t\tlastName\n\t\t\t}\n\t\t\tdata\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation UpdatePostNote($id: ID!, $note: String!) {\n\t\tupdateBlogPostNote(id: $id, note: $note) {\n\t\t\tid\n\t\t\ttype\n\t\t\tcreatedAt\n\t\t\tisPublic\n\t\t\tadministrator {\n\t\t\t\tid\n\t\t\t\tfirstName\n\t\t\t\tlastName\n\t\t\t}\n\t\t\tdata\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation DeletePostNote($id: ID!) {\n\t\tdeleteBlogPostNote(id: $id)\n\t}\n"): (typeof documents)["\n\tmutation DeletePostNote($id: ID!) {\n\t\tdeleteBlogPostNote(id: $id)\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery GetPostList($options: BlogPostListOptions) {\n\t\tblogPosts(options: $options) {\n\t\t\titems {\n\t\t\t\t...Post\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetPostList($options: BlogPostListOptions) {\n\t\tblogPosts(options: $options) {\n\t\t\titems {\n\t\t\t\t...Post\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation DeleteBlogPost($id: ID!) {\n\t\tdeleteBlogPost(id: $id) {\n\t\t\tresult\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation DeleteBlogPost($id: ID!) {\n\t\tdeleteBlogPost(id: $id) {\n\t\t\tresult\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery GetTagDetail($id: ID!) {\n\t\tblogTag(id: $id) {\n\t\t\t...Tag\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetTagDetail($id: ID!) {\n\t\tblogTag(id: $id) {\n\t\t\t...Tag\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation CreateTag($value: String!) {\n\t\tcreateBlogTag(value: $value) {\n\t\t\t...Tag\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation CreateTag($value: String!) {\n\t\tcreateBlogTag(value: $value) {\n\t\t\t...Tag\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation UpdateTag($id: ID!, $value: String!) {\n\t\tupdateBlogTag(id: $id, value: $value) {\n\t\t\t...Tag\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation UpdateTag($id: ID!, $value: String!) {\n\t\tupdateBlogTag(id: $id, value: $value) {\n\t\t\t...Tag\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation DeleteTag($id: ID!) {\n\t\tdeleteBlogTag(id: $id) {\n\t\t\t...on DeletionResponse {\n\t\t\t\tresult\n\t\t\t}\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation DeleteTag($id: ID!) {\n\t\tdeleteBlogTag(id: $id) {\n\t\t\t...on DeletionResponse {\n\t\t\t\tresult\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tquery GetTagList($options: BlogTagListOptions) {\n\t\tblogTags(options: $options) {\n\t\t\titems {\n\t\t\t\t...Tag\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"): (typeof documents)["\n\tquery GetTagList($options: BlogTagListOptions) {\n\t\tblogTags(options: $options) {\n\t\t\titems {\n\t\t\t\t...Tag\n\t\t\t}\n\t\t\ttotalItems\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tmutation DeleteBlogTag($id: ID!) {\n\t\tdeleteBlogTag(id: $id) {\n\t\t\tresult\n\t\t}\n\t}\n"): (typeof documents)["\n\tmutation DeleteBlogTag($id: ID!) {\n\t\tdeleteBlogTag(id: $id) {\n\t\t\tresult\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment Author on BlogAuthor {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tname\n\t\tbio\n\t}\n"): (typeof documents)["\n\tfragment Author on BlogAuthor {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tname\n\t\tbio\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment Category on BlogCategory {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tslug\n\t\tname\n\t\tdescription\n\t\tkeywords\n\t\tmetadata\n\t}\n"): (typeof documents)["\n\tfragment Category on BlogCategory {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tslug\n\t\tname\n\t\tdescription\n\t\tkeywords\n\t\tmetadata\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment Post on BlogPost {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tstatus\n\t\tslug\n\t\ttitle\n\t\texcerpt\n\t\tcontentType\n\t\tcontent\n\t\tdescription\n\t\tkeywords\n\t\tmetadata\n\t\tauthor {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t\tcategory {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t\ttags {\n\t\t\tid\n\t\t\tvalue\n\t\t}\n\t\tproducts {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t}\n"): (typeof documents)["\n\tfragment Post on BlogPost {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tstatus\n\t\tslug\n\t\ttitle\n\t\texcerpt\n\t\tcontentType\n\t\tcontent\n\t\tdescription\n\t\tkeywords\n\t\tmetadata\n\t\tauthor {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t\tcategory {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t\ttags {\n\t\t\tid\n\t\t\tvalue\n\t\t}\n\t\tproducts {\n\t\t\tid\n\t\t\tname\n\t\t}\n\t}\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n\tfragment Tag on BlogTag {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tvalue\n\t}\n"): (typeof documents)["\n\tfragment Tag on BlogTag {\n\t\tid\n\t\tcreatedAt\n\t\tupdatedAt\n\t\tvalue\n\t}\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;