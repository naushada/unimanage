import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { catchError, forkJoin, Observable} from 'rxjs';
import { environment } from 'src/environments/environment';


export interface Device {
  ipAddress: string;
  serialNumber: string;
  deviceName: string;
  isDeviceAvailable: boolean;
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
    
    public UriMap = new Map<string, string>([
        ["from_web_shell_command",         "/api/v1/shell/command"],
        ["from_web_devices",               "/api/v1/device/list"],
        ["from_web_device_ui",             "/api/v1/device/ui"]
    ]);

  private apiURL:string = "";
  constructor(private http: HttpClient) {

    if(!environment.production) {
      this.apiURL = "http://192.168.0.140:58989"; 
    }
   }
  

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  } 
  
  getUri(key:string) : string {

    let uri:string;

    if(this.apiURL.length > 0) {
      uri = this.apiURL + this.UriMap.get(key);
      return(uri);
    }
    uri = this.UriMap.get(key) as string;
    return(uri);
  }

  executeShellCommand(command: string, serialNo: string): Observable<string> {
    let param = `serialNo=${serialNo}`;


    const options = {params: new HttpParams({fromString: param})};
    return this.http.get<string>(this.getUri("from_web_shell_command"), options);
  }

  getDevices(): Observable<Array<Device>> {
    return this.http.get<Array<Device>>(this.getUri("from_web_devices"), this.httpOptions);
  }

  redirectToLocalUI(ipAddress: string, port:number = 443) : Observable<string> {
    let param = `ipAddress=${ipAddress}&port=${port}`;

    const options = {params: new HttpParams({fromString: param}),
                     headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.get<string>(this.getUri("from_web_device_ui"), options);
  }
}
