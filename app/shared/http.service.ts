import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable as RxObservable } from "rxjs/Observable";
import { getFile } from "http";
import * as fs from "file-system";

import "rxjs/add/operator/map";
import "rxjs/add/operator/do";

declare var android: any;
@Injectable()
export class HttpService {    
    constructor(private http: Http) { }

    getData(url) {
        return this.http.get(url)
            .map(res => res.json());
    }

    getResponseInfo(url) {
        return this.http.get(url)
            .do(res => res);
    }

    saveFile(fullUrl) {
        let fileName = fullUrl.substring(fullUrl.lastIndexOf('/') + 1);
        let androidDownloadsPath = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOWNLOADS).toString();
        let myFolderPath = fs.path.join(androidDownloadsPath, "ImageTransfer");
        let folder = fs.Folder.fromPath(myFolderPath);
        let path = fs.path.join(myFolderPath, fileName);
        let exists = fs.File.exists(path);
        path = fs.path.normalize(path);
        return getFile(fullUrl, path).then(response => {
            return false;
        }).catch(err => {
            return false;
        });
    }

}