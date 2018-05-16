let request = new XMLHttpRequest();
let genreRequest = new XMLHttpRequest();
let yearRequest = new XMLHttpRequest();

function mainFunc(apiData) {
    let mainData = JSON.parse(apiData);
    document.getElementById('movie_count').innerHTML = mainData.total_results
    genreSelect()
}

function genreSelect(){
     
     let genreSelection = "";
     
     function genreSelectInnerFunction(apiData) {
         let genreData = JSON.parse(apiData)
         for (let i = 0; i <= genreData.genres.length -1; i++) {
            genreSelection += "<button id='genre" + genreData.genres[i].id + "' class='btn btn-success' data-genreid='" + genreData.genres[i].id + "' onclick='yearSelect(" + genreData.genres[i].id + ")'>" + genreData.genres[i].name + "</button>"
         }
         document.getElementById('genre_canvas').innerHTML = genreSelection
     }
     
    genreRequest.open("GET", "https://api.themoviedb.org/3/genre/movie/list?api_key=e5dce9ac19487be2b65ceb7be99e8ca7")
    
    genreRequest.send();

    genreRequest.onreadystatechange= function (){
        if (this.readyState == 4 && this.status == 200){
            genreSelectInnerFunction(this.responseText)
        }
    }
}

function yearSelect(genreId) {
    
    let yearSelection = "";
    
    function yearSelectInnerFunction(apiData) {
        let yearData = JSON.parse(apiData)
        document.getElementById('movie_count').innerHTML = yearData.total_results
        let yearCanvas = document.getElementById('year_canvas')
        yearCanvas.innerHTML = "<h3>Choose A Year Range</h3>"
        for (let i = 0; i <= yearData.results.length -1; i ++) {
            let yearReleased = yearData.results[i].release_date.slice(0, 4);
            yearSelection += "<button class='btn btn-warning' onclick='thirdSelector(" + genreId + "," + yearReleased + ")'>" + yearReleased + "</button>"
        }
        
        yearCanvas.innerHTML += yearSelection
    }
    
    yearRequest.open("GET", "https://api.themoviedb.org/3/discover/movie?api_key=e5dce9ac19487be2b65ceb7be99e8ca7&with_genres=" + genreId)
    
    yearRequest.send();

    yearRequest.onreadystatechange= function (){
        if (this.readyState == 4 && this.status == 200){
            yearSelectInnerFunction(this.responseText)
        }
    }

}

request.onreadystatechange= function (){
    if (this.readyState == 4 && this.status == 200){
        mainFunc(this.responseText)
    }
}

request.open("GET", "https://api.themoviedb.org/3/discover/movie?api_key=e5dce9ac19487be2b65ceb7be99e8ca7")

request.send();
    



