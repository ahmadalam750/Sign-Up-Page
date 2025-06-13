// Check if user is already logged in
        document.addEventListener('DOMContentLoaded', function() {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                showDashboard();
            }
        });

        // Show/Hide forms
        function showLogin() {
            document.getElementById('loginForm').classList.remove('hidden');
            document.getElementById('signupForm').classList.add('hidden');
            document.getElementById('dashboard').classList.add('hidden');
            clearMessages();
        }

        function showSignup() {
            document.getElementById('signupForm').classList.remove('hidden');
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('dashboard').classList.add('hidden');
            clearMessages();
        }

        function showDashboard() {
            document.getElementById('dashboard').classList.remove('hidden');
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('signupForm').classList.add('hidden');
            loadUserInfo();
        }

        // Clear messages
        function clearMessages() {
            document.getElementById('loginMessage').innerHTML = '';
            document.getElementById('signupMessage').innerHTML = '';
        }

        // Show message
        function showMessage(elementId, message, type) {
            const messageElement = document.getElementById(elementId);
            messageElement.innerHTML = `<div class="message ${type}">${message}</div>`;
        }

        // Password strength checker
        document.getElementById('signupPassword').addEventListener('input', function() {
            const password = this.value;
            const strengthElement = document.getElementById('passwordStrength');
            
            if (password.length === 0) {
                strengthElement.innerHTML = '';
                return;
            }
            
            let strength = 0;
            let feedback = [];
            
            if (password.length >= 8) strength++;
            else feedback.push('at least 8 characters');
            
            if (/[a-z]/.test(password)) strength++;
            else feedback.push('lowercase letter');
            
            if (/[A-Z]/.test(password)) strength++;
            else feedback.push('uppercase letter');
            
            if (/[0-9]/.test(password)) strength++;
            else feedback.push('number');
            
            if (/[^A-Za-z0-9]/.test(password)) strength++;
            else feedback.push('special character');
            
            let strengthText = '';
            let strengthClass = '';
            
            if (strength < 3) {
                strengthText = 'Weak';
                strengthClass = 'strength-weak';
            } else if (strength < 5) {
                strengthText = 'Medium';
                strengthClass = 'strength-medium';
            } else {
                strengthText = 'Strong';
                strengthClass = 'strength-strong';
            }
            
            strengthElement.innerHTML = `<span class="${strengthClass}">Password strength: ${strengthText}</span>`;
            if (feedback.length > 0 && strength < 5) {
                strengthElement.innerHTML += `<br><small>Add: ${feedback.join(', ')}</small>`;
            }
        });

        // Signup form handler
        document.getElementById('signupFormElement').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validation
            if (!name || !email || !password || !confirmPassword) {
                showMessage('signupMessage', 'Please fill in all fields', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('signupMessage', 'Passwords do not match', 'error');
                return;
            }
            
            if (password.length < 6) {
                showMessage('signupMessage', 'Password must be at least 6 characters long', 'error');
                return;
            }
            
            // Check if user already exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(user => user.email === email)) {
                showMessage('signupMessage', 'User with this email already exists', 'error');
                return;
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                name: name,
                email: email,
                password: password, // In real app, this should be hashed
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            showMessage('signupMessage', 'Account created successfully! Please login.', 'success');
            
            // Clear form
            document.getElementById('signupFormElement').reset();
            document.getElementById('passwordStrength').innerHTML = '';
            
            // Switch to login after 2 seconds
            setTimeout(() => {
                showLogin();
            }, 2000);
        });

        // Login form handler
        document.getElementById('loginFormElement').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                showMessage('loginMessage', 'Please fill in all fields', 'error');
                return;
            }
            
            // Check credentials
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                // Login successful
                localStorage.setItem('currentUser', JSON.stringify(user));
                showMessage('loginMessage', 'Login successful!', 'success');
                
                setTimeout(() => {
                    showDashboard();
                }, 1000);
            } else {
                showMessage('loginMessage', 'Invalid email or password', 'error');
            }
        });

        // Load user info in dashboard
        function loadUserInfo() {
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser) {
                document.getElementById('userName').textContent = currentUser.name;
                document.getElementById('userEmail').textContent = currentUser.email;
                document.getElementById('memberSince').textContent = new Date(currentUser.createdAt).toLocaleDateString();
            }
        }

        // Logout function
        function logout() {
            localStorage.removeItem('currentUser');
            showLogin();
            // Clear login form
            document.getElementById('loginFormElement').reset();
        }

        // Demo function to show all registered users (for testing)
        function showAllUsers() {
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            console.log('All registered users:', users);
        }
