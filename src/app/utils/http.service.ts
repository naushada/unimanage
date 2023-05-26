import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { catchError, forkJoin, Observable} from 'rxjs';
import { environment } from 'src/environments/environment';


export interface Device {
  ipAddress: string;
  serialNumber: string;
  deviceName: string;
  productName: string;
  isDeviceAvailable: boolean;
  osVersion: string;
  osBuildnumber: string;
  osName: string;
  
};

@Injectable({
  providedIn: 'root'
})
export class HttpService {
    
    public UriMap = new Map<string, string>([
        ["from_web_shell_command",                "/api/v1/shell/command"],
        ["from_web_devices",                      "/api/v1/device/list"],
        ["from_web_device_ui",                    "/api/v1/device/ui"],
        ["from_web_device_swupdate_manifest",     "/api/v1/update/manifest"],
        ["from_web_device_swupdate_installer",    "/api/v1/update/installer"],
        ["from_web_device_authorization",         "/api/v1/auth/authorization"],
        ["from_web_device_tokens",                "/api/v1/auth/tokens"],
    ]);

  private apiURL:string = "";
  constructor(private http: HttpClient) {

    if(!environment.production) {
      //this.apiURL = "http://192.168.0.140:58989"; 
      this.apiURL = "http://localhost:8080"; 
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

  executeShellCommand(command: string, serialNo: string, ipAddress:string): Observable<string> {
    let param = `serialNo=${serialNo}&command=${command}&ipAddress=${ipAddress}`;


    const options = {params: new HttpParams({fromString: param})};
    return this.http.get<string>(this.getUri("from_web_shell_command"), options);
  }

  getDevices(): Observable<Array<string>>{
    return this.http.get<Array<string>>(this.getUri("from_web_devices"), this.httpOptions);
  }

  redirectToLocalUI(ipAddress: string, port:number = 443) : Observable<string> {
    let param = `ipAddress=${ipAddress}&port=${port}`;

    const options = {params: new HttpParams({fromString: param}),
                     headers: new HttpHeaders({'Content-Type': 'application/json'})};
    return this.http.get<string>(this.getUri("from_web_device_ui"), options);
  }

  manifestUpdate(deviceIp: string, port: string, formData: FormData) : Observable<any> {
    let param = `ipAddress=${deviceIp}&port=${port}`;
    //return this.http.post<string>(this.getUri("from_web_device_swupdate_manifest"), options);
    let URI: string = "";
    //URI = "http://" + deviceIp + ":" + port + this.getUri("from_web_device_swupdate_manifest");
    //URI = "https://" + deviceIp + this.getUri("from_web_device_swupdate_manifest");
    URI = this.getUri("from_web_device_swupdate_manifest");
    return this.http.post<string>(URI,formData);
  }

  authorization(deviceIp: string, port: string, userID: string) : Observable<any> {
    let param = `ipAddress=${deviceIp}&port=${port}`;
    //return this.http.post<string>(this.getUri("from_web_device_swupdate_manifest"), options);
    const options = {params: new HttpParams({fromString: param})};
    let URI: string = "";
    //URI = "http://" + deviceIp + ":" + port + this.getUri("from_web_device_authorization") + "/" + userID;
    //URI = "http://" + deviceIp + this.getUri("from_web_device_authorization") + "/" + userID;
    URI = this.getUri("from_web_device_authorization") + "/" + userID;
    return this.http.get<string>(URI, options);
  }

  toeks(deviceIp: string, port: string, userID: string, password: string) : Observable<any> {
    let param = `ipAddress=${deviceIp}&port=${port}`;
    //return this.http.post<string>(this.getUri("from_web_device_swupdate_manifest"), options);
    const options = {params: new HttpParams({fromString: param})};
    let URI: string = "";
    //URI = "http://" + deviceIp + ":" + port + this.getUri("from_web_device_tokens");
    //URI = "http://" + deviceIp + this.getUri("from_web_device_tokens");
    URI = this.getUri("from_web_device_tokens");
    let body = {"login": userID, "password": password};
    return this.http.post<string>(URI, JSON.stringify(body), options);
  }
}
