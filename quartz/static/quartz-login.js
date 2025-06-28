// ========================================
// QUARTZ LOGIN SYSTEM - INTEGRATION SCRIPT
// ========================================
// Tambahkan script ini ke quartz.config.ts atau sebagai file terpisah

(function() {
    'use strict';
    
    // ========================================
    // KONFIGURASI
    // ========================================
    const CONFIG = {
        credentials: {
            'admin': 'password123',
            'user1': 'mypassword',
            'guest': '12345'
        },
        sessionKey: 'quartzAuth',
        sessionDuration: 24 * 60 * 60 * 1000, // 24 jam
        debug: true
    };

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    function log(msg, ...args) {
        if (CONFIG.debug) console.log(`[QuartzAuth] ${msg}`, ...args);
    }

    function createLoginOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'quartz-login-overlay';
        overlay.innerHTML = `
            <style>
                #quartz-login-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                }
                
                .quartz-login-container {
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
                    width: 90%;
                    max-width: 400px;
                    text-align: center;
                }
                
                .quartz-login-title {
                    color: #333;
                    margin-bottom: 30px;
                    font-size: 28px;
                    font-weight: 600;
                }
                
                .quartz-form-group {
                    margin-bottom: 20px;
                    text-align: left;
                }
                
                .quartz-form-label {
                    display: block;
                    margin-bottom: 8px;
                    color: #555;
                    font-weight: 500;
                }
                
                .quartz-form-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e1e5e9;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: border-color 0.3s ease;
                    box-sizing: border-box;
                }
                
                .quartz-form-input:focus {
                    outline: none;
                    border-color: #667eea;
                }
                
                .quartz-login-btn {
                    width: 100%;
                    padding: 12px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }
                
                .quartz-login-btn:hover {
                    transform: translateY(-2px);
                }
                
                .quartz-login-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .quartz-message {
                    margin-top: 15px;
                    padding: 10px;
                    border-radius: 6px;
                    font-size: 14px;
                    display: none;
                }
                
                .quartz-error {
                    color: #e74c3c;
                    background: #ffeaea;
                }
                
                .quartz-success {
                    color: #27ae60;
                    background: #eafaf1;
                }
                
                .quartz-demo {
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    font-size: 12px;
                    color: #888;
                }
                
                .quartz-demo button {
                    margin-top: 5px;
                    padding: 5px 10px;
                    background: #f8f9fa;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                }
                
                #quartz-logout-btn {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    z-index: 1000;
                    font-size: 14px;
                    display: none;
                }
                
                #quartz-logout-btn:hover {
                    background: #c0392b;
                }
                
                .quartz-authenticated #quartz-logout-btn {
                    display: block !important;
                }
                
                .quartz-authenticated #quartz-login-overlay {
                    display: none !important;
                }
            </style>
            
            <div class="quartz-login-container">
                <h1 class="quartz-login-title">🔒 Private Notes</h1>
                <form id="quartz-auth-form">
                    <div class="quartz-form-group">
                        <label for="quartz-username" class="quartz-form-label">Username</label>
                        <input type="text" id="quartz-username" class="quartz-form-input" required autocomplete="username">
                    </div>
                    <div class="quartz-form-group">
                        <label for="quartz-password" class="quartz-form-label">Password</label>
                        <input type="password" id="quartz-password" class="quartz-form-input" required autocomplete="current-password">
                    </div>
                    <button type="submit" class="quartz-login-btn" id="quartz-login-button">
                        Masuk
                    </button>
                    <div class="quartz-message quartz-error" id="quartz-error-message"></div>
                    <div class="quartz-message quartz-success" id="quartz-success-message"></div>
                </form>
                
                <div class="quartz-demo">
                    Demo: admin / password123<br>
                    <button type="button" onclick="quartzLogin.quickLogin()">Quick Login</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Tambahkan logout button
        const logoutBtn = document.createElement('button');
        logoutBtn.id = 'quartz-logout-btn';
        logoutBtn.innerHTML = 'Logout';
        logoutBtn.onclick = () => quartzLogin.logout();
        document.body.appendChild(logoutBtn);
        
        log('Login overlay created');
    }

    // ========================================
    // AUTH FUNCTIONS
    // ========================================
    const quartzLogin = {
        validateCredentials(username, password) {
            return CONFIG.credentials[username?.trim()] === password;
        },

        isLoggedIn() {
            try {
                const authData = localStorage.getItem(CONFIG.sessionKey);
                if (!authData) return false;

                const { timestamp } = JSON.parse(authData);
                const isValid = (Date.now() - timestamp) < CONFIG.sessionDuration;
                
                if (!isValid) {
                    localStorage.removeItem(CONFIG.sessionKey);
                }
                
                return isValid;
            } catch (error) {
                log('Error checking login:', error);
                return false;
            }
        },

        saveSession(username) {
            const authData = {
                user: username,
                timestamp: Date.now()
            };
            localStorage.setItem(CONFIG.sessionKey, JSON.stringify(authData));
            log('Session saved for:', username);
        },

        clearSession() {
            localStorage.removeItem(CONFIG.sessionKey);
            log('Session cleared');
        },

        showLoginForm() {
            document.body.classList.remove('quartz-authenticated');
            const overlay = document.getElementById('quartz-login-overlay');
            if (overlay) {
                overlay.style.display = 'flex';
            }
        },

        hideLoginForm() {
            document.body.classList.add('quartz-authenticated');
            const overlay = document.getElementById('quartz-login-overlay');
            if (overlay) {
                overlay.style.display = 'none';
            }
        },

        showMessage(message, isError = false) {
            const errorDiv = document.getElementById('quartz-error-message');
            const successDiv = document.getElementById('quartz-success-message');
            
            if (isError) {
                if (errorDiv) {
                    errorDiv.textContent = message;
                    errorDiv.style.display = 'block';
                }
                if (successDiv) {
                    successDiv.style.display = 'none';
                }
            } else {
                if (successDiv) {
                    successDiv.textContent = message;
                    successDiv.style.display = 'block';
                }
                if (errorDiv) {
                    errorDiv.style.display = 'none';
                }
            }

            setTimeout(() => {
                if (errorDiv) errorDiv.style.display = 'none';
                if (successDiv) successDiv.style.display = 'none';
            }, 3000);
        },

        handleLogin(event) {
            event.preventDefault();
            
            const username = document.getElementById('quartz-username')?.value?.trim();
            const password = document.getElementById('quartz-password')?.value;
            const button = document.getElementById('quartz-login-button');

            if (!username || !password) {
                this.showMessage('Mohon isi semua field', true);
                return;
            }

            // Set loading state
            if (button) {
                button.disabled = true;
                button.textContent = 'Memproses...';
            }

            setTimeout(() => {
                if (this.validateCredentials(username, password)) {
                    log('Login successful');
                    this.saveSession(username);
                    this.showMessage('Login berhasil!');
                    
                    setTimeout(() => {
                        this.hideLoginForm();
                        if (button) {
                            button.disabled = false;
                            button.textContent = 'Masuk';
                        }
                    }, 1000);
                } else {
                    log('Login failed');
                    this.showMessage('Username atau password salah!', true);
                    if (button) {
                        button.disabled = false;
                        button.textContent = 'Masuk';
                    }
                }
            }, 500);
        },

        logout() {
            log('Logging out');
            this.clearSession();
            this.showLoginForm();
            
            // Reset form
            const form = document.getElementById('quartz-auth-form');
            if (form) form.reset();
        },

        quickLogin() {
            const usernameField = document.getElementById('quartz-username');
            const passwordField = document.getElementById('quartz-password');
            if (usernameField && passwordField) {
                usernameField.value = 'admin';
                passwordField.value = 'password123';
                
                const form = document.getElementById('quartz-auth-form');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        },

        init() {
            log('Initializing Quartz Login System');
            
            // Tunggu sampai DOM ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.init());
                return;
            }

            // Cek apakah overlay sudah ada
            if (document.getElementById('quartz-login-overlay')) {
                log('Login system already initialized');
                return;
            }

            // Buat overlay
            createLoginOverlay();

            // Setup event listeners
            const form = document.getElementById('quartz-auth-form');
            if (form) {
                form.addEventListener('submit', (e) => this.handleLogin(e));
            }

            // Cek status login
            if (this.isLoggedIn()) {
                this.hideLoginForm();
            } else {
                this.showLoginForm();
                
                // Focus username field
                setTimeout(() => {
                    const usernameField = document.getElementById('quartz-username');
                    if (usernameField) usernameField.focus();
                }, 100);
            }

            // Handle page visibility
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && !this.isLoggedIn()) {
                    this.showLoginForm();
                }
            });

            log('Quartz Login System ready');
        }
    };

    // ========================================
    // AUTO INIT
    // ========================================
    // Tunggu sampai Quartz selesai load
    if (typeof window !== 'undefined') {
        // Expose globally untuk debugging
        window.quartzLogin = quartzLogin;
        
        // Init setelah delay kecil untuk memastikan Quartz sudah load
        setTimeout(() => {
            quartzLogin.init();
        }, 100);
    }

    log('Quartz Login Script loaded');
})();