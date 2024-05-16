document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('reset-password-form');
    const resetMessage = document.getElementById('reset-message');

    // Function to parse URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    // Extract required parameters from URL
    const mode = getUrlParameter('mode');
    const oobCode = getUrlParameter('oobCode');
    const apiKey = getUrlParameter('apiKey');
    const lang = getUrlParameter('lang');

    // Check if all required parameters are present
    if (mode === 'resetPassword' && oobCode && apiKey) {
        // Display message indicating that password reset is in progress
        resetMessage.textContent = "Resetting password...";

        // Call Firebase Authentication API to reset the password
        firebase.auth().verifyPasswordResetCode(oobCode)
            .then(function(email) {
                // Email verification successful
                resetForm.addEventListener('submit', function(event) {
                    event.preventDefault();

                    const newPassword = document.getElementById('new-password').value;
                    const confirmPassword = document.getElementById('confirm-password').value;

                    if (newPassword !== confirmPassword) {
                        resetMessage.textContent = "Passwords do not match!";
                        return;
                    }

                    // Reset password using Firebase Authentication API
                    firebase.auth().confirmPasswordReset(oobCode, newPassword)
                        .then(function() {
                            // Password reset successful
                            resetMessage.textContent = "Password reset successfully!";
                            resetForm.reset();
                        })
                        .catch(function(error) {
                            // Handle error
                            resetMessage.textContent = "Error: " + error.message;
                        });
                });
            })
            .catch(function(error) {
                // Handle error
                resetMessage.textContent = "Error: " + error.message;
            });
    } else {
        resetMessage.textContent = "Invalid reset password URL.";
    }
});
