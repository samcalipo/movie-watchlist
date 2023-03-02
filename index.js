// html DOM variables
const searchBtn = document.getElementById("search-btn");
const movieSearchResult = document.getElementById("movie-search-result");
const searchBoxInput = document.getElementById("search-box");
const searchInvalid = document.getElementById("movie-search-invalid");

let moviesFromLocalStorage = JSON.parse(localStorage.getItem("movies"));
// other variables
// const movieTitleIsSearched = false;
let SearchedMovieArray;
// let movieWatchList = [];
// localStorage.setItem('movies', "");

searchBtn.addEventListener("click", () => {
    document.getElementById("no-movie-searched").style.display = "none";
    document.getElementById("movie-search-result").style.display = "flex"

    sendToApi(searchBoxInput.value);
    
})
document.addEventListener('click', e => {
    if(e.target.dataset.movieid){
        addMovieToWatchlist(e.target.dataset.movieid);
    }  
})

function addMovieToWatchlist(movieId){
    // finding the movie that matches the id of the btn
    let itemToPush = SearchedMovieArray.filter(movie => {
        return movie.imdbID == movieId;
    })[0]
    
    if(moviesFromLocalStorage){
        let matchFound = false;
        // checks if a match has been found, if found the "matchFound" boolean is made true;
        moviesFromLocalStorage.map(movie => {
            if (movie.imdbID == itemToPush.imdbID){
                console.log("movie", movie.imdbID, "itemToPush", itemToPush.imdbID);
                matchFound = true;
            }
        })
        if (!matchFound){
            moviesFromLocalStorage.push(itemToPush);
            
        } 
        
    } else{
        moviesFromLocalStorage = [itemToPush];
    }
    localStorage.setItem("movies", JSON.stringify(moviesFromLocalStorage));
    
    
}
async function sendToApi(userSearch){
    // first: replace empty space with "+" for url, & make string lowercase
    let formattedUserSearch = userSearch.replace(/ /g, "+").toLowerCase();
    


    await fetch(`https://www.omdbapi.com/?s=${formattedUserSearch}&type=movie&apikey=88bd33bd`)
        .then(res => res.json())
        .then(data => {
            if(data.Error){
                searchInvalid.style.display = "flex";
                document.getElementById("movie-search-result").style.display = "none"
                setTimeout(() =>{
                    document.getElementById("no-movie-searched").style.display = "flex";
                    document.getElementById("movie-search-result").style.display = "none"
                    searchInvalid.style.display = "none";
                }, 3000)
            } else {
                renderMovieResults(data.Search);
            }
            
            
        })
}
function renderMovieResults(moviesSearchedArray){
    let returnMoviesSearchedHtml = "";

    // add a variable to track if a movie has been selected to add to watchlist.
    moviesSearchedArray.map(movie => {
        movie.isAddedToWatchlist = false;

         fetch(`https://www.omdbapi.com/?i=${movie.imdbID}&type=movie&apikey=88bd33bd`)
            .then(res => res.json())
            .then(data => {
                let plotHtml = ""
                let {Genre, Plot, Runtime, imdbRating} = data;
                movie.genre = Genre;
                
                movie.plot = Plot;
                movie.runTime = Runtime;
                movie.imdbRating = imdbRating;
                


                // check if plot has more than 132 characters
                if(movie.plot.length > 132){
                    let shortenPlot = movie.plot.slice(0, 133);
                    plotHtml = `<p>${shortenPlot}... 
                    <button type="button">Read more</button></p>
                    `
                } else {
                    plotHtml = `<p>${movie.plot}</p>`;
                }
                returnMoviesSearchedHtml += `
                <div class="individual-movie">
                <!-- only contains movie image-->
                <img src="${movie.Poster}">
                
                <div class="individual-movie-data"> <!-- Movie data-->
                    <div class="individual-movie-data-title">
                        <h3>${movie.Title}</h3>
                        <i class="fa fa-star" aria-hidden="true"></i>
                        <p>${movie.imdbRating}</p>
                    </div>

                    <div class="individual-movie-data-middle">
                        <p>${movie.runTime}</p>
                        <p>${movie.genre}</p>
                        <button type="button" data-movieid="${movie.imdbID}"><i class="fa fa-plus-circle" aria-hidden="true"></i> Watchlist</button>
                    </div>

                    <div class="individual-movie-data-bottom">
                        ${plotHtml}                         
                    </div>
                </div>
                    
                </div>
                `
                movieSearchResult.innerHTML = returnMoviesSearchedHtml;
            })
        
        
    })
    SearchedMovieArray = moviesSearchedArray;

    movieSearchResult.innerHTML = returnMoviesSearchedHtml;
}


// returnMoviesSearchedHtml += `
//     <div class="individual-movie">
//     <!-- only contains movie image-->
//     <img src="${movie.Poster}">
    
//     <div class="individual-movie-data"> <!-- Movie data-->
//         <div class="individual-movie-data-title">
//             <h3>${movie.Title}</h3>
//             <i class="fa fa-star" aria-hidden="true"></i>
//             <p>${movie.imdbRating}</p>
//         </div>

//         <div class="individual-movie-data-middle">
//             <p>${movie.runTime}</p>
//             <p>${movie.genre}</p>
//             <button type="button"><i class="fa fa-plus-circle" aria-hidden="true"></i> Watchlist</button>
//         </div>

//         <div class="individual-movie-data-bottom">
//             <p>${movie.plot}... 
//             <button type="button">Read more</button></p>
//         </div>
//     </div>
        
//     </div>
//     `