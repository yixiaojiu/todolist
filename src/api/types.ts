export interface LoginData {
  username: string
  password: string
}
export interface LoginResponse {
  code: number
  msg: string
  data: {
    token: string
    uid: string
  }
}

export interface VerifyResponse {
  code: number
  msg: string
}

export interface ListItem {
  _id: string
  state: boolean
  content: string
  startTime: string
  finishTime: string
  planTime: string
}

export interface GetUndoneResponse {
  code: number
  data: ListItem[]
}

export interface GetParams {
  limit: number
  page: number
}
export interface GetResponse {
  code: number
  count: number
  data: ListItem[]
}

export interface AddItemData {
  content: string
  planTimeStamp?: number
}

export interface ChangeItemResponse {
  code: number
  msg: string
}

export interface EditItemData {
  _id: string
  content?: string
  planTimeStamp?: number
}
