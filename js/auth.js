const token = localStorage.getItem('todoAuthToken')

if (!token || token === '') {
    alert('Unauthorized access to this page Login first')
    location.replace('/')
}