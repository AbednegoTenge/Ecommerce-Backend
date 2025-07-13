const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

if (password && confirmPassword) {
    confirmPassword.addEventListener('input', function() {
        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords do not match");
        } else {
            confirmPassword.setCustomValidity("");
        }
    });
}