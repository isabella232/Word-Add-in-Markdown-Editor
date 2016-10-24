﻿import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GithubService } from '../shared/services';
import { Utilities } from '../shared/helpers';
import './login.component.scss';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html'
})
export class LoginComponent {
    loading: string;
    progress: boolean;

    constructor(
        private _githubService: GithubService,
        private _router: Router
    ) {
    }

    login() {
        this.loading = "Loading your GitHub profile";
        this.progress = true;

        this._githubService.login()
            .then(profile => {
                this.loading = null;
                this.progress = false;
                this._router.navigate([''])
            })
            .catch(error => {
                debugger;
                this.loading = "Login failed. Please try again later."
                this.progress = false;
                Utilities.error(error);
            });
    }
}