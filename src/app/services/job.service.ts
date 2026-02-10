import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Job, JobSearchParams, JobSearchResult } from '../models/job.model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = 'https://data.usajobs.gov/api/Search';
  private http = inject(HttpClient);

  private headers = new HttpHeaders({
    'Authorization-Key': 'j1Zt0aPALvhhOlj2iFVpt6EQWX4/5AUWGPSc6/ULco8=',
    'User-Agent': 'j1Zt0aPALvhhOlj2iFVpt6EQWX4/5AUWGPSc6/ULco8='
  });

  searchJobs(params: JobSearchParams): Observable<JobSearchResult> {
    const httpParams: Record<string, string> = {
      Page: params.page.toString(),
      ResultsPerPage: params.resultsPerPage.toString()
    };

    if (params.keyword) {
      httpParams['Keyword'] = params.keyword;
    }
    if (params.location) {
      httpParams['LocationName'] = params.location;
    }

    return this.http
      .get<any>(this.apiUrl, { headers: this.headers, params: httpParams })
      .pipe(
        map((response) => {
          const items = response.SearchResult?.SearchResultItems || [];
          const jobs: Job[] = items
            .map((item: any) => this.mapToJob(item))
            .filter((job: Job) => {
              if (!params.keyword) return true;
              return job.title.toLowerCase().includes(params.keyword.toLowerCase());
            })
            .sort((a: Job, b: Job) =>
              new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
            );

          return {
            jobs,
            totalResults: response.SearchResult?.SearchResultCountAll || 0,
            currentPage: params.page,
            resultsPerPage: params.resultsPerPage
          } as JobSearchResult;
        })
      );
  }

  private mapToJob(item: any): Job {
    const desc = item.MatchedObjectDescriptor;
    const remuneration = desc.PositionRemuneration?.[0];
    let salary: string | null = null;

    if (remuneration) {
      salary = `$${Number(remuneration.MinimumRange).toLocaleString()} - $${Number(remuneration.MaximumRange).toLocaleString()} ${remuneration.Description}`;
    }

    return {
      id: item.MatchedObjectId,
      title: desc.PositionTitle,
      company: desc.OrganizationName,
      location: desc.PositionLocationDisplay,
      publishDate: desc.PublicationStartDate,
      description: desc.UserArea?.Details?.JobSummary || desc.QualificationSummary?.substring(0, 200) || '',
      url: desc.PositionURI,
      salary,
      apiSource: 'usajobs'
    };
  }
}
