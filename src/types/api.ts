export interface ApiResponse<T>{
    data:T,
    code:number,
    message?:string
}
export interface  ActionI{
    "id": string, "type": string, "perms":Array<string>, "label": string 
}

export interface UserInfoResI {
  id: string
  name: string
  path: string
  icon?: string
  type?:string,
  perms?:string[]
  meta:any
  component?: string
  permissions?: string[]
  actions?: ActionI[]
  children?: UserInfoResI[]
}
    
