import { Component, OnInit } from "@angular/core";
import { Photos } from "../shared/photos";
import { HttpService } from "../shared/http.service";
import { PhotosService } from "../shared/photos.service";
import { DownloadManager } from 'nativescript-downloadmanager'
import { Router } from "@angular/router";
import * as constants from "../shared/constants";
import * as connectivity from "connectivity";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['home.css'],
    providers: [PhotosService, HttpService]
})
export class HomeComponent implements OnInit {
    fileList: Array<Object> = [];

    loading: boolean = true;
    connState: boolean = false;
    connStatus: string = "Connecting to camera...";

    constructor(
        private httpService: HttpService,
        private photosService: PhotosService,
        private photos: Photos,
        private router: Router
    ) {
        this.photos = new Photos();
    }

    ngOnInit(): void {
        if ( this.checkConnection() ) {
            this.loadPictures();            
        };
    }

    loadPictures() {
        this.httpService.getData(constants.PHOTOS_URL)
            .subscribe((result) => {
                this.connState = true;
                this.connStatus = "Connected";
                console.log("In getData results");
                this.fileList = this.photosService.getPics(result);
            }, (error) => {
                this.loading = false;
                this.connStatus = "Failed to reach camera";
                console.log("Can't reach camera");
                console.log(error);
            });
        this.loading = false;
    }

    picClick(pic) {
        console.log("I got clicked");
        console.dir(pic);
        this.router.navigate(["/single/" + pic.order])
    }

    reload() {
        this.fileList = [];
        this.ngOnInit();
    }

    checkConnection() {
        let connectionType = connectivity.getConnectionType();
        if( connectionType != 1 ) {
            this.connStatus = "WiFi must be enabled";
            console.log("Not on WiFi");
            return false;
        }
        return true;
    }
}
