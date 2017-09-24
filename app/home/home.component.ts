import { Component, OnInit } from "@angular/core";
import { HttpService } from "./http.service";
import { DownloadManager } from 'nativescript-downloadmanager'
import { Router } from "@angular/router";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    providers: [HttpService]
})
export class HomeComponent implements OnInit {
    fileList: Array<Object> = [];
    // serverUrl: String = "http://192.168.0.112:3000/v1_photos";
    serverUrl: String = "http://192.168.0.1/v1/photos";
    constructor(
        private httpService: HttpService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadPictures();
    }

    loadPictures() {
        this.httpService.getData()
            .subscribe((result) => {
                console.log("In getData results");
                this.getPics(result);
            }, (error) => {
                console.log(error);
            });
    }

    getPics(data) {
        console.log("in getPics");
        console.log(data["errCode"]);
        //console.dir(data);
        data.dirs.forEach((dir) => {
            console.dir(dir);
            dir.files.forEach((file) => {
                //console.log(file);
                this.fileList.push({
                    "dir": dir.name,
                    "fileName": file,
                    "viewUrl": this.serverUrl + "/" + dir.name + "/" + file + "?size=view",
                    "fullUrl": this.serverUrl + "/" + dir.name + "/" + file
                });
                // this.fileList.push({
                //     "fileName": "100.jpg",
                //     "dir": dir.name,
                //     "viewUrl": "http://placehold.it/100.jpg",
                //     "fullUrl": "http://placehold.it/100.jpg"
                // });
            });
            console.dir(this.fileList);
            console.log("====");
        });
    }

    picClick(pic) {
        console.log("I got clicked");
        console.dir(pic);
        // this.router.navigate(["/single"]);
        this.router.navigate(["/single/" + pic.dir + "/" + pic.fileName])
    }
}
