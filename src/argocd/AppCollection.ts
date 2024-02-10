import { App } from './App';
import * as core from '@actions/core';

export class AppCollection {
  apps: App[];

  constructor(apps: App[]) {
    this.apps = apps;
  }

  filterByExcludedPath(excludedPaths: string[]): AppCollection {
    if (excludedPaths.length === 0) {
      return this;
    }

    return new AppCollection(
      this.apps.filter(app => {
        return !excludedPaths.includes(app.spec.source.path);
      })
    );
  }

  filterByRepo(repoMatch: string): AppCollection {
    core.info(`Filtering ${this.apps.length} apps by repo: ${repoMatch}`);
    return new AppCollection(
      this.apps.filter(app => {
        return app.spec.source.repoURL.includes(repoMatch);
      })
    );
  }

  filterByTargetRevision(targetRevisions: string[] = ['master', 'main', 'HEAD']): AppCollection {
    core.info(`Filtering ${this.apps.length} apps to target revision: ${targetRevisions}`);
    return new AppCollection(
      this.apps.filter(app => {
        return targetRevisions.includes(app.spec.source.targetRevision);
      })
    );
  }

  getAppByName(name: string): App | undefined {
    return this.apps.find(app => {
      return name === app.metadata.name;
    });
  }
}
