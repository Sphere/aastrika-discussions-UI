import { PipesModule } from './../pipes/pipes.module';
import { DiscussionService } from './../services/discussion.service';
import { ConfigService } from './../services/config.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ElementsModule } from './../elements/elements.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SidePannelComponent } from './side-pannel/side-pannel.component';
import { DiscussHomeComponent } from './discuss-home/discuss-home.component';
import { DiscussCategoryComponent } from './discuss-category/discuss-category.component';
import { DiscussTagsComponent } from './discuss-tags/discuss-tags.component';
import { MyDiscussionComponent } from './my-discussion/my-discussion.component';
import { DiscussionDetailsComponent } from './discussion-details/discussion-details.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DiscussStartComponent } from './discuss-start/discuss-start.component';
import {DiscussModerationComponent} from './discuss-moderation/discuss-moderation.component';
// import { TagInputModule } from 'ngx-chips';
import { DiscussAllComponent } from './discuss-all/discuss-all.component';
import { TagAllDiscussionComponent } from './tag-all-discussion/tag-all-discussion.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TrendingTagsComponent } from './trending-tags/trending-tags.component';
import { LeaderBoardComponent } from './leader-board/leaderboard-component';
import { ReplyCommentComponent } from '../elements/reply-comment/reply-comment.component';

// import { DiscussionDeleteComponent } from './discussion-delete/discussion-delete.component';

@NgModule({ declarations: [
        SidePannelComponent,
        DiscussHomeComponent,
        DiscussCategoryComponent,
        DiscussTagsComponent,
        MyDiscussionComponent,
        DiscussionDetailsComponent,
        DiscussStartComponent,
        DiscussAllComponent,
        TagAllDiscussionComponent,
        TrendingTagsComponent,
        LeaderBoardComponent,
        DiscussModerationComponent,
        // DiscussionDeleteComponent
        ReplyCommentComponent,
    ],
    exports: [
        SidePannelComponent,
        DiscussHomeComponent,
        DiscussCategoryComponent,
        DiscussTagsComponent,
        MyDiscussionComponent,
        DiscussionDetailsComponent,
        DiscussStartComponent,
        // TODO: Add this components
        DiscussAllComponent,
        TagAllDiscussionComponent,
        TrendingTagsComponent,
        LeaderBoardComponent,
        ReplyCommentComponent
    ], imports: [CommonModule,
        TranslateModule,
        ElementsModule,
        FormsModule,
        ReactiveFormsModule,
        // TagInputModule,
        PipesModule,
        InfiniteScrollModule], 
    providers: [
        DiscussionService, ConfigService
    ] })
export class ComponentsModule { }
