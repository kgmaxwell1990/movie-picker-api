function doRequestGenres(funcToCall) {
    let request = new XMLHttpRequest();
    request.open("GET", "https://api.themoviedb.org/3/genre/movie/list?api_key=e5dce9ac19487be2b65ceb7be99e8ca7" )
    request.send();
    request.onreadystatechange= function (){
        if (this.readyState == 4 && this.status == 200){
            funcToCall(this.responseText)
        }
    }
}

function doRequestMain(funcToCall, genreArg="", yearStartArg=1, yearEndArg=2018) {
    let request = new XMLHttpRequest();
    let rootURL = "https://api.themoviedb.org/3/discover/movie?api_key=e5dce9ac19487be2b65ceb7be99e8ca7"
    request.open("GET", rootURL + "&with_genres=" + genreArg + "&primary_release_date.gte=" + yearStartArg + "&primary_release_date.lte=" + yearEndArg)
    request.send();
    request.onreadystatechange= function (){
        if (this.readyState == 4 && this.status == 200){
            funcToCall(this.responseText, genreArg, yearStartArg, yearEndArg)
        }
    }
}

function mainFunc(apiData) {
    let showData = JSON.parse(apiData);
    updateNumberOfMovies(showData.total_results)
    doRequestGenres(genreSelect)
}

function updateNumberOfMovies(n) {
    document.getElementById('movie_count').innerHTML = n
}

function genreSelect(apiData){
     let genreData = JSON.parse(apiData)
     let genreSelection = "";
     for (let i = 0; i <= genreData.genres.length -1; i++) {
        // console.log(genreData.genres[i].id)
        // console.log(genreData.genres[i].name)
        genreSelection += "<button id='genre" + genreData.genres[i].id + "'class='btn btn-success' onclick='genreAdapt(" + genreData.genres[i].id + ")'>" + genreData.genres[i].name + "</button>"
     }
     document.getElementById('genre_canvas').innerHTML = genreSelection
}
    
let genreIds = [];
function genreAdapt(genreId) {
    let fullGenreId = "#genre" + genreId;
    if(genreIds.includes(genreId)) {
        $(fullGenreId).css("background-color", "#5cb85c")
        while (genreIds.indexOf(genreId) !== -1) {
          genreIds.splice(genreIds.indexOf(genreId), 1);
        }
        let genreIdsString = genreIds.join();
        doRequestMain(yearSelect,genreIdsString);
        doRequestMain(showMovies,genreIdsString);
    }else {
        $(fullGenreId).css("background-color", "blue")
        genreIds.push(genreId);
        let genreIdsString = genreIds.join();
        doRequestMain(yearSelect,genreIdsString);
        doRequestMain(showMovies,genreIdsString);
    }
}

function yearSelect(data, genreIdsString) {
    let showData = JSON.parse(data)
    updateNumberOfMovies(showData.total_results)
    let yearCanvas = document.getElementById('year_canvas')

    yearCanvas.innerHTML = "<h3>Choose A Year Range</h3>"
    yearCanvas.innerHTML += "<button class='btn btn-warning' onclick='yearAdapt([" + genreIdsString + "],1,1979)'> 70s & older </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning' onclick='yearAdapt([" + genreIdsString + "],1980,1989)'> 80s </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning' onclick='yearAdapt([" + genreIdsString + "],1990,1999)'> 90s </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning' onclick='yearAdapt([" + genreIdsString + "],2000,2009)'> 00s </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning' onclick='yearAdapt([" + genreIdsString + "],2010,2019)'> 10s </button>"
}

function yearAdapt(genreIdsArray, yearLow, yearHigh) {
    let genres = genreIdsArray.join()
    doRequestMain(showMovies, genres, yearLow, yearHigh)
    
}

function showMovies(data) {
    let showData = JSON.parse(data)
    console.log(showData)
    updateNumberOfMovies(showData.total_results)
    let resultsCanvas = document.getElementById('results_canvas')
    let results ="<h3>Here are your Results</h3>"
    for (let i = 0; i <= showData.results.length -1; i++) {
        console.log(showData.results[i])
        if (showData.results[i].poster_path == null) {
        results += "<div class='col-sm-3 placeholder_img_div module'><img class='placeholder_img' src='placeholder.jpg' width='200'>"
        results += "<h5 class='title_in_placeholder_img'>" + showData.results[i].release_date + "</h5></div>" 
        }else {
        results += "<div class='col-sm-3 poster_img_div module'><img class='poster_img' src='https://image.tmdb.org/t/p/w300_and_h450_bestv2" + showData.results[i].poster_path + "' width='200'>"
        results += "<h5>" + showData.results[i].release_date + "</h5></div>"
        }
     }
    document.getElementById('results_canvas').innerHTML = results
}

doRequestMain(mainFunc)






