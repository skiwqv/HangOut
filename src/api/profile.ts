import api from './index'
import type { updateUserPayload } from '../types/user';

interface GetAvatar {
    avatar:string
}

export const profileApi = {
  changeAvatar(avatar: File) {
    const formData = new FormData();
    
    formData.append('file', avatar);

    return api.patch<GetAvatar>('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    });
  },
    changeBanner(banner: File) {
    const formData = new FormData();
    
    formData.append('file', banner);

    return api.patch('/user/banner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' 
      }
    });
  },
  updateUser (payload:updateUserPayload){
    return api.patch('/user/me', payload);
  }
}