import { useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";




const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [user_loading, setLoading] = useState(true);

      const logout = () => {
            localStorage.removeItem("data");
            setUser(null);
      }

      useEffect(() => {
            const userCookieValue = localStorage.getItem('data');

            if (userCookieValue) {
                  try {
                        const decryptedUser = JSON.parse(userCookieValue);
                        setUser(decryptedUser);
                  } catch (err) {
                        console.error('Failed to parse decrypted cookie data:', err);
                        setUser(null);
                  }
            }

            setLoading(false);
      }, []);

      const contextValue = {
            user,
            setUser,
            user_loading,
            logout,
      };
      console.log({ user });

      return (
            <AuthContext.Provider value={contextValue}>
                  {children}
            </AuthContext.Provider>
      );
};


export default AuthProvider;
