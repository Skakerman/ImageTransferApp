import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { SinglePageComponent } from "./single/single.component";

export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    // { path: "", redirectTo: "/single/123/123", pathMatch: "full" },
    { path: "home", loadChildren: "./home/home.module#HomeModule" },
    { path: "single/:index", component: SinglePageComponent}
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
