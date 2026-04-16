import { Component, HostBinding, Input, OnInit } from '@angular/core'
// import { NsWidgetResolver, WidgetBaseComponent } from '@sunbird-cb/resolver'
import { Subscription, interval } from 'rxjs'
// import { EventService } from '@sunbird-cb/utils'

@Component({
    selector: 'ws-widget-sliders',
    templateUrl: './sliders.component.html',
    styleUrls: ['./sliders.component.scss'],
    standalone: false
})
export class SlidersComponent implements OnInit {
  @Input() bannerData: any
  @HostBinding('id')
  public id = `banner_${Math.random()}`
  currentIndex = 0
  slideInterval: Subscription | null = null

  constructor() {
    // super()
  }

  ngOnInit() {
    this.reInitiateSlideInterval()
  }
  reInitiateSlideInterval() {
    console.log('---------------', this.bannerData)
    if (this.bannerData.widgetData.length > 1) {
      try {
        if (this.slideInterval) {
          this.slideInterval.unsubscribe()
        }
      } catch (e) {
      } finally {
        this.slideInterval = interval(8000).subscribe(() => {
          if (this.currentIndex === this.bannerData.widgetData.length - 1) {
            this.currentIndex = 0
          } else {
            this.currentIndex += 1
          }
        })
      }
    }
  }
  slideTo(index: number) {
    if (index >= 0 && index < this.bannerData.widgetData.length) {
      this.currentIndex = index
    } else if (index === this.bannerData.widgetDatalength) {
      this.currentIndex = 0
    } else {
      this.currentIndex = this.bannerData.widgetData.length + index
    }
    this.reInitiateSlideInterval()
  }

  get isOpenInNewTab() {
    const currentData = this.bannerData[this.currentIndex]
    if (currentData.redirectUrl && currentData.redirectUrl.includes('mailto') || this.bannerData[this.currentIndex].openInNewTab) {
      return true
    } return false
  }

  openInNewTab() {
    const currentData = this.bannerData[this.currentIndex]
    if (currentData.redirectUrl && currentData.redirectUrl.includes('mailto') || this.bannerData[this.currentIndex].openInNewTab) {
      window.open(currentData.redirectUrl)
    }
  }
  // raiseTelemetry(bannerUrl: string | undefined) {
  //   this.openInNewTab()
  //   const path = window.location.pathname.replace('/', '')
  //   const url = path + window.location.search

  //   // this.events.raiseInteractTelemetry('click', 'banner', {
  //   //   pageUrl: url,
  //   //   bannerRedirectUrl: bannerUrl,
  //   // })
  // }
}
