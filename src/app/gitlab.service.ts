import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
                providedIn: 'root'
            })
export class GitlabService {


    constructor(private readonly http: HttpClient) {
    }

    public getProjectsByUser(backendUrl: string = '', apiKey: string = '', page: string): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders().set('PRIVATE-TOKEN', apiKey);
        return this.http.get<any>(backendUrl + `projects?per_page=100&page=` + page, {
            headers: headers,
            observe: 'response'
        });
    }

    public getProjectsByGroup(backendUrl: string = '', apiKey: string = '', groupId: string = '', page: string): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders().set('PRIVATE-TOKEN', apiKey);
        return this.http.get<any>(backendUrl + `groups/` + groupId + `/projects?include_subgroups=true&per_page=100&page=` + page, {
            headers: headers,
            observe: 'response'
        });
    }

    public getRunningPipelinesOfProject(backendUrl: string = '', apiKey: string = '', projectId: string = ''): Observable<any> {
        let headers: HttpHeaders = new HttpHeaders().set('PRIVATE-TOKEN', apiKey);
        return this.http.get<any>(backendUrl + `projects/` + projectId + `/pipelines?status=running`, {
            headers: headers,
            observe: 'response'
        });
    }
}
