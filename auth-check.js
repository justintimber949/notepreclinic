// auth-check.js - Tambahkan script ini ke halaman utama Quartz Anda

(function() {
    const SESSION_KEY = 'quartzAuthenticated';
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 jam
    const LOGIN_PAGE = './login.html'; // Sesuaikan dengan path login page Anda
    
    function checkAuthentication() {
        const authData = localStorage.getItem(SESSION_KEY);
        
        if (!authData) {
            // No authentication data, redirect to login
            window.location.href = LOGIN_PAGE;
            return false;
        }
        
        try {
            const { authenticated, timestamp } = JSON.parse(authData);
            const now = new Date().getTime();
            
            // Check if session is still valid
            if (!authenticated || (now - timestamp > SESSION_DURATION)) {
                // Session expired or invalid
                localStorage.removeItem(SESSION_KEY);
                window.location.href = LOGIN_PAGE;
                return false;
            }
            
            return true;
        } catch (e) {
            // Invalid data format
            localStorage.removeItem(SESSION_KEY);
            window.location.href = LOGIN_PAGE;
            return false;
        }
    }
    
    // Add logout button to the page
    function addLogoutButton() {
        const logoutBtn = document.createElement('button');
        logoutBtn.innerHTML = '🚪 Logout';
        logoutBtn.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #e74c3c;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            z-index: 1000;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        `;
        
        logoutBtn.onclick = function() {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem(SESSION_KEY);
                window.location.href = LOGIN_PAGE;
            }
        };
        
        document.body.appendChild(logoutBtn);
    }
    
    // Run authentication check when page loads
    document.addEventListener('DOMContentLoaded', function() {
        if (checkAuthentication()) {
            addLogoutButton();
        }
    });
    
    // Also check immediately if DOM is already loaded
    if (document.readyState === 'loading') {
        // DOM is still loading
    } else {
        // DOM has already loaded
        if (checkAuthentication()) {
            addLogoutButton();
        }
    }
})();