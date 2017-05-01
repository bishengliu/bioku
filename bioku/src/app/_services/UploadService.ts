//not used
/*
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class UploadService {

private progressObserver: any;
private progress$ : Observable<any>;
private progress: number;

  constructor () {
    this.progress$ = Observable.create(observer => {
        this.progressObserver = observer
    }).share();
  }

  private makeFileRequest (url: string, files: File[]): Observable<any> {
    return Observable.create(observer => {
        let formData: FormData = new FormData(),
        xhr: XMLHttpRequest = new XMLHttpRequest();

        for (let i = 0; i < files.length; i++) {
            formData.append("uploads[]", files[i], files[i].name);
        }

        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    observer.next(JSON.parse(xhr.response));
                    observer.complete();
                } else {
                    observer.error(xhr.response);
                }
            }
        };

        xhr.upload.onprogress = (event) => {
            this.progress = Math.round(event.loaded / event.total * 100);

            this.progressObserver.next(this.progress);
        };

        xhr.open('POST', url, true);
        xhr.send(formData);
    });
  }
}
*/
/*

import {Component } from 'angular2/core';
import {UploadService} from './app.service';

@Component({
	selector: 'my-app',
	template: `
	  <div>
	    <input type="file" (change)="onChange($event)"/>
	  </div>
	`,
	providers: [ UploadService ]
})
export class AppComponent {
  constructor(private service:UploadService) {
    this.service.progress$.subscribe(
      data => {
        console.log('progress = '+data);
      });
  }
  
  onChange(event) {
    console.log('onChange');
    var files = event.srcElement.files;
    console.log(files);
    this.service.makeFileRequest('http://localhost:8182/upload', [], files).subscribe(() => {
      console.log('sent');
    });
  }
}


*/



//very good one

//https://github.com/valor-software/ng2-file-upload
//http://valor-software.com/ng2-file-upload/

/*


<input type="file" (change)="fileChange($event)" placeholder="Upload file" accept=".pdf,.doc,.docx">

fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        let formData:FormData = new FormData();
        formData.append('uploadFile', file, file.name);
        let headers = new Headers();
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        let options = new RequestOptions({ headers: headers });
        this.http.post(`${this.apiEndPoint}`, formData, options)
            .map(res => res.json())
            .catch(error => Observable.throw(error))
            .subscribe(
                data => console.log('success'),
                error => console.log(error)
            )
    }
}

*/