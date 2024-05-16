document.getElementById('resetPasswordForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const messageElement = document.getElementById('message');

    if (newPassword !== confirmPassword) {
        messageElement.textContent = 'Passwords do not match';
        messageElement.style.color = 'red';
        return;
    }

    if (!isValidPassword(newPassword)) {
        messageElement.textContent = 'Password must be at least 8 characters long and contain both letters and numbers';
        messageElement.style.color = 'red';
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const oobCode = urlParams.get('oobCode');

    if (!oobCode) {
        messageElement.textContent = 'Invalid or missing password reset code.';
        messageElement.style.color = 'red';
        return;
    }

    firebase.auth().confirmPasswordReset(oobCode, newPassword)
        .then(() => {
            messageElement.textContent = 'Password has been reset successfully!';
            messageElement.style.color = 'green';
        })
        .catch((error) => {
            messageElement.textContent = error.message;
            messageElement.style.color = 'red';
        });
});

function isValidPassword(password) {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return regex.test(password);
}
