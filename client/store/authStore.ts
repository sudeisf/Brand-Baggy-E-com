import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/axios';
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
    otpEmail : string | null;
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
    logout: () =>  Promise<{
        success?: boolean;
        error?: string; 
        fieldErrors?: Record<string, string> } | void>;
    sendEmail : (email :string) => Promise<{
        success?: boolean;
        error?: string; 
        fieldErrors?: Record<string, string> } | void>;
    otpVerify : (otp : string) => Promise<{
        success?: boolean;
        error?: string; 
        fieldErrors?: Record<string, string> } | void>;
    newPassword : (password : string , confirm_password : string) => Promise<{
        success?: boolean;
        error?: string; 
        fieldErrors?: Record<string, string> } | void>;
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
                otpEmail:null,
                login: async (email , password) => {
                    try{
                        set({isLoading:true , error:null});
                        const response = await api.post('/accounts/login/' , {email ,password},
                        {
                            skipAuth: true
                        } as any);
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
                      },
                      {
                        skipAuth: true
                      } as any);
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
                    const { refreshToken } = get();
                    console.log(refreshToken);
                    try {
                        set({ isLoading: true, error: null });
                       const response = await api.post('accounts/logout/', { refresh: refreshToken });
                       if(response.status === 205){
                        set({
                            isLoading: false,
                            isAuthenticated: false,
                            accessToken: null,
                            refreshToken: null,
                            user: null,
                        });
                        return { success: true };
                       }
                    } catch (error: any) {
                        return { error: error.response?.data?.message || "Logout failed" };
                    }
                },
                sendEmail: async (email) =>{
                    try{
                        set({isLoading:true , error:null});
                        const response = await api.post(
                            "accounts/otp/generate/", 
                            { email },
                            {
                                skipAuth: true
                            } as any
                        );
                      
                        set({
                            isLoading:false,
                            error:null,
                            otpEmail : email
                        });

                        return { success: true };
                    } catch (error: any){
                        let errorMsg = "sending email failed";
                        const fieldErrors : Record<string,string> = {}

                        if(error?.response?.data){

                            // Handle array format errors (like {"email": ["Error message"]})
                            if (Array.isArray(error.response.data.email)) {
                                fieldErrors.email = error.response.data.email.join(', ');
                            }
                            // Handle object format errors (like {"email": "Error message"})
                            else if (typeof error.response.data.email === 'string') {
                                fieldErrors.email = error.response.data.email;
                            }
                            // Handle general message
                            else if (error.response.data.message) {
                                errorMsg = error.response.data.message;
                            }
                            // Handle non-field errors
                            else if (error.response.data.detail) {
                                errorMsg = error.response.data.detail;
                            }
                        }
                        set({ error: errorMsg, isLoading: false });
                        return { 
                            error: errorMsg,
                            fieldErrors 
                        };


                    }
                },
                otpVerify : async (otp) => {
                    const {otpEmail} = get();
                    if (!otpEmail) {
                        set({ 
                            isLoading: false,
                            error: "No email associated with this OTP request" 
                        });
                        console.log("No email associated with this OTP request");
                        return { 
                            error: "No email associated with this OTP request" 
                        };
                    }
                    try{
                        set({isLoading: true, error: null});
                        const response  = await api.post('accounts/otp/verify/',
                            {
                               email : otpEmail,
                               otp
                            },
                            {
                                skipAuth: true
                            } as any
                        );
                       
                        set({
                            isLoading: false,
                            error: null,
                            otpEmail: otpEmail
                        });
                        return {
                            success: true,
                            email: response.data.email
                        }
                    }catch(error : any){
                        let errorMsg = "OTP verification failed";
                        const fieldErrors: Record<string, string> = {};
                
                        if (error?.response?.data) {
                            // Handle OTP-specific errors first
                            if (error.response.data.otp) {
                                fieldErrors.otp = Array.isArray(error.response.data.otp) 
                                    ? error.response.data.otp.join(', ')
                                    : error.response.data.otp;
                            }
                            
                            // Then handle email errors
                            if (error.response.data.email) {
                                fieldErrors.email = Array.isArray(error.response.data.email) 
                                    ? error.response.data.email.join(', ')
                                    : error.response.data.email;
                            }
                
                            // Fallback to general errors
                            errorMsg = error.response.data.detail || 
                                      error.response.data.message || 
                                      errorMsg;
                        }
                
                        set({ 
                            error: errorMsg, 
                            isLoading: false 
                        });
                        
                        return { 
                            error: errorMsg,
                            fieldErrors 
                        };
                    }
                },
                newPassword : async (password , confirm_password) => {
                    const {otpEmail} = get();
                    if (!otpEmail) {
                        set({ 
                            isLoading: false,
                            error: "No email associated with this OTP request" 
                        });
                        console.log("No email associated with this OTP request");
                    }
                    
                    try{
                        set({isLoading: true, error: null});
                        const response = await api.post('accounts/reset-password/', {
                            email: otpEmail,
                            new_password: password,
                            confirm_password: confirm_password
                            },
                        {
                            skipAuth: true
                        } as any);
                        set({
                            isLoading: false,
                            error: null,
                            otpEmail: null
                        });
                        return {
                            success: true,  
                            email: response.data.email
                        }
                    }catch(error : any){
                        let errorMsg = "New password failed";
                        const fieldErrors: Record<string, string> = {};
                
                        if (error?.response?.data) {
                            // Handle OTP-specific errors first
                            if (error.response.data.password) {
                                fieldErrors.password = Array.isArray(error.response.data.password) 
                                    ? error.response.data.password.join(', ')
                                    : error.response.data.password;
                            }
                            if (error.response.data.new_password) {
                                fieldErrors.new_password = Array.isArray(error.response.data.new_password) 
                                    ? error.response.data.new_password.join(', ')
                                    : error.response.data.new_password;
                            }
                            
                            // Then handle email errors
                            if (error.response.data.email) {
                                fieldErrors.email = Array.isArray(error.response.data.email) 
                                    ? error.response.data.email.join(', ')
                                    : error.response.data.email;
                            }
                
                            // Fallback to general errors
                            errorMsg = error.response.data.detail || 
                                      error.response.data.message || 
                                      errorMsg;
                        }
                
                        set({ 
                            error: errorMsg, 
                            isLoading: false 
                        });
                        
                        return { 
                            error: errorMsg,
                            fieldErrors 
                        };}
                    }
                ,refreshAccessToken : async () => {
                    const { refreshToken } = get();
                    try {
                        const response = await api.post('accounts/token/refresh/', { refresh: refreshToken });
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
        