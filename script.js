const API_KEY = 'api_key=d26a19b58b5cca7036fcdc6d8ed382ca';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&'+API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+API_KEY;

const genres = [
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tags = document.getElementById('tags');


let selectedGenere = [];
setGeneres();
function setGeneres()
{
    tags.innerHTML = '';
    genres.forEach(genre => {
        const el = document.createElement('div');
        el.classList.add('tag');
        el.id = genre.id;
        el.innerText = genre.name;
        el.addEventListener('click',() =>{
            if(selectedGenere.length == 0)
            {
                selectedGenere.push(genre.id);
            }
            else
            {
               if(selectedGenere.includes(genre.id))
               {
                selectedGenere.forEach((id, index) =>{
                    if(id == genre.id){
                        selectedGenere.splice(index, 1);
                    }
                })
               }
               else
               {
                selectedGenere.push(genre.id);
               } 
            }
            getMovies(API_URL + '&with_genres=' + encodeURI(selectedGenere.join(',')));
            highlights();
        })
        tags.append(el);
    })
}
function highlights()
{
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag =>{
        tag.classList.remove('highlight');
    })
    if(selectedGenere.length != 0)
    {
    selectedGenere.forEach(id =>{
        const highlightedTag = document.getElementById(id);
        highlightedTag.classList.add('highlight'); 
    })
    }
}
getMovies(API_URL);
function getMovies(url)
{
  lastUrl = url;
    fetch(url).then(res => res.json()).then(data =>{
        if(data.results.length!=0)
        {
        showMovies(data);
        currentPage = data.page;
        nextPage = currentPage + 1;
        previousPage = currentPage - 1;
        totalPages = data.total_pages;
        }
        else
        {
            main.innerHTML = `<h1 class ="noresult">NO RESULTS FOUND</h1>`
        }
    })
}

function showMovies(data) {
    main.innerHTML = '';

    data.results.forEach(movie => {
        const {title, poster_path, vote_average, overview, id} = movie;     // OBJECT DESTRUCTURINGl
        const movieEl = document.createElement('div');
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
            <img src="${poster_path?IMG_URL+poster_path: "https://via.placeholder.com/1080x1580"}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h5><b>Overview</b></h5>
                ${overview}
                <button class="review"><b>REVIEW</b></button>
            </div>
        `
        main.appendChild(movieEl);
    })
}

function getColor(vote)
{
    if(vote>=7.5)
        return 'green';
    else if(vote>=5)
        return 'orange';
    else
        return 'red';
}

form.addEventListener('submit',function(e){
    e.preventDefault();
    const searchTerm = search.value;
    if(searchTerm)
    {
        getMovies(searchURL+'&query='+searchTerm);
    }
    else{
        getMovies(API_URL);
    }
})
