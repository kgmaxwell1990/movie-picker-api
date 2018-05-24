function doRequestMain(funcToCall, genreArg="", yearStartArg=1, yearEndArg=2099, pageNo=1) {
    console.log(pageNo)
    let request = new XMLHttpRequest();
    let rootURL = "https://api.themoviedb.org/3/discover/movie?api_key=e5dce9ac19487be2b65ceb7be99e8ca7"
    request.open("GET", rootURL + "&with_genres=" + genreArg + "&primary_release_date.gte=" + yearStartArg + "&primary_release_date.lte=" + yearEndArg+ "&page=" + pageNo)
    request.send();
    request.onreadystatechange= function (){
        if (this.readyState == 4 && this.status == 200){
            funcToCall(this.responseText, genreArg, yearStartArg, yearEndArg, pageNo)
        }
    }
}

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

function doRequestSpecificMovie(funcToCall, movieId) {
    let request = new XMLHttpRequest();
    request.open("GET", "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=e5dce9ac19487be2b65ceb7be99e8ca7&language=en-US" )
    request.send();
    request.onreadystatechange= function (){
        if (this.readyState == 4 && this.status == 200){
            funcToCall(this.responseText)
        }
    }
    console.log(request)
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
        genreSelection += "<button id='genre" + genreData.genres[i].id + "'class='btn btn-success' onclick='genreAdapt(" + genreData.genres[i].id + ")'>" + genreData.genres[i].name + "</button>"
     }
     document.getElementById('genre_canvas').innerHTML = genreSelection
}
    
let genreIds = [];
function genreAdapt(genreId) {
    let fullGenreId = "#genre" + genreId;
    if(genreIds.includes(genreId)) {
        $(fullGenreId).css("background-color", "gray")
        while (genreIds.indexOf(genreId) !== -1) {
          genreIds.splice(genreIds.indexOf(genreId), 1);
        }
        let genreIdsString = genreIds.join();
        doRequestMain(yearSelect,genreIdsString);
        doRequestMain(showMovies,genreIdsString);
    }else {
        $(fullGenreId).css("background-color", "#C83725")
        genreIds.push(genreId);
        let genreIdsString = genreIds.join();
        doRequestMain(yearSelect,genreIdsString);
        doRequestMain(showMovies,genreIdsString);
    }
}

function yearSelect(data, genreIdsString) {
    let showData = JSON.parse(data)
    updateNumberOfMovies(showData.total_results)
    
    let year = new Date()
    let currentYear = year.getYear()+1900
    let currentMonth = year.getMonth()+1
    let currentDate = year.getDate()
    
    let yearCanvas = document.getElementById('year_canvas')

    yearCanvas.innerHTML = "<h3>Choose A Release Year</h3>"
    yearCanvas.innerHTML += "<button class='btn btn-warning year_button' onclick='yearAdapt([" + genreIdsString + "],1,2099); makeActive()'> All </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning year_button' onclick='yearAdapt([" + genreIdsString + "],1,1979); makeActive()'> 70s & older </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning year_button' onclick='yearAdapt([" + genreIdsString + "],1980,1989); makeActive()'> 80s </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning year_button' onclick='yearAdapt([" + genreIdsString + "],1990,1999); makeActive()'> 90s </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning year_button' onclick='yearAdapt([" + genreIdsString + "],2000,2009); makeActive()'> 00s </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning year_button' onclick='yearAdapt([" + genreIdsString + "],2010,2019); makeActive()'> 10s </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning year_button' onclick='yearAdapt([" + genreIdsString + "]," + '"' +currentYear+'-'+currentMonth +'-'+currentDate + '"' + ",2099); makeActive()'> Unreleased </button>"
}
function makeActive() {
    $(this).css("background-color", "black")
}
function yearAdapt(genreIdsArray, yearLow, yearHigh) {
    let genres = genreIdsArray.join()
    doRequestMain(showMovies, genres, yearLow, yearHigh)
}

function showMovies(data, genre, yearStart, yearEnd, pageNo) {
    console.log(genre, yearStart, yearEnd, pageNo)
    let showData = JSON.parse(data)
    
    updateNumberOfMovies(showData.total_results)
    let resultsCanvas = document.getElementById('results_canvas')
    let results =""
    for (let i = 0; i <= showData.results.length -1; i++) {
        let movieId = showData.results[i].id
        results += "<a onclick='doRequestSpecificMovie(movieDetail, " + movieId + ")'><div class='results col-sm-3'>"
        if (showData.results[i].poster_path == null) {
        results += "<img class='image placeholder_img' src='placeholder.jpg' width='200'>"
        }else {
        results += "<img class='image poster_img' src='https://image.tmdb.org/t/p/w300_and_h450_bestv2" + showData.results[i].poster_path + "' width='200'>"
        }
        results += "<div id='results_info'><div class='text'>"
        results += "<h3>" + showData.results[i].title + "<h3><h5>Release Date:<br>" + showData.results[i].release_date + "</h5>" + "<h5>Vote Average:<br>" + showData.results[i].vote_average + "</h5>" 
        results += "</div></div></div></a>"
     }
    document.getElementById('results_canvas').innerHTML = results
    // console.log(showData.total_pages)
    let paginationArray = []
    for(let i = 1; i <= showData.total_pages; i++) {
        paginationArray.push(i)
    }
    let pageGroup = paginationArray.slice(0,10)
    // console.log(pageGroup)
    let pagination = "<button onclick='' disabled>&laquo;</button>";
    
    for(let i = 1; i <= pageGroup.length; i++) {
        pagination += "<button id='pageNo" + i + "' onclick='changePage("+ i + ",[" + genre + "]," + yearStart + "," + yearEnd +")' >" + i + "</button>"
    }
    
    pagination += "<button onclick=''>&raquo;</button>";
     
    $(".pagination_center").removeClass("display_none")
    document.getElementById("pagination").innerHTML = pagination;
}

function changePage(currentPage, genre, yearStart, yearEnd){
    let currentPageId = "#pageNo" + currentPage
    $(currentPageId).css("background-color", "black")
    doRequestMain(showMovies, genre, yearStart, yearEnd, currentPage)
}


function movieDetail(apiData) {
    $('.search').hide()
    $('.movie_detail').show()
    let data = JSON.parse(apiData)
    console.log(data)
    let movie = "<div class='header_specific'>"
    movie += "<h1>"+ data.title +"</h1></div><div class='go_back_button'><a href='#' onclick='goBack()' class='back_button'><i class='fas fa-arrow-circle-left fa-3x'></i></a></div>"
    movie += "<div class='row specific_content'><div class='col-sm-4 specific_img'><img src='https://image.tmdb.org/t/p/w300_and_h450_bestv2" + data.poster_path + "' width='200'></div>"
    movie += "<div class='col-sm-8'><h2>" + data.tagline + "</h2><p>"+ data.overview +"</p><p><strong>Vote Average: </strong>" + data.vote_average + "</p><p><strong>Original Language: </strong>" + data.original_language + "</p><p><strong>Release Date: </strong>" + data.release_date + "</p></div></div>"
    
    document.getElementById("movie_canvas").innerHTML = movie
}

function goBack() {
    $('.movie_detail').hide()
    $('.search').show()
}


doRequestMain(mainFunc)
