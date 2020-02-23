import { Component, OnInit } from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { DeviceService, Device } from '../device.service';
import { expand } from 'rxjs/operators';
import * as moment from 'moment';
@Component({
  selector: 'app-table-expandable-devices',
  templateUrl: './table-expandable-devices.component.html',
  styleUrls: ['./table-expandable-devices.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TableExpandableDevicesComponent implements OnInit {
  dataSource = [];
  columnsToDisplay = ['name', 'mac', 'ppmThreshold'];
  expandedElement: Device | null;
  expandedStats:any[];
  autoRefreshHandle;
  chartTime = '5';
  constructor(private deviceService:DeviceService) { }

  ngOnInit(): void {
    this.deviceService.getDevices().subscribe(devices=>{
      this.dataSource = devices
    })
  }


  toggleRow(element){
    this.expandedElement = this.expandedElement === element ? null : element
    if(this.autoRefreshHandle){
      clearInterval(this.autoRefreshHandle);
      this.autoRefreshHandle = null;
    }
    if(this.expandedElement){
      this.autoRefreshHandle = this.startLoadingStats(this.expandedElement.mac);
    }
  }
  startLoadingStats(deviceMac:string){
    let handle = setInterval(()=>{
      if(this.expandedElement?.mac===deviceMac){
        
        let from = moment().subtract(this.chartTime,'minutes').toDate().getTime();
        let to = Date.now();
        this.loadPpmStats(deviceMac, from ,to);
      }else{
        console.error("There is a leak for device, "+deviceMac+" handle ", handle,);
      }
    },1000);
    return handle;
  }
  loadPpmStats(deviceMac:string,from:number,to:number){
    this.deviceService.getStats("ppm",deviceMac, from ,to).subscribe(series=>{
      if(this.expandedElement.mac===deviceMac){
        this.expandedStats = [{
          name:"PPM",
          series:series
        }];
      }
    })
  }
}

