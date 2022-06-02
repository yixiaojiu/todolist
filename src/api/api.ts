import request from '@/utils/request'
import type { LoginData, LoginResponse, VerifyResponse, GetUndoneResponse, GetParams, GetResponse, AddItemData, ChangeItemResponse, EditItemData } from './types'

export function login(data: LoginData) {
  return request.post<LoginResponse>('/api/login', data)
}

export function verify() {
  return request.get<VerifyResponse>('/user/verify')
}

export function getUndone() {
  return request.get<GetUndoneResponse>('/user/get-undone')
}

export function getFinish(params: GetParams) {
  return request.get<GetResponse>('/user/get-finish', { params })
}

export function getAll(params: GetParams) {
  return request.get<GetResponse>('/user/get-all', { params })
}

export function addItem(data: AddItemData) {
  return request.post<ChangeItemResponse>('/user/add-item', data)
}

export function changeState(data: { _id: string }) {
  return request.post<ChangeItemResponse>('/user/change-state', data)
}

export function editItem(data: EditItemData) {
  return request.post<ChangeItemResponse>('/user/edit-item', data)
}
