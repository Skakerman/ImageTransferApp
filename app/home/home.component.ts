import { Component, OnInit } from "@angular/core";
import { Photos } from "./photos";
import { HttpService } from "./http.service";
import { PhotosService } from "./photos.service";
import { DownloadManager } from 'nativescript-downloadmanager'
import { Router } from "@angular/router";
import * as constants from "../constants";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['home.css'],
    providers: [PhotosService, HttpService]
})
export class HomeComponent implements OnInit {
    fileList: Array<Object> = [];

    constructor(
        private httpService: HttpService,
        private photosService: PhotosService,
        private photos: Photos,
        private router: Router
    ) {
        this.photos = new Photos();
    }

    ngOnInit(): void {
        this.loadPictures();
    }

    loadPictures() {
        this.httpService.getData(constants.PHOTOS_URL)
            .subscribe((result) => {
                console.log("In getData results");
                this.fileList = this.photosService.getPics(result);
            }, (error) => {
                console.log(error);
            });
    }

    picClick(pic) {
        console.log("I got clicked");
        console.dir(pic);
        this.router.navigate(["/single/" + pic.order])
    }

    reload() {
        this.fileList = [];
        this.loadPictures();
    }
}
