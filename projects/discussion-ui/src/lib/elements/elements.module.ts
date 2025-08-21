import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryCardComponent } from './category-card/category-card.component';
import { DiscussCardComponent } from './discuss-card/discuss-card.component';
import { AvatarPhotoComponent } from './avatar-photo/avatar-photo.component';
import { AppLoaderComponent } from './app-loader/app-loader.component';
import { RelatedDiscussionComponent } from './related-discussion/related-discussion.component';
import { PipesModule } from './../pipes/pipes.module';
import { PostReplyComponent } from './post-reply/post-reply.component';
import { SlidersComponent } from './sliders/sliders.component';
import { DiscussionDeleteComponent } from '../components/discussion-delete/discussion-delete.component';
import { ReplyDelteComponent } from '../components/reply-delte/reply-delte.component';
// import { DiscussStartComponent } from '../components/discuss-start/discuss-start.component';
import { DiscussEditComponent } from './discuss-start/discuss-edit.component';
// import { ComponentsModule } from '../components/components.module';
// import { ReplyCommentComponent } from './reply-comment/reply-comment.component';
@NgModule({
  declarations: [
    PostReplyComponent,
    CategoryCardComponent,
    DiscussCardComponent,
    AvatarPhotoComponent,
    AppLoaderComponent,
    RelatedDiscussionComponent,
    SlidersComponent,
    DiscussionDeleteComponent,
    DiscussEditComponent,
    // ReplyCommentComponent
    // ComponentsModule,
    ReplyDelteComponent
  ],
  imports: [
    CommonModule, PipesModule,
     FormsModule,
    ReactiveFormsModule,
    // ComponentsModule
  ],
  exports: [
    CategoryCardComponent,
    DiscussCardComponent,
    AvatarPhotoComponent,
    AppLoaderComponent, 
    RelatedDiscussionComponent,
    AppLoaderComponent,
    PostReplyComponent,
    SlidersComponent,
    DiscussionDeleteComponent,
    DiscussEditComponent,
    ReplyDelteComponent
  ]
})
export class ElementsModule { }
