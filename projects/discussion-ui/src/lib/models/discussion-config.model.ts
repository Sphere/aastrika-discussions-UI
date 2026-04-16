export interface IdiscussionConfig {
  menuOptions?: Array<IMenuOptions>
  userName: string
  context?: Object
  categories: Icategory
  path?: string
  routerSlug?: string
  headerOptions?: boolean
  bannerOption?: boolean
}

export interface Icontext {
  id: number
}

export interface IMenuOptions {
  route: string
  enable: boolean,
  label: string
}

export interface Icategory {
  result: Array<string>
}