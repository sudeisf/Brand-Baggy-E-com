import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
import axios from 'axios';

type User = {
    id: string,
    email: string;
    username: string;
    role: 'seller' | 'buyer' | 'admin'; 
  };


type AuthState = {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<{ error?: string } | void>;
    register: (
        email: string,
        username: string,
        password: string,
        confirm_password: string,
        role: string
      ) => Promise<{ 
        success?: boolean;
        error?: string; 
        fieldErrors?: Record<string, string> 
      }>;
      logout: () => Promise<void>;
    refreshAccessToken: () => Promise<void>;
    checkAuth: () => Promise<void>;
    hasRole: (role: User['role']) => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
                accessToken : null,
                refreshToken : null,
                user : null,
                isAuthenticated : false,
                isLoading : false,
                error :null,

                login: async (email , password) => {
                    try{
                        set({isLoading:true , error:null});
                        const response = await api.post('/accounts/login/' , {email ,password});
                        const {access , refresh , user} = response.data;
                        set(
                            {
                                accessToken : access,
                                refreshToken: refresh,
                                user: user,
                                isAuthenticated: true,
                                isLoading: false,
                            }
                        );
                        console.log(response.data);
                        return { success: true };
                    }catch(err : any){
                        const errorMsg =
                            err.response?.data?.non_field_errors?.[0] ||
                            err.response?.data?.detail ||
                            err.response?.data?.message ||
                            'Login failed';
                        set({error: errorMsg, isLoading: false});
                        return { error: errorMsg };
                    }
                } ,
                register: async (email, username, password, confirm_password, role) => {
                    try {
                      set({ isLoading: true, error: null });
                      const response = await api.post('/accounts/register/', {
                        email,
                        username,
                        password, 
                        confirm_password,
                        role
                      });
                      const { user } = response.data;
                      set({
                        user,
                        isAuthenticated: false,
                        isLoading: false
                      });
                      return { success: true };
                    } catch (error: any) {
                      let errorMsg = "Registration failed";
                      const fieldErrors: Record<string, string> = {};
                      
                      if (error.response?.data) {
                        // Handle both nested {message, code} and direct string errors
                        for (const [field, details] of Object.entries(error.response.data)) {
                          if (typeof details === 'object' && details !== null && 'message' in details) {
                            fieldErrors[field] = (details as { message: string }).message;
                          } else if (Array.isArray(details)) {
                            fieldErrors[field] = details.join(', ');
                          } else {
                            fieldErrors[field] = details as string;
                          }
                        }
                        
                        // Get first error message if no specific field errors
                        if (Object.keys(fieldErrors).length === 0 && error.response.data.message) {
                          errorMsg = error.response.data.message;
                        }
                      }
                  
                      set({ error: errorMsg, isLoading: false });
                      return { 
                        error: errorMsg,
                        fieldErrors 
                      };
                    }
                  },
                logout : async () => {
                    try{
                        set({isLoading:true , error: null});
                        const response = await api.post('accounts/logout/')
                        set({
                            isAuthenticated:false,
                            accessToken: null,
                            refreshToken:null,
                            isLoading:false,
                        })
                    }catch(error : any) {
                        set({error: error.response?.data?.message || "logout failed" , isLoading :false});
                    }

                },
                refreshAccessToken : async () => {
                    const { refreshToken } = get();
                    try {
                        const response = await api.post('/accounts/token/refresh/', { refresh: refreshToken });
                        const { access } = response.data;
                        set({ accessToken: access });
                    } catch (err: any) {
                        set({ error: 'Failed to refresh token', isAuthenticated: false });
                    }
                },
                checkAuth : async () => {
                     const { accessToken} = get();
                     if(!accessToken) {
                        set({ isAuthenticated: false });
                        return;
                     }
                     try{
                        const response = await api.get('/accounts/me' , {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        });
                        const {user} = response.data;
                        set({user , isAuthenticated: true})
                     }catch(error : any){
                        set({ isAuthenticated: false });
                     }
                },
                hasRole: (role) => {
                    const user = get().user;
                    return user?.role === role;
                  }
    }),
       {
        name : "auth-storage",
        partialize: (state) => ({
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
            user: state.user,
            isAuthenticated: state.isAuthenticated,
          })
       }
    )
)
        