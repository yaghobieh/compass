import { R as RouteConfig } from '../index-BL1otzyT.js';
import { S as SSRContext, R as RouteParams, a as RouteContext, b as SSRRenderResult } from '../core-DKMffvjs.js';
import 'react';

declare const createSSRContext: (url: string, routes: RouteConfig[]) => SSRContext;
declare const matchSSRRoute: (routes: RouteConfig[], url: string) => {
    route: RouteConfig;
    params: RouteParams;
    matched: RouteConfig[];
} | null;
declare const loadRouteData: (routes: RouteConfig[], url: string, request?: Request) => Promise<Record<string, unknown>>;
declare const getSSRHead: (route: RouteContext | null) => SSRRenderResult["head"];
declare const renderHeadToString: (head: SSRRenderResult["head"]) => string;
declare const createServerRouter: (routes: RouteConfig[]) => {
    match: (url: string) => {
        route: RouteConfig;
        params: RouteParams;
        matched: RouteConfig[];
    } | null;
    loadData: (url: string, request?: Request) => Promise<Record<string, unknown>>;
    getHead: (route: RouteContext | null) => {
        title?: string;
        meta: Array<{
            name: string;
            content: string;
        }>;
        links: Array<{
            rel: string;
            href: string;
        }>;
    };
};
declare const handleRequest: (request: Request, routes: RouteConfig[]) => Promise<{
    route: RouteContext | null;
    loaderData: Record<string, unknown>;
    head: SSRRenderResult["head"];
    redirect?: string;
    status: number;
}>;

export { createSSRContext, createServerRouter, getSSRHead, handleRequest, loadRouteData, matchSSRRoute, renderHeadToString };
