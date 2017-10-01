import * as Application from "application"
import * as fs from "file-system";
import * as constants from "../constants";

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
            console.log("^^^^^^^^^^^^^^");
            console.dir(photos.fileList);
            console.log("^^^^^^^^^^^^^^");
            this.pageRoute.activatedRoute
                .switchMap(activatedRoute => activatedRoute.params)
                .forEach((params) => {
                    console.log("HEY HEY HEY HEY");
                    this.index = params["index"];
                    let jsonInfo = this.photos.fileList[this.index];
                    console.dir(jsonInfo);
                    this.dir = jsonInfo.dir;
                    this.fileName = jsonInfo.fileName;
                    this.fullUrl = jsonInfo.fullUrl;
                    this.viewUrl = jsonInfo.viewUrl;
                    // this.dir = params["dir"]; 
                    // this.fileName = params["fileName"];
                    // this.fullUrl = constants.PHOTOS_URL + "/" + this.dir + "/" + this.fileName;
                    // this.viewUrl = this.fullUrl + "?size=view";
                    this.photoInfoUrl = this.fullUrl + "/info";
                    //   this.fullUrl = "http://placehold.it/100.jpg";
                    //   this.viewUrl = "http://placehold.it/100.jpg";
            });
      }

    ngOnInit() {
        console.log("===SINGLE===");
        console.log(this.dir);
        console.log(this.fileName);
        console.log(this.fullUrl);
        console.log(this.viewUrl);
        console.log(this.photoInfo);
        this.loadInfo();
    }

    onSave() {
        console.log("I got clicked");
        console.log(this.dir, this.fileName);
        let uri = android.net.Uri.parse(this.fullUrl);
        this.manager = Application.android.context.getSystemService(android.content.Context.DOWNLOAD_SERVICE);
        let req = new android.app.DownloadManager.Request(uri);
        req.setTitle(this.fileName);
        req.setAllowedNetworkTypes(android.app.DownloadManager.Request.NETWORK_WIFI);

        let id = this.manager.enqueue(req);

        // this.downloading = true;
        // this.httpService.saveFile(this.fullUrl).then(res => {
        //     this.downloading = false;
        // });
    }

    loadInfo() {
        this.httpService.getData(this.photoInfoUrl)
            .subscribe((result) => {
                console.log("In getData results");
                console.dir(result);
                this.formatPhotoInfo(result);
                // this.photoInfo = result;
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
        console.log(this.dateTime);
    }

    onImageLoaded() {
        console.log("Image loaded");
        this.loading = false;
    }

    goBack() {
        this.routerExtensions.backToPreviousPage();
    }

    onSwipe(args: SwipeGestureEventData) {
        console.log("Swipe Direction: " + args.direction);

        if( args.direction == 1 ) { // Swipe left to right
            let prevPhoto = +this.index - 1;
            console.dir(this.photos.fileList[+this.index - 1]);
            this.router.navigate(["/single/" + (+this.index - 1)])
        } else if( args.direction == 2 ) { // Swipe right to left
            console.dir(this.photos.fileList[+this.index + 1]);
            this.router.navigate(["/single/" + (+this.index + 1)])

        }
    }

    tapTest() {
        console.dir(this.photos);
    }

}
