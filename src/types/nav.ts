import type { Component } from "vue";

export interface NavItem {
    id: string,
    title: string,
    hasNotif?:boolean,
    requiresAuth?:boolean,
    icon: Component

}