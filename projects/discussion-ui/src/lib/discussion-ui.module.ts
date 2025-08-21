import { TelemetryUtilsService } from './telemetry-utils.service';
import { ElementsModule } from './elements/elements.module';
import { LibEntryComponent } from './components/lib-entry/lib-entry.component';
import { ComponentsModule } from './components/components.module';
import { DiscussionRoutingModule } from './discussion-routing/discussion-routing.module';
import { CategoryWidgetComponent } from './wrapper/category-widget/category-widget.component';

import { ModuleWithProviders, NgModule } from '@angular/core';

import { DiscussionEventsService } from './discussion-events.service';
import { BaseWrapperComponent } from './wrapper/base-wrapper/base-wrapper.component';
import { CommonModule } from '@angular/common';
import { TagsWidgetComponent } from './wrapper/tags-widget/tags-widget.component';
export function provideCsModule(){
  return window['CsModule'];
}
@NgModule({
  declarations: [ LibEntryComponent, CategoryWidgetComponent, BaseWrapperComponent, TagsWidgetComponent],
  imports: [
    ComponentsModule,
    DiscussionRoutingModule,
    ElementsModule,
    CommonModule,
  ],
  exports: [ ComponentsModule , CategoryWidgetComponent, BaseWrapperComponent, TagsWidgetComponent ],
  providers: [ DiscussionEventsService, TelemetryUtilsService,{provide: 'CsModule', useFactory: provideCsModule} ]
})
export class DiscussionUiModule { 
  static forRoot(configService): ModuleWithProviders<ComponentsModule> {
    return {
      ngModule: ComponentsModule,
      providers: [
        {provide: 'configService', useClass: configService}
      ]
    };
  }
}
