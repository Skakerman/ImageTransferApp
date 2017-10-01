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
    // photos: Photos;
    fileList: Array<Object> = [];

    constructor(
        private httpService: HttpService,
        private photosService: PhotosService,
        private photos: Photos,
        private router: Router
    ) {
        this.photos = new Photos();
        console.log("^^^^^^^^^^^^^^");
        console.dir(photos.fileList);
        console.log("^^^^^^^^^^^^^^");
    }

    ngOnInit(): void {
        this.loadPictures();
    }

    loadPictures() {
        this.httpService.getData(constants.PHOTOS_URL)
            .subscribe((result) => {
                console.log("In getData results");
                this.fileList = this.photosService.getPics(result);
                // this.getPics(result);
            }, (error) => {
                console.log(error);
            });
    }

    // getPics(data) {
    //     console.log("in getPics");
    //     console.log(data["errCode"]);
    //     //console.dir(data);
    //     let order = 0;
    //     data.dirs.forEach((dir) => {
    //         console.dir(dir);
    //         dir.files.forEach((file) => {
    //             let fileType = file.substr(file.lastIndexOf('.') + 1);
    //             if( fileType == "JPG" ) {
    //                 fileType = constants.JPEG_FILE;
    //             } else {
    //                 fileType = constants.RAW_FILE;
    //             }
    //             this.fileList.push({
    //                 "order": order,
    //                 "dir": dir.name,
    //                 "fileName": file,
    //                 "fileType": fileType,
    //                 "viewUrl": constants.PHOTOS_URL + "/" + dir.name + "/" + file + "?size=view",
    //                 "fullUrl": constants.PHOTOS_URL + "/" + dir.name + "/" + file
    //             });
    //             order++;
    //             // this.fileList.push({
    //             //     "fileName": "100.jpg",
    //             //     "dir": dir.name,
    //             //     "viewUrl": "http://placehold.it/100.jpg",
    //             //     "fullUrl": "http://placehold.it/100.jpg"
    //             // });
    //         });
    //         console.dir(this.fileList);
    //         console.log("====");
    //     });
    // }

    picClick(pic) {
        console.log("I got clicked");
        console.dir(pic);
        // this.router.navigate(["/single"]);
        // this.router.navigate(["/single/" + pic.dir + "/" + pic.fileName])
        this.router.navigate(["/single/" + pic.order])
    }

    reload() {
        // this.photos.testString = "test";
        console.dir(this.fileList[0]);
        // this.fileList = [];
        // this.loadPictures();
    }
}
