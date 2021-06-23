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
    pipelinesShown: any[] = [];
    projects: any[] = [];
    totalNumberOfItems = 0;
    pageCurrent = 0;
    pageTotal = 0;
    loadedItems = 0;
    gitlabApiKey: string | undefined;
    gitlabUrl: string | undefined;
    groupId: string | undefined;
    displayedColumns: string[] = ['status', 'ref', 'created_at', 'updated_at', 'runtime', 'web_url'];
    statusList: any[] = ['created', 'waiting_for_resource', 'preparing', 'pending', 'running', 'success', 'failed', 'canceled', 'skipped',
                         'manual', 'scheduled'];
    statusSelected = 'running';

    constructor(private readonly gitlab: GitlabService) {
    }

    ngOnInit(): void {
        const gitlabApiKey = localStorage.getItem('gitlabApiKey');
        const gitlabUrl = localStorage.getItem('gitlabUrl');
        const groupId = localStorage.getItem('groupId');
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

    gatherGroupProjects(page: string = '1'): void {
        this.gitlab.getProjectsByGroup(this.gitlabUrl, this.gitlabApiKey, this.groupId, page).subscribe(value => {
            this.projects = [...this.projects, ...value.body];
            const nextPage = value.headers.get('X-Next-Page');
            if (nextPage) {
                this.gatherGroupProjects(nextPage);
            } else {
                console.log(this.projects);
            }
            this.loadedItems = this.projects.length;
            this.totalNumberOfItems = (value.headers.get('x-total'));
            this.pageCurrent = (value.headers.get('x-page'));
            this.pageTotal = (value.headers.get('x-total-pages'));

            value.body.forEach((project: { id: string; }) => this.gatherRunningPipelines(project.id));
        });
    }

    gatherRunningPipelines(projectId: string, page: string = '1'): void {
        this.gitlab.getRunningPipelinesOfProject(this.gitlabUrl, this.gitlabApiKey, projectId, page).subscribe(value => {
            this.pipelines = [...this.pipelines, ...value.body];
            const nextPage = value.headers.get('X-Next-Page');
            if (nextPage) {
                this.gatherRunningPipelines(projectId, nextPage);
            } else {
                this.changeTableContent();
            }
        });
    }

    getLoadData(): void {
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

    calcRuntime(updatedAt: any, createdAt: any): number {
        const updated = new Date(updatedAt);
        const created = new Date(createdAt);
        return (updated.getTime() - created.getTime()) / (1000 * 60) % 60;
    }

    changeTableContent(): void {
        this.pipelinesShown = this.pipelines.filter(
            (pipeline: {
                status: string;
            }) => this.statusSelected === pipeline.status);
    }

}
