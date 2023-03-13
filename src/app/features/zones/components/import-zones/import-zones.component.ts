import { Component } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import * as shp from 'shpjs';
import kmlParser from 'js-kml-parser';
import * as JSZip from 'jszip';
import { kml } from '@tmcw/togeojson';
import { ZoneModel } from '@app/common/models/zone.model';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable, lastValueFrom } from 'rxjs';

export type ZoneFileUploaded = {
  fileId: string;
  fileName: string;
  features: any[];
};

@Component({
  selector: 'app-import-zones',
  templateUrl: 'import-zones.component.html',
  styleUrls: ['import-zones.component.scss'],
})
export class ImportZonesComponent {
  public files: ZoneFileUploaded[] = [];

  public errorMessage = '';

  public importedZones: ZoneModel[] = [];

  public fileUploadedColumns: string[] = ['fileName', 'zones'];

  constructor(private dialogRef: MatDialogRef<ImportZonesComponent>) {}

  // eslint-disable-next-line class-methods-use-this
  public dropped(files: NgxFileDropEntry[]) {
    this.errorMessage = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        fileEntry.file((file: File) => {
          const fileExt = file.name.substring(file.name.lastIndexOf('.') + 1);
          switch (fileExt) {
            case 'geojson':
            case 'json': {
              this.importGEOJSON(file);
              break;
            }
            case 'zip': {
              // case 'shp': {
              this.importSHP(file);
              break;
            }
            case 'kml': {
              this.importKML(file);
              break;
            }
            case 'kmz': {
              this.importKMZ(file);
              break;
            }
            default: {
              console.log('invalid file extension', fileExt);
            }
          }
        });
      }
    }
  }
  // eslint-disable-next-line class-methods-use-this
  // public fileOver(event) {
  //   console.log('fileOver', event);
  //   // reader.readAsText(event.target.files[0]);
  // }

  // // eslint-disable-next-line class-methods-use-this
  // public fileLeave(event) {
  //   console.log(event);
  // }

  deleteFile(file: ZoneFileUploaded) {
    this.files = this.files.filter((f) => f.fileId !== file.fileId);
  }

  importZones() {
    this.errorMessage = '';
    const features = [];
    this.files.forEach((file) => {
      features.push(...file.features);
    });
    if (!this.files || this.files.length === 0 || features.length === 0) {
      this.errorMessage = 'No hay zonas para importar';
      return;
    }
    this.dialogRef.close({ zones: features });
  }

  // eslint-disable-next-line class-methods-use-this
  readFileContent(file: File) {
    const fileReader: FileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    return new Observable((observer) => {
      fileReader.onloadend = () => {
        observer.next(fileReader.result);
        observer.complete();
      };
    });
  }

  async importSHP(file: any) {
    const source$ = await this.readFileContent(file);
    const values = await lastValueFrom(source$);
    const geoJson = await shp(values);
    if (Array.isArray(geoJson)) {
      //Import list of FeatureCollection
      geoJson.forEach((featureCollection) => {
        this.files = [
          ...this.files,
          {
            fileId: uuidv4(),
            fileName: file.name.slice(0, -4), // Remove extension
            features: featureCollection.features,
          },
        ];
      });
    } else {
      // Import a FeatureCollection
      this.files = [
        ...this.files,
        {
          fileId: uuidv4(),
          fileName: geoJson.fileName, // Remove extension
          features: geoJson.features,
        },
      ];
    }
  }

  async importGEOJSON(file: any) {
    const fileReader: FileReader = new FileReader();
    fileReader.onloadend = (event) => {
      const jsonObj = JSON.parse(event.target.result.toString());
      this.files = [
        ...this.files,
        {
          fileId: uuidv4(),
          fileName: file.name.slice(0, -5), // Remove extension
          features: jsonObj.features,
        },
      ];
    };
    fileReader.readAsText(file);
  }

  async importKML(file: any) {
    const fileReader: FileReader = new FileReader();
    fileReader.onloadend = (event) => {
      const geoJson = kmlParser.toGeoJson(event.target.result);
      this.files = [
        ...this.files,
        {
          fileId: uuidv4(),
          fileName: file.name.slice(0, -5), // Remove extension
          features: geoJson.features,
        },
      ];
    };
    fileReader.readAsText(file);
  }

  // eslint-disable-next-line class-methods-use-this
  async importKMZ(file: any) {
    const getDom = (xml) => new DOMParser().parseFromString(xml, 'text/xml');
    const zip = new JSZip();
    zip.loadAsync(file).then((zipFiles) => {
      const zipKMLFiles = zipFiles.filter((relPath) => relPath.split('.').pop() === 'kml');
      zipKMLFiles[0].async('string').then((result) => {
        const xmlDom = getDom(result.trim());
        const geoJson = kml(xmlDom);
        this.files = [
          ...this.files,
          {
            fileId: uuidv4(),
            fileName: file.name.slice(0, -5), // Remove extension
            features: geoJson.features,
          },
        ];
      });
    });
  }
}
