// import { IGroup } from '../../infy/routes/navigator/models/navigator.model'

export namespace NSDiscussData {
  export interface IDiscussJsonData {
    tabs: IDiscussionTab[]
  }

  export interface IDiscussionTab {
    name: string
    key: string
    badges: {
      enabled: boolean
      uri?: string
    }
    enabled: boolean
    routerLink: string
  }

  export interface IDiscussion {
    posts: IPosts[];
    title: string;
    upvotes: number;
    downvotes: number;
    viewcount: number;
    postcount: number;
  }

  export interface IDiscussionData {
    cid: number
    tid: number
    uid: number
    mainPid: number
    content?: string
    slug: string
    title: string
    titleRaw: string
    lastposttime: number
    timestampISO: string
    lastposttimeISO: string
    timestamp: number
    upvotes: number
    downvotes: number
    viewcount: number
    postcount: number
    deleterUid: number
    deleted: boolean | number
    locked: boolean | number
    pinned: boolean | number
    thumb?: string | null
    category: ICategorie
    user?: IUser
    postIndex?: number
    teaser?: any
    tagWhitelist?: any[]
    tags: ITag[]
    minTags?: number
    maxTags?: number
    thread_tools?: []
    isFollowing?: boolean
    isNotFollowing?: boolean
    isIgnoring?: boolean
    isOwner?: boolean
    ignored?: boolean
    unread?: boolean
    bookmark?: any
    postSharing?: []
    deleter?: any | null
    merger?: any | null
    related?: []
    privileges?: any | null
    topicStaleDays?: number
    unreplied: boolean
    icons?: any[]
    index?: number
    votes?: number
    teaserPid: number | null | undefined
    pagination?: IPagination
    posts?: IPosts[]
    topics?: any[]
    result?: any[]
  }

  export interface ICategoryData {
    bgColor: string,
    cid: number,
    class: string,
    color: string,
    description: string,
    descriptionParsed: string,
    disabled: number,
    icon: string,
    imageClass: string,
    isSection: number,
    link: string,
    name: string,
    numRecentReplies: number,
    order: number,
    parentCid: number,
    post_count: number,
    slug: string,
    topic_count: number,
    minTags: number,
    maxTags: number,
    totalPostCount: number,
    totalTopicCount: number,
    tagWhitelist: any[],
    children: any[],
    topics: any[],
    nextStart: number,
    isWatched: boolean,
    isNotWatched: boolean,
    isIgnored: boolean,
    breadcrumbs: any[],
    title: string,
    privileges: any,
    pagination: any,
    loggedIn: boolean,
    relative_path: string,
    template: any,
    url: string,
    bodyClass: string,
    _header: any,
    widgets: any
  }

  export interface ITag {
    value: any
    valueEscaped: string
    color: string
    bgColor: string
    score: number
  }

  export interface ICategorie {
    "cid": number,
    "name": string,
    "description": string,
    "descriptionParsed": string,
    "icon": any,
    "bgColor": string,
    "color": string,
    "slug": string,
    "parentCid": number,
    "topic_count": number,
    "post_count": number,
    "disabled": number,
    "order": number,
    "link": string,
    "numRecentReplies": number,
    "class": string,
    "imageClass": string,
    "isSection": number,
    "totalPostCount": number,
    "totalTopicCount": number,
    "minTags": number,
    "maxTags": number,
    "tagWhitelist": any,
    "unread-class": string,
    "children": any,
    "posts": any,
    "teaser": any
  }

  export interface IRelatedDiscussion {
    id: number
    title: string
    category: string
    time: string
  }

  export interface IUser {
    uid: number
    username: string
    fullname?: string
    userslug: string
    reputation: number
    postcount: number
    topiccount?: number
    picture?: string | null
    signature?: string | null
    banned: number
    'banned:expire'?: number
    status: string
    lastonline?: number | null | undefined
    groupTitle?: string
    groupTitleArray?: string[]
    'icon:text'?: string
    'icon:bgColor'?: string
    lastonlineISO?: string
    banned_until?: number | boolean
    banned_until_readable?: string
    selectedGroups?: any[]
    custom_profile_info?: any[]
  }

  export interface IPagination {
    prev: IPageData
    next: IPageData
    first: IPageData
    last: IPageData
    rel?: any[]
    pages?: any[]
    currentPage: number
    pageCount: number
  }

  export interface IPageData {
    page: number
    active: boolean
  }

  export interface IEditor {
    uid: number
    username: string
    userslug: string
  }

  export interface IPosts {
    content: string;
    pid: number;
    tid: number;
    timestamp: string;
    uid: number;
    deleted: number | boolean;
    upvotes: number;
    downvotes: number;
    viewcount?: number;
    deleterUid: number;
    edited: number | boolean;
    votes: number;
    timestampISO: string;
    editedISO?: string;
    index: number;
    user: IUser;
    category?: ICategorie;
    topic?: ITopic;
    editor?: IEditor | null;
    bookmarked: boolean;
    upvoted: boolean;
    downvoted: boolean;
    bookmarks?: number | null;
    replies: {
      hasMore: false;
      users: any[];
      text: any;
      count: number;
      timestampISO: string;
    };
    selfPost: boolean;
    display_edit_tools: boolean;
    display_delete_tools: boolean;
    display_moderator_tools: boolean;
    display_move_tools: boolean;
    display_post_menu: boolean;
  }
  
  export interface ITopic {
    cid: number
    deleted: number
    mainPid: number
    postcount: number
    slug: string
    teaserPid: number
    tid: number
    title: string
    titleRaw: string
    uid: number
  }
  
  export interface IProfile {
    uid: number
    username: string
    userslug: string
    email: string
    'email:confirmed': number
    joindate: number
    lastonline: number
    picture: string
    fullname: string
    location: string
    birthday: string
    website: string
    aboutme: string
    signature: string
    uploadedpicture: string
    profileviews: number
    reputation: number
    postcount: number
    topiccount: number
    lastposttime: number
    banned: number
    'banned:expire': number
    status: string
    flags: number
    followerCount: number
    followingCount: number
    'cover:url': string
    'cover:position': string
    groupTitle: string
    groupTitleArray: []
    joindateISO: string
    lastonlineISO: string
    isBlocked: true
    blocksCount: number
    canEdit: true
    canBan: true
    // groups: IGroup[]
    posts: IPosts[]
    latestPosts: IPosts[]
    bestPosts: IPosts[]
    title: string
  }

  export enum IPageName {
    HOME = 'discussion-home',
    START = 'discussion-start',
    DETAILS = 'discussion-details',
    CATEGORY = 'discussion-category',
    TAGS = 'discussion-category',
    MY_DISCUSSION = 'my-discussion',
    LIB_ENTRY = 'lib-entry'
  }
}
