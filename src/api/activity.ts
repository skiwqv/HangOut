import api from './index'
import type { Activity,Activities } from '@/types/activity'


export const activityApi = {
    createActivity(payload: Activity) {
        return api.post<Activity>('/activities/', payload);
    },
    getActivities(limit: number) {
        return api.get<Activities>('/activities/feed', { params: { limit } });
    },
    getActivityById(id: number) {
        return api.get<Activity>(`/activities/${id}/`);
    },
    updateActivity(id: number, payload: Activity) {
        return api.patch<Activity>(`/activities/${id}/`, payload);
    },
    deleteActivity(id: string) {
        return api.delete(`/activities/${id}/`);
    }
};