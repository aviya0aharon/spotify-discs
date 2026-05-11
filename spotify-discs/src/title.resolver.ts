import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";

export const titleResolver: ResolveFn<string> = (route) => route.queryParams['title'];
