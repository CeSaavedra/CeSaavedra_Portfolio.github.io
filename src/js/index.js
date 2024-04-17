document.getElementById('title-btn').addEventListener('click', function() {
    var titlePage = document.getElementById('title-page');
    titlePage.style.opacity = '0';
    setTimeout(function(){ titlePage.style.display = 'none'; }, 1000);
});