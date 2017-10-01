import * as Application from "application"
import * as fs from "file-system";
import * as constants from "../constants";
import * as Toast from "nativescript-toast";

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SwipeGestureEventData } from "ui/gestures";

import { Photos } from "../home/photos";
import { HttpService } from "../home/http.service";
import { PhotosService } from "../home/photos.service";
import { DownloadManager } from 'nativescript-downloadmanager'
import { PageRoute, RouterExtensions } from "nativescript-angular/router";
import "rxjs/add/operator/switchMap";
declare var android: any;

@Component({
    selector: "single-page",
    moduleId: module.id,
    templateUrl: "./single.component.html",
    providers: [HttpService, PhotosService],
    styleUrls: ["single.css"]
})

export class SinglePageComponent implements OnInit {
    index: string;
    dir: string;
    fileName: string;
    fullUrl: string;
    viewUrl: string;
    photoInfoUrl: string;
    downloading: Boolean = false;
    photoInfo: Object;
    loading: boolean = true;

    manager: any;

    shutterSpeed: string = "1/--";
    aperture: string = "F--";
    iso: string = "ISO---";
    dateTime: string = "-/-/- -:-:-";

    constructor(private pageRoute: PageRoute,
        private photos: Photos,
        public photosService: PhotosService,
        private httpService: HttpService,
        private router: Router,
        private routerExtensions: RouterExtensions) {
            this.pageRoute.activatedRoute
                .switchMap(activatedRoute => activatedRoute.params)
                .forEach((params) => {
                    this.index = params["index"];
                    let jsonInfo = this.photos.fileList[this.index];
                    this.dir = jsonInfo.dir;
                    this.fileName = jsonInfo.fileName;
                    this.fullUrl = jsonInfo.fullUrl;
                    this.viewUrl = jsonInfo.viewUrl;
                    this.photoInfoUrl = this.fullUrl + "/info";
            });
      }

    ngOnInit() {
        // console.log("===SINGLE===");
        // console.log(this.dir);
        // console.log(this.fileName);
        // console.log(this.fullUrl);
        // console.log(this.viewUrl);
        // console.log(this.photoInfo);
        this.loadInfo();
    }

    onSave() {
        let uri = android.net.Uri.parse(this.fullUrl);
        this.manager = Application.android.context.getSystemService(android.content.Context.DOWNLOAD_SERVICE);
        let req = new android.app.DownloadManager.Request(uri);
        req.setTitle(this.fileName);
        req.setAllowedNetworkTypes(android.app.DownloadManager.Request.NETWORK_WIFI);
        let id = this.manager.enqueue(req);
        Toast.makeText("Downloading").show();
    }

    loadInfo() {
        this.shutterSpeed = "1/--";
        this.aperture = "F--";
        this.iso = "ISO---";
        this.dateTime = "-/-/- -:-:-";
        this.httpService.getData(this.photoInfoUrl)
            .subscribe((result) => {
                this.formatPhotoInfo(result);
            }, (error) => {
                console.log(error);
            });
    }

    formatPhotoInfo(photoJSON) {
        var formatOptions = { 
            day:    '2-digit', 
            month:  '2-digit', 
            year:   'numeric',
            hour:   '2-digit', 
            minute: '2-digit',
            hour12: true 
        };

        this.aperture = "F" + photoJSON.av;
        this.iso = "ISO " + photoJSON.sv;
        this.shutterSpeed = photoJSON.tv.replace(".", "/");
        this.dateTime = photoJSON.datetime;
        let dateArray = photoJSON.datetime.split("T");
        let date = dateArray[0].split("-");
        let time = dateArray[1].split(":");
        this.dateTime = date[1] + "/" + date[2] + "/" + date[0] + " " + dateArray[1];
    }

    goBack() {
        this.routerExtensions.backToPreviousPage();
    }

    onSwipe(args: SwipeGestureEventData) {
        let photoNav = 0;
        if( args.direction == 1 ) { // Swipe left to right
            console.log(this.index);
            if( +this.index == 0 ) {
                console.log("hey");
                photoNav = this.photos.fileList.length - 1;
            } else {
                console.log("asdf");
                photoNav = +this.index - 1;
            }
            console.log(photoNav);
            this.router.navigate(["/single/" + (photoNav)])
        } else if( args.direction == 2 ) { // Swipe right to left
            if( +this.index == (this.photos.fileList.length - 1) ) {
                photoNav = 0;
            } else {
                photoNav = +this.index + 1;
            }
            this.router.navigate(["/single/" + (photoNav)])
        }
        this.loadInfo();
    }
}
