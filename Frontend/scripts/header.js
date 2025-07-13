window.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:3000/api/loggedin', {
        credentials: 'include'
    })
    .then(res => res.json())
    .then(data => {
        const userLinkDiv = document.getElementById('userLink');

        if (data.loggedIn) {
            userLinkDiv.innerHTML = `
            <div class="logout-link">
                <a href="http://localhost:3000/api/logout">
                    <button class="logout-button">Logout</button>
                </a>
            </div>`;

            document.getElementById('logout').addEventListener('click', async () => {
                await fetch('http://localhost:3000/api/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                window.location.reload();
            });
        }
    });
});