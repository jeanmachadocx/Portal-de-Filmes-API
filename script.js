// Global

var popular = [];
getPopularMovies();
hideSearch();
var slideIndex = 0;

const searchInput = document.getElementById('search');
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        search();
    }
});

// Popular

function getPopularMovies() {
    httpGetAsync('https://api.themoviedb.org/3/movie/popular?api_key=2566edc9399e071781922d18c000830b&language=pt-BR&page=1', getPopularMoviesCallback);
}

function getPopularMoviesCallback (response) {
    popular = JSON.parse(response).results.splice(0, 6);
    showSlides(); 
}

function searchPopular () {
    const ano = new Date(popular[slideIndex].release_date).getUTCFullYear();
    openGoogleSearch(ano, popular[slideIndex].title);
}

// Search

function search() {
    const textoPesquisa = document.getElementById('search').value;

    if (!isNullOrUndefinedOrEmpty(textoPesquisa)) {
        const textoUri = encodeURIComponent(textoPesquisa);
        httpGetAsync(`https://api.themoviedb.org/3/search/movie?api_key=2566edc9399e071781922d18c000830b&language=pt-BR&page=1&include_adult=false&query=${textoUri}`, searchCallback);
    }
}

function searchCallback (response) {
    let searchContent = document.getElementById('search-content');
    searchContent.innerHTML = '';
    const busca = JSON.parse(response).results;
    
    if (busca.length > 0) {
        busca[0].index = 0;
        busca.forEach(result => {
            let div = document.createElement('div');
            div.className = 'row linha-busca';
            div.style.marginTop = '30px';
            if (result.index != 0) {
                div.style.paddingTop = '20px';       
                div.className += ' border-top'
            }
    
            let img = document.createElement('img');
            img.src = isNullOrUndefinedOrEmpty(result.poster_path) ? 'assets/NAO-DISPONIVEL-FOTO.png' : 'https://image.tmdb.org/t/p/w200/' + result.poster_path;
            img.className = 'col-2 d-none d-md-block ms-2';
            img.style.cursor = 'pointer';
    
            let divTexto = document.createElement('div'); 
            divTexto.className = 'col-12 col-md-8';
    
            let titulo = document.createElement('h5');
            titulo.innerHTML = result.title;
            titulo.className = 'titulo-busca';
            titulo.style.cursor = 'pointer';

            let data = document.createElement('h6');
            const releaseYear = new Date(result.release_date).getUTCFullYear();
            data.innerHTML = !releaseYear || releaseYear == 'NaN' ? 'Ano indisponível' : releaseYear;
    
            let descricao = document.createElement('span');
            descricao.innerHTML = isNullOrUndefinedOrEmpty(result.overview) ? 'Sem resumo disponível' : result.overview;
 
            titulo.onclick = () => {
                openGoogleSearch(releaseYear, result.title);
            }
            img.onclick = titulo.onclick;
            
    
            divTexto.appendChild(titulo);
            divTexto.appendChild(data);
            divTexto.appendChild(descricao);
            div.appendChild(img);
            div.appendChild(divTexto);
    
            searchContent.appendChild(div);
        });
    }
    else {
        let div = document.createElement('div');
        div.style.textAlign = 'center';
        div.style.paddingTop = '30px';
        div.style.height = 'calc(100vh - 232px)';

        let mensagem = document.createElement('h3');
        mensagem.innerHTML = 'A busca não retornou resultados.';

        div.appendChild(mensagem)
        searchContent.appendChild(div);
    }

    showSearch();
}

function hideSearch () {
    let searchSwitch = document.getElementsByClassName('search-switch');    
    let homeSwitch = document.getElementsByClassName('home-switch');

    for (let index = 0; index < searchSwitch.length; index++) {
        searchSwitch[index].style.display = 'none';        
    }

    for (let index = 0; index < homeSwitch.length; index++) {
        homeSwitch[index].style.display = 'block';        
    }
}

function showSearch () {
    let searchSwitch = document.getElementsByClassName('search-switch');    
    let homeSwitch = document.getElementsByClassName('home-switch');
    
    for (let index = 0; index < homeSwitch.length; index++) {
        homeSwitch[index].style.display = 'none';        
    }
    
    for (let index = 0; index < searchSwitch.length; index++) {
        searchSwitch[index].style.display = 'block';        
    }
}

// Slider

function showSlides() {
    const bars = document.querySelectorAll(".round-time-bar");
    slideIndex++;
    if (slideIndex == popular.length) {slideIndex = 0}
    document.getElementById('popular-title').innerHTML = popular[slideIndex].title;
    document.getElementById('popular-description').innerHTML = popular[slideIndex].overview;
    document.getElementById('popular-date').innerHTML = new Date(popular[slideIndex].release_date).toLocaleDateString();
    document.getElementById('popular-img').src = 'https://image.tmdb.org/t/p/w300/' + popular[slideIndex].poster_path;

    bars.forEach((bar) => {
        bar.classList.remove("round-time-bar");
        bar.offsetWidth;
        bar.classList.add("round-time-bar");
    });
  
    setTimeout(showSlides, 4000);
}

// Helpers

function getItemJson(key) {
    return JSON.parse(localStorage.getItem(key));
}

function setItemJson(key, item) {
    localStorage.setItem(key, typeof(item) == 'object' ? JSON.stringify(item) : item);
}

function isNullOrUndefinedOrEmpty (string) {
    return typeof(string) === 'undefined' || string == null || string === '' ||  !string.trim(); 
}

function openGoogleSearch (year, title) {
    const uriSearch = encodeURIComponent((!year || year == 'NaN' ? '' : year) + ' ' + title); 
    window.open(`https://www.google.com/search?q=${uriSearch}`);
}

function httpGetAsync(theUrl, callback) {
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            if ( xmlHttp.status == 200)
                callback(xmlHttp.responseText);
            else {
                window.alert(xmlHttp.responseText);
            }
        } 
    }
    xmlHttp.open('GET', theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
