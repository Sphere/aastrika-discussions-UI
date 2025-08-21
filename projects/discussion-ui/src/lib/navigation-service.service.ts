import { Injectable } from '@angular/core';
import { RouterServiceService } from './router-service.service';
import { WrapperNavigateService } from './wrapper-navigate.service';

@Injectable({
  providedIn: 'root'
})
export class NavigationServiceService {

  navigateService: any = "routerService"

  
  constructor(private wrapperService: WrapperNavigateService,private routerService:  RouterServiceService) { }
  /**
   * used to intialize the navigation service with the wrapperservice or routerservice 
   * @param  {string} wrapperService
   */
  initService(wrapperService: string) {
    this.navigateService = wrapperService
   }
   /**
    * used for navigating  to the other pages based on the service initalized
    * @param  {} input
    */
   navigate(input){
     if(this.navigateService === 'routerService'){
       this.routerService.navigate(input)
     }else{
       this.wrapperService.navigate(input)
     }
   }

}
