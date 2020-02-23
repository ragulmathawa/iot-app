import { Injectable } from '@angular/core';
import{ environment} from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Observable } from 'rxjs';
import * as  moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(private http:HttpClient) { }


  getDevices():Observable<Device[]>{
    return this.http.get<Device[]>(environment.apiUrl+"/device");
  }
  getStats(key:string, deviceMac:string, from:number,to:number):Observable<any[]>{
    let url = environment.apiUrl+"device/"+deviceMac+"/stats/"+key;
    let queries = []
    if(from){
      queries.push("from="+from); 
    }
    if(to){
      queries.push("to="+to); 
    }
    if(queries.length>0){
      url = url +"?"+ queries.join("&");
    }
    return this.http.get<any[]>(url)
    .pipe(
      map(list=>{
        let lastTimeStamp = list.reduce((max,x)=>max< x.timestamp?x.timestamp:max,0);
        list =  list.map(x=>{
          return {
            name:new Date(x.timestamp),
            value:x.value
          }
        })
        if(list.length!=0){
          if(lastTimeStamp<to){
            let next = moment(lastTimeStamp).add(1, "second").toDate().getTime();
            while(next<to){
              list.push({
                name: new Date(next),
                value:0
              });
              next = moment(next).add(1, "second").toDate().getTime();
            }
          }
        }
        return list;
      })
    );
  }

}
export interface Device {
  name: string;
  mac: string;
  ppmThreshold: number;
}
