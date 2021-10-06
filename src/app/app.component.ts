import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { GitlabService } from './gitlab.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
               selector:    'app-root',
               templateUrl: './app.component.html',
               styleUrls:   ['./app.component.scss']
           })
export class AppComponent implements OnInit {
    private readonly CONSTANT_ANY = 'any';
    pipelines: any[] = [];
    projects: any[] = [];
    projectsTotalNumber = 0;
    projectsCurrentLoaded = 0;
    noOfPipelinesPerStatus: any = {};
    pageCurrent = 0;
    pageTotal = 0;
    gitlabApiKey: string | undefined;
    gitlabUrl: string | undefined;
    groupId: string | undefined;
    displayedColumns: string[] = ['status', 'ref', 'web_url', 'created_at', 'updated_at', 'runtime'];
    @ViewChild(MatSort) sort: MatSort | undefined;
    pipelineStatus = new Set().add(this.CONSTANT_ANY);
    pipelineStatusSelected = '';
    dataSource = new MatTableDataSource(this.pipelines);

    constructor(private readonly gitlab: GitlabService,
                private changeDetectorRefs: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        const gitlabApiKey = localStorage.getItem('gitlabApiKey');
        const gitlabUrl = localStorage.getItem('gitlabUrl');
        const groupId = localStorage.getItem('groupId');
        const pipelineStatusSelected = localStorage.getItem('pipelineStatusSelected');
        this.gitlabApiKey = gitlabApiKey ? gitlabApiKey : undefined;
        this.gitlabUrl = gitlabUrl ? gitlabUrl : undefined;
        this.groupId = groupId ? groupId : undefined;
        this.pipelineStatusSelected = pipelineStatusSelected ? pipelineStatusSelected : '';

        if (this.gitlabUrl && this.gitlabApiKey && this.groupId) {
            this.startLoadingData();
        }
    }

    filterTable(): void {
        console.log(this.pipelineStatusSelected);
        if (this.pipelineStatusSelected === this.CONSTANT_ANY) {
            this.dataSource.filter = ''.trim().toLocaleLowerCase();
        } else {
            this.dataSource.filter = this.pipelineStatusSelected.trim().toLocaleLowerCase();
        }
        localStorage.setItem('pipelineStatusSelected', this.pipelineStatusSelected);

    }

    private gatherGroupProjects(page: string = '1'): void {
        this.gitlab.getProjectsByGroup(this.gitlabUrl, this.gitlabApiKey, this.groupId, page).subscribe(value => {
            this.projects = this.projects.concat(value.body);
            const nextPage = value.headers.get('X-Next-Page');
            if (nextPage) {
                this.gatherGroupProjects(nextPage);
            }
            this.projectsCurrentLoaded = this.projects.length;
            this.projectsTotalNumber = (value.headers.get('x-total'));
            this.pageCurrent = (value.headers.get('x-page'));
            this.pageTotal = (value.headers.get('x-total-pages'));
            value.body.forEach((project: {
                path_with_namespace: string;
                id: string;
            }) => this.gatherRunningPipelines(project.id, project.path_with_namespace));
        });
    }

    startLoadingData(): void {
        this.projects = [];
        this.pipelines = [];
        this.projectsTotalNumber = 0;
        this.pageCurrent = 0;
        this.pageTotal = 0;
        this.projectsCurrentLoaded = 0;
        this.noOfPipelinesPerStatus = {};

        if (this.gitlabUrl && this.gitlabApiKey && this.groupId) {
            localStorage.setItem('gitlabApiKey', this.gitlabApiKey);
            localStorage.setItem('gitlabUrl', this.gitlabUrl);
            localStorage.setItem('groupId', String(this.groupId));
            this.gatherGroupProjects();
        }
    }

    private gatherRunningPipelines(projectId: string, projectName: string): void {
        this.gitlab.getRunningPipelinesOfProject(this.gitlabUrl, this.gitlabApiKey, projectId).subscribe(value => {
            value.body.forEach((pipeline: { [x: string]: string; }) => {
                pipeline.projectName = projectName;
                this.pipelineStatus.add(pipeline.status);
                this.noOfPipelinesPerStatus[pipeline.status] = this.noOfPipelinesPerStatus[pipeline.status]
                                                               ? this.noOfPipelinesPerStatus[pipeline.status] + 1 : 1;
            });
            this.pipelines = this.pipelines.concat(this.calcRuntime2(value.body));
            this.refreshMatTableDataSource();
        });
    }

    private calcRuntime2(pipelines: any): any {
        pipelines.forEach((pipeline: { updated_at: string | number | Date; created_at: string | number | Date; runtime: number; }) => {
            const updated = new Date(pipeline.updated_at);
            const created = new Date(pipeline.created_at);
            pipeline.runtime = (updated.getTime() - created.getTime()) / (1000 * 60) % 60;
        });
        return pipelines;
    }

    private refreshMatTableDataSource(): void {
        this.dataSource = new MatTableDataSource(this.pipelines);
        this.dataSource.filter = this.pipelineStatusSelected !== this.CONSTANT_ANY ? this.pipelineStatusSelected : '';
        if (this.sort) {
            this.sort.sort({id: 'status', start: 'desc', disableClear: false});
            this.dataSource.sort = this.sort;
        }
        this.changeDetectorRefs.detectChanges();
    }

}
