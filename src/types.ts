import { ID } from '@vendure/core'
import { HistoryEntryType, CreateBlogPostInput } from './generated-admin-types'

export type BlogPostStatus = 'published' | 'draft' | 'archived'

export type BlogPostContentType = 'html' | 'markdown'

// export type ComplaintActionCode = 'open' | 'close' | 'reopen' | 'assign' | 'addComment' | 'removeComment' | 'addTag' | 'removeTag'

// declare module '@vendure/core' {
//    interface CustomProductFields {
// 		complaintCount: number
// 		complaintRate: number
//    }
// 	interface CustomerHistoryEntryData {
// 		[HistoryEntryType.CUSTOMER_COMPLAINT_CREATED]: {
// 			input: CreateComplaintInput
// 		}
// 		[HistoryEntryType.CUSTOMER_COMPLAINT_CLOSED]: {
// 			id: ID
// 		}
// 	}
// 	interface OrderHistoryEntryData {
// 		[HistoryEntryType.ORDER_COMPLAINT_CREATED]: {
// 			input: CreateComplaintInput
// 		}
// 		[HistoryEntryType.ORDER_COMPLAINT_CLOSED]: {
// 			id: ID
// 		}
// 	}
// }


/**
 * @description
 * The plugin can be configured using the following options:
 */
export interface PluginInitOptions {

}
