import { Component, OnInit } from "@angular/core";
import { HttpService } from "../home/http.service";
import { DownloadManager } from 'nativescript-downloadmanager'
import { PageRoute } from "nativescript-angular/router";
import "rxjs/add/operator/switchMap";

@Component({
    selector: "single-page",
    moduleId: module.id,
    templateUrl: "./single.component.html",
    providers: [HttpService]
})
export class SinglePageComponent implements OnInit {
    // serverUrl: String = "http://192.168.0.112:3000/v1_photos";
    serverUrl: String = "http://192.168.0.1/v1/photos";

    dir: String;
    fileName: String;
    fullUrl: string;
    viewUrl: string;

    constructor(private pageRoute: PageRoute) {
        this.pageRoute.activatedRoute
          .switchMap(activatedRoute => activatedRoute.params)
          .forEach((params) => {
              this.dir = params["dir"]; 
              this.fileName = params["fileName"];
              this.fullUrl = this.serverUrl + "/" + this.dir + "/" + this.fileName;
              this.viewUrl = this.fullUrl + "?size=view";
            //   this.fullUrl = "http://placehold.it/100.jpg";
            });
      }

    ngOnInit() {
        console.log("===SINGLE===");
        console.log(this.dir);
        console.log(this.fileName);
        //this.dlPic(this.dir, this.fileName);
    }

    onSave() {
        console.log("I got clicked");
        console.log(this.dir, this.fileName);
        let dm = new DownloadManager();
        dm.downloadFile(this.fullUrl, function (result, uri) {
            // result is a boolean, if the download was successful, it will return true
            console.log(result);
            // Uri in file:// format of the downloaded file.
            console.log(uri);
            // unregisterBroadcast is used to unregister the broadcast (For example if you just want to 
            // download a single file).
            dm.unregisterBroadcast();
        })
    }
}
