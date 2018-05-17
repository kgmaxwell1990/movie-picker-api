// $( document ).ready(function() {
//     $(".results").hover(function() {
//     $(this).addClass("display_none")
// });
// });


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

function doRequestMain(funcToCall, genreArg="", yearStartArg=1, yearEndArg=2099) {
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
    
    let year = new Date()
    let currentYear = year.getYear()+1900
    let currentMonth = year.getMonth()+1
    let currentDate = year.getDate()
    
    let yearCanvas = document.getElementById('year_canvas')

    yearCanvas.innerHTML = "<h3>Choose A Release Year</h3>"
    yearCanvas.innerHTML += "<button class='btn btn-warning' onclick='yearAdapt([" + genreIdsString + "],1,1979)'> 70s & older </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning' onclick='yearAdapt([" + genreIdsString + "],1980,1989)'> 80s </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning' onclick='yearAdapt([" + genreIdsString + "],1990,1999)'> 90s </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning' onclick='yearAdapt([" + genreIdsString + "],2000,2009)'> 00s </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning' onclick='yearAdapt([" + genreIdsString + "],2010,2019)'> 10s </button>"
    yearCanvas.innerHTML += "<button class='btn btn-warning' onclick='yearAdapt([" + genreIdsString + "]," + '"' +currentYear+'-'+currentMonth +'-'+currentDate + '"' + ",2099)'> Unreleased </button>"
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
    let results ="<h3>Top 20 Results</h3>"
    for (let i = 0; i <= showData.results.length -1; i++) {
        results += "<div class='results col-sm-3'>"
        if (showData.results[i].poster_path == null) {
        results += "<img class='image placeholder_img' src='placeholder.jpg' width='200'>"
        }else {
        results += "<img class='image poster_img' src='https://image.tmdb.org/t/p/w300_and_h450_bestv2" + showData.results[i].poster_path + "' width='200'>"
        }
        results += "<div id='results_info'><div class='text'>"
        results += "<h3>" + showData.results[i].title + "<h3><h5>Release Date:<br>" + showData.results[i].release_date + "</h5>" + "<h5>Vote Average:<br>" + showData.results[i].vote_average + "</h5>" 
        results += "</div></div></div>"
        
        
        // results += "<h5 class='title_in_placeholder_img'>" + showData.results[i].release_date + "</h5></div>" 
        // results += "<div class='info'>" + showData.results[i].title + "</div>"
        // results += "<h5>" + showData.results[i].release_date + "</h5></div>"
     }
    document.getElementById('results_canvas').innerHTML = results
    
}





doRequestMain(mainFunc)










//  let totalPages = showData.total_pages
//  let totalResults = showData.total_results
//  let currentPage = showData.page
 
//  let pagination = "<button onclick='' disabled>&laquo;</button>";

 
//  pagination += "<button onclick='changePage("+currentPage+ "," + year + "," + genre + ")'>&raquo;</button>";
 
 
//  $(".pagination_center").removeClass("display_none")
//  document.getElementById("pagination").innerHTML = pagination;










// function changePage(currentPage, year, genre) {
//     console.log(year, genre, currentPage)
//     let nextPage = currentPage + 1
    
    
// changePageRequest.open("GET", "https://api.themoviedb.org/3/discover/movie?api_key=e5dce9ac19487be2b65ceb7be99e8ca7&with_genres=" + genreIds+"&primary_release_date.lte="+year)

// changePageRequest.send();

// changePageRequest.onreadystatechange= function (){
//     if (this.readyState == 4 && this.status == 200){
//         changePageInnerFunction(this.responseText)
//     }
// }


// }
         
//  if (totalResults == 0) {
//      pagination = ""
//  }
 
//  if (totalPages == 1 ) {
//      pagination += "<a href='#' class='active'>"+1+"</a>"
//  }
 
//  if (totalPages == 2) {
//      pagination += "<a href='#' class='active'>"+2+"</a>"
//  }
 

 
//  if (totalResults <=40 && totalResults ) {
//      pagination += "<a href='#' class='active'>"+2+"</a>"
//  }
//  for (let i = 1; i <= totalPages; i++) {
//     if (i < 10) {
//         pagination += "<a href='#'>"+[i]+"</a>"
//     }else {
//         return
//     }
//  }
        
        
        
// function langSelect(year, genresIds) {
    
//     function langSelectInnerFunction(apiData) {
        
//         let langData = JSON.parse(apiData)
//         document.getElementById('movie_count').innerHTML = langData.total_results
//         let langCanvas = document.getElementById('lang_canvas')
//         let langSelection ="<h3>Choose A Language</h3>"
//          for (let i = 0; i <= langData.results.length -1; i++) {
//              let langResult = langData.results[i].original_language
//              console.log(langResult)
//             langSelection += "<button class='btn btn-danger' onclick='showFilms(" + genreIds + "," + year + "," + langResult + ")'>" + langResult + "</button>"
//          }
         
//          document.getElementById('lang_canvas').innerHTML = langSelection
        
//     }
    
    
    
//     langRequest.open("GET", "https://api.themoviedb.org/3/discover/movie?api_key=e5dce9ac19487be2b65ceb7be99e8ca7&with_genres=" + genreIds+"&primary_release_date.lte="+year)
    
//     langRequest.send();

//     langRequest.onreadystatechange= function (){
//         if (this.readyState == 4 && this.status == 200){
//             langSelectInnerFunction(this.responseText)
//         }
//     }
// }

