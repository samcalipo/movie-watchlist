const watchlistContainer = document.getElementById("movies-in-watchlist");
const noMovieInWatchlist = document.getElementById("no-movie-in-watchlist");
const moviesInWatchlist = document.getElementById("movies-in-watchlist");
let moviesFromLocalStorage = JSON.parse(localStorage.getItem("movies"));
renderWatchlist();

document.addEventListener('click', e =>{
    if(e.target.dataset.movieid){
        removeMovieFromWatchlist(e.target.dataset.movieid);
    }  
})

function removeMovieFromWatchlist(movieId){
    // find index of object in the array
   let index = moviesFromLocalStorage.findIndex(movie => movie.imdbID == movieId) 

   moviesFromLocalStorage.splice(index, 1);
    // update local storage
    localStorage.setItem("movies", JSON.stringify(moviesFromLocalStorage));    
   renderWatchlist();

}
function renderWatchlist(){
    
    if(moviesFromLocalStorage.length > 0){
        console.log("movies in watchlist")
        console.log(moviesFromLocalStorage)
        moviesInWatchlist.style.display = "flex";
        noMovieInWatchlist.style.display = "none";

        let watchlistMovieHtml = '';
        moviesFromLocalStorage.map(movie => {
            let plotHtml = '';
            if(movie.plot.length > 132){
                let shortenPlot = movie.plot.slice(0, 133);
                plotHtml = `<p>${shortenPlot}... 
                <button type="button">Read more</button></p>
                `
            } else {
                plotHtml = `<p>${movie.plot}</p>`;
            }
            watchlistMovieHtml += `
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
                    <button type="button" data-movieid="${movie.imdbID}"><i class="fa fa-minus-circle" aria-hidden="true"></i> Remove</button>
                </div>

                <div class="individual-movie-data-bottom">
                    ${plotHtml}                         
                </div>
            </div>
                
            </div>
            `
        })
        watchlistContainer.innerHTML = watchlistMovieHtml;
    } else {
        console.log("display no movies in watchlist")
        moviesInWatchlist.style.display = "none";
        noMovieInWatchlist.style.display = "flex";
    }
}
