import {Component, OnInit} from '@angular/core';
import {GitlabService} from './gitlab.service';

@Component({
               selector:    'app-root',
               templateUrl: './app.component.html',
               styleUrls:   ['./app.component.scss']
           })
export class AppComponent implements OnInit {
    title = 'gitlab-pipelines';
    pipelines: any[] = [];
    projects: any[] = [];
    totalNumberOfItems = 0;
    pageCurrent = 0;
    pageTotal = 0;
    loadedItems = 0;
    gitlabApiKey: string | undefined;
    gitlabUrl: string | undefined;
    groupId: string | undefined;
    displayedColumns: string[] = ['status', 'created_at', 'updated_at', 'web_url'];

    constructor(private readonly gitlab: GitlabService) {
    }

    ngOnInit(): void {
        let gitlabApiKey = localStorage.getItem('gitlabApiKey');
        let gitlabUrl = localStorage.getItem('gitlabUrl');
        let groupId = localStorage.getItem('groupId');
        if (gitlabApiKey) {
            this.gitlabApiKey = gitlabApiKey;
        }
        if (gitlabUrl) {
            this.gitlabUrl = gitlabUrl;
        }
        if (groupId) {
            this.groupId = groupId;
        }

        if (this.gitlabUrl && this.gitlabApiKey && this.groupId) {
            this.getLoadData();
        }
    }

    gatherAllProjects(page: string = '1'): void {
        this.gitlab.getProjectsByUser(this.gitlabUrl, this.gitlabApiKey, page).subscribe(value => {
            this.projects = [...this.projects, ...value.body];
            let nextPage = value.headers.get('X-Next-Page');
            if (nextPage) {
                this.gatherAllProjects(nextPage);
            }
            this.loadedItems = this.projects.length;
            this.totalNumberOfItems = (value.headers.get('x-total'));
            this.pageCurrent = (value.headers.get('x-page'));
            this.pageTotal = (value.headers.get('x-total-pages'));
        });
    }

    gatherGroupProjects(page: string = '1'): void {
        this.gitlab.getProjectsByGroup(this.gitlabUrl, this.gitlabApiKey, this.groupId, page).subscribe(value => {
            this.projects = [...this.projects, ...value.body];
            let nextPage = value.headers.get('X-Next-Page');
            if (nextPage) {
                this.gatherGroupProjects(nextPage);
            }
            this.loadedItems = this.projects.length;
            this.totalNumberOfItems = (value.headers.get('x-total'));
            this.pageCurrent = (value.headers.get('x-page'));
            this.pageTotal = (value.headers.get('x-total-pages'));

            value.body.forEach((value: { id: string; }) => this.gatherRunningPipelines(value.id));
        });
    }

    gatherRunningPipelines(projectId: string): void {
        this.gitlab.getRunningPipelinesOfProject(this.gitlabUrl, this.gitlabApiKey, projectId).subscribe(value => {
            this.pipelines = [...this.pipelines, ...value.body];
        });
    }


    getLoadData() {
        this.projects = [];
        this.pipelines = [];
        this.totalNumberOfItems = 0;
        this.pageCurrent = 0;
        this.pageTotal = 0;
        this.loadedItems = 0;

        if (this.gitlabUrl && this.gitlabApiKey && this.groupId) {
            localStorage.setItem('gitlabApiKey', this.gitlabApiKey);
            localStorage.setItem('gitlabUrl', this.gitlabUrl);
            localStorage.setItem('groupId', String(this.groupId));
            this.gatherGroupProjects();
        }
    }
}
