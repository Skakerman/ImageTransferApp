import { Injectable } from "@angular/core";

import { Photos } from "./photos";
import * as constants from "../constants";

@Injectable()
export class PhotosService {
    constructor(private photos: Photos) {}

    getPics(data) {
        this.photos.fileList = [];
        let order = 0;
        data.dirs.forEach((dir) => {
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
            });
        });
        return this.photos.fileList;
    }
}