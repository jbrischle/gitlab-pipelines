import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
                providedIn: 'root'
            })
export class GitlabService {

    constructor(private readonly http: HttpClient) {
    }

    getProjectsByGroup(backendUrl: string = '', apiKey: string = '', groupId: string = '', page: string): Observable<any> {
        const headers: HttpHeaders = new HttpHeaders().set('PRIVATE-TOKEN', apiKey);
        return this.http.get<any>(
            backendUrl + `groups/` + groupId + `/projects?archived=false&include_subgroups=true&page=` + page, {
                headers,
                observe: 'response'
            });
    }

    getRunningPipelinesOfProject(backendUrl: string = '', apiKey: string = '', projectId: string = ''): Observable<any> {
        const headers: HttpHeaders = new HttpHeaders().set('PRIVATE-TOKEN', apiKey);
        return this.http.get<any>(backendUrl + `projects/` + projectId + `/pipelines?scope=branches`, {
            headers,
            observe: 'response'
        });
    }
}
