import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
                providedIn: 'root'
            })
export class GitlabService {

    constructor(private readonly http: HttpClient) {
    }

    public getProjectsByGroup(backendUrl: string = '', apiKey: string = '', groupId: string = '', page: string): Observable<any> {
        const headers: HttpHeaders = new HttpHeaders().set('PRIVATE-TOKEN', apiKey);
        return this.http.get<any>(backendUrl + `groups/` + groupId + `/projects?include_subgroups=true&per_page=100&page=` + page, {
            headers,
            observe: 'response'
        });
    }

    public getRunningPipelinesOfProject(backendUrl: string = '', apiKey: string = '', projectId: string = '',
                                        page: string = '1'): Observable<any> {
        const headers: HttpHeaders = new HttpHeaders().set('PRIVATE-TOKEN', apiKey);
        return this.http.get<any>(backendUrl + `projects/` + projectId + `/pipelines?per_page=100&page=` + page, {
            headers,
            observe: 'response'
        });
    }
}
