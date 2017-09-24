import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable as RxObservable } from "rxjs/Observable";

import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

@Injectable()
export class HttpService {
    private serverUrl = "http://192.168.0.1/v1/photos";
    // private photosApi = "/v1/photos";
    // private serverUrl = "http://192.168.0.112:3000/v1_photos";

    constructor(private http: Http) { }

    getData() {
        return this.http.get(this.serverUrl)
            .map(res => res.json());
    }

    getResponseInfo() {
        return this.http.get(this.serverUrl)
            .do(res => res);
    }

}