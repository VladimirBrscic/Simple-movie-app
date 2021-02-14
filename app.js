let searchPhrase;
// imdb variable set by movieDetails() used by fullPlot()
let imdbID;
const apiKey = //api key place holder;
$(document).ready(() => {
  //find movies by search term
  $('form').on('submit',(e) => {
    e.preventDefault();
    searchPhrase = $('input').val();
    findMovie(searchPhrase);
  })
  $('#movies').on('click',(e) => {
    //display movie details
    if(e.target.className === 'title')
    movieDetails(e.target.innerText);
  })

  $('#movie-details').on('click',(e) => {
    //removes movie's details
    if(e.target.className.includes('fas')){
      $('#movie-details').html('');
      imdbID = '';
    }else if(e.target.className === 'more'){
      if($('.long-plot').html()){
        $('.long-plot').show();
        $('.short-plot').hide();
      }else{
        //shows full plot
        fullPlot();
      }
    }else if(e.target.className === 'less'){
     $('.short-plot').show();
     $('.long-plot').hide();
    }
  })
  //displays next page in search results
  $('.pages').on('click',(e) => {
    if(e.target.hasAttribute('href')){
    page = e.target.innerText;
     findMovie(searchPhrase,page)
  }
  })
})

const findMovie = (searchPhrase,page) => {

  if(searchPhrase === ''){
    $('#movies').html('<p>Please enter your search term</p>');
    $('.pages').html('');
  }else{
    $.get('http://www.omdbapi.com/?apikey='+apiKey+'&s='+searchPhrase+'&page='+page, (data) => {
      totalResults = data.totalResults;
      let output = `<p class='total-pages'>Total results: ${totalResults}`;
      data.Search.forEach((item, i) => {
        output += `<p class='title'>${item.Title}</p>`
      });
      makePages(totalResults);
      $('#movies').html(output);
      $('#movie-details').html('');
    })
  }
}

  const makePages = (numOfMovies) => {
    let pageNum = (Math.ceil(numOfMovies / 10));
    let output = '<p>Pages</p>';
    for(let i = 1; i <= pageNum; i++){
      output += `<a href='#'>${i}</a>`
      if(i === 10){
        break;
      }
    }
    $('.pages').html(output);
  }



const movieDetails = (title) => {

  const request = 'http://www.omdbapi.com/?apikey='+apiKey+'&t=';
  $.get(request+title, (data, status) => {
    const output = `<i class="fas fa-times"></i>
    <h3>${data.Title}</h3>
    <p><span>Year: </span>${data.Year}</p>
    <p><span>Genre: </span>${data.Genre}</p>
    <p><span>Duration: </span>${data.Runtime}</p>
    <p><span>Actors: </span>${data.Actors}</p>
    <div class='plot'>
    <p class='short-plot'><span>Plot: </span>${data.Plot}<a href='#' class='more'>  ... MORE</a></p>
    <div class="long-plot"></div>
    </div>`
    $('#movie-details').html(output);
    imdbID = data.imdbID;
  })
}

const fullPlot = () => {
  $.get('http://www.omdbapi.com/?apikey='+apiKey+'&i='+imdbID+'&plot=full', (data, status) => {
      $('.long-plot').html(`<p>${data.Plot}<a href='#' class='less'> ... LESS</a></p>`)
      $('.short-plot').hide();
  })
}
