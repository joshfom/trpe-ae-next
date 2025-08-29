'use client';

import React, { useState, useEffect, ReactNode } from 'react';

interface AuthWrapperProps {
    children: (user: any) => ReactNode;
    fallback?: ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children, fallback = null }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/auth/session');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.log('Not authenticated');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    if (loading) {
        return <>{fallback}</>;
    }

    return <>{children(user)}</>;
};

export default AuthWrapper;
