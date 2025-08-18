import { DiscussionDetailsComponent } from './../components/discussion-details/discussion-details.component';
import { MyDiscussionComponent } from './../components/my-discussion/my-discussion.component';
import { DiscussTagsComponent } from './../components/discuss-tags/discuss-tags.component';
import { DiscussCategoryComponent } from './../components/discuss-category/discuss-category.component';
import { LibEntryComponent } from './../components/lib-entry/lib-entry.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DiscussHomeComponent } from './../components/discuss-home/discuss-home.component';
import { DiscussAllComponent } from './../components/discuss-all/discuss-all.component';
import { TagAllDiscussionComponent } from './../components/tag-all-discussion/tag-all-discussion.component';


const routes: Routes = [
  {
    path: '',
    component: LibEntryComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: DiscussAllComponent,
        data: {
          pageId: '',
          module: 'Discuss',
        }
      },
      {
        path: 'all-discussions',
        pathMatch: 'full',
        component: DiscussAllComponent,
        data: {
          pageId: 'all-discussions',
          module: 'Discuss',
        }
      },
      {
        path: 'categories',
        pathMatch: 'full',
        component: DiscussCategoryComponent,
        data: {
          pageId: 'categories',
          module: 'Discuss-categories',
        }
      },
      {
        path: 'tags',
        pathMatch: 'full',
        component: DiscussTagsComponent,
        data: {
          pageId: 'tags',
          module: 'Discuss',
        }
      },
      // TODO: ADD LATER
      {
        path: 'tags/tag-discussions',
        pathMatch: 'full',
        component: TagAllDiscussionComponent,
        data: {
          pageId: 'tags/tag-discussions',
          module: 'Discuss',
        }
      },
      {
        path: 'my-discussion',
        pathMatch: 'full',
        component: MyDiscussionComponent,
        data: {
          pageId: 'my-discussion',
          module: 'Discuss',
        }
      },
      {
        path: 'category/:slug',
        pathMatch: 'full',
        component: DiscussHomeComponent,
        data: {
          pageId: 'catergory/:categoryId',
          module: 'Discuss',
        }
      },
      {
        path: 'topic/:topicId/:slug',
        pathMatch: 'full',
        component: DiscussionDetailsComponent,
        data: {
          pageId: 'topic/:topicId/:topicSlug',
          module: 'Discuss',
        }
      }
    ]
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class DiscussionRoutingModule { }
