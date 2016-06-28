import {Component} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {OnActivate, Router, RouteSegment, Routes, ROUTER_DIRECTIVES} from '@angular/router';
import {GithubService, HamburgerService, WordService, MarkdownService, IRepository, IBreadcrumb, IBranch} from '../shared/services';
import {FileTreeComponent} from './file-tree.component';
import {FileDetailComponent} from './file-detail.component';
import {Path, Utils} from '../shared/helpers';
import {SafeNamesPipe} from '../shared/pipes';
import {BreadcrumbComponent} from '../components/breadcrumb/breadcrumb.component';

let view = 'file-list';
@Component({
    templateUrl: Path.template(view, 'file'),
    styleUrls: [Path.style(view, 'file')],
    pipes: [SafeNamesPipe],
    directives: [ROUTER_DIRECTIVES, BreadcrumbComponent],
    providers: [WordService, MarkdownService]
})

@Routes([
    {
        path: '/tree/:path',
        component: FileTreeComponent
    },
    {
        path: '/detail/:path',
        component: FileDetailComponent
    }
])

export class FileListComponent implements OnActivate {
    selectedOrg: string;
    selectedRepoName: string;
    selectedBranch: IBranch;
    branches: Observable<IBranch[]>;

    constructor(
        private _githubService: GithubService,
        private _hamburgerService: HamburgerService,
        private _router: Router
    ) {
        
    }

    selectBranch(branchName: string) {
        this._router.navigate(['/files', this.selectedOrg, this.selectedRepoName, branchName, 'tree', null]);
        this.selectedBranch.name = branchName;
    }

    routerOnActivate(current: RouteSegment) {
        var stringMy = current.getParam('repo');
        this.selectedRepoName = current.getParam('repo');
        this.selectedOrg = current.getParam('org');
        this.selectedBranch = <IBranch>{
            name: current.getParam('branch') || 'master'
        }
        this.branches = this._githubService.branches(this.selectedOrg, this.selectedRepoName)
    }

    navigate(breadcrumb: IBreadcrumb) {
        var path = Utils.isNull(breadcrumb.href) ? null : encodeURIComponent(breadcrumb.href);
        this._router.navigate(['/files', this.selectedOrg, this.selectedRepoName, this.selectedBranch.name, 'tree', path]);
    }

    showMenu() {
        this._hamburgerService.showMenu();
    }    
}