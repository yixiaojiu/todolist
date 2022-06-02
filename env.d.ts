/// <reference types="vite/client" />

//对env进行类型补充
interface ImportMetaEnv {
  readonly VITE_API_BASEURL: string
}
