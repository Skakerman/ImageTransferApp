import { Injectable } from "@angular/core";

import { Photos } from "./photos";
import * as constants from "../constants";

@Injectable()
export class PhotosService {
    constructor(private photos: Photos) {}
    // fileList: Array<Object> = [];

    getPics(data) {
        console.log("in getPics");
        console.log(data["errCode"]);
        //console.dir(data);
        let order = 0;
        data.dirs.forEach((dir) => {
            console.dir(dir);
            dir.files.forEach((file) => {
                let fileType = file.substr(file.lastIndexOf('.') + 1);
                if( fileType == "JPG" ) {
                    fileType = constants.JPEG_FILE;
                } else {
                    fileType = constants.RAW_FILE;
                }
                this.photos.fileList.push({
                    "order": order,
                    "dir": dir.name,
                    "fileName": file,
                    "fileType": fileType,
                    "viewUrl": constants.PHOTOS_URL + "/" + dir.name + "/" + file + "?size=view",
                    "fullUrl": constants.PHOTOS_URL + "/" + dir.name + "/" + file
                });
                order++;
                // this.fileList.push({
                //     "fileName": "100.jpg",
                //     "dir": dir.name,
                //     "viewUrl": "http://placehold.it/100.jpg",
                //     "fullUrl": "http://placehold.it/100.jpg"
                // });
            });
            console.dir(this.photos.fileList);
            console.log("====");
        });
        return this.photos.fileList;
    }
}