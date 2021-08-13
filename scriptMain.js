/* ========================================== 
scrollTop() >= 100
Should be equal the the height of the header
========================================== */

$(window).scroll(function(){
    if ($(window).scrollTop() >= 100) {
        $('nav').addClass('fixed-header');
        $('nav div.site-title').addClass('visible-title');
    }
    else {
        $('nav').removeClass('fixed-header');
        $('nav div.site-title').removeClass('visible-title');
    }
});


    
    ///////////// Active Buttons //////////
    $(() => {
        $('.btnMain').on('click', function () {
            $('.btnMain').removeClass('btn-primary');
            $(this).addClass('btn-primary');
        });

    
    });

 

let str = [];
let coins =[];
let SelectedArray = JSON.parse(localStorage.infoFofGraf || "[]");
let myVar;
let value;



let allCoinsUrl = `https://api.coingecko.com/api/v3/coins/list`;

let getAllCoinsFromServer = (url) => {
    $.ajax({
        type: "GET",
        datatype: "json",
        url: url,
        beforeSend: function () {
            $(".loader").show();
        },
        success: function (data) {
            coins = data.slice(0, 100);
            $(".loader").fadeOut(2000);
            $("#userDV").fadeIn(2000);
            console.log(coins);

            printAllCoins(coins);
        },
        error: function (error) {
            $(".loader").fadeOut(2000);
            console.log(`Error: "  ${value}, did not found`);
        },
    });
    toShowCoinsInNav();
};


///////////// Print All Coin //////////
let printAllCoins = (coins) =>{
    clearInterval(graphintervalId);
    delete localStorage.graphData;
    str = "";
    for(let i = 0; i < coins.length; i++ ){
        // let d = `${coins.name}`;
        // if (!d.includes(0) && !d.includes(1)) {
       buildOneCoin(coins[i], i);
       // console.log(coins[i]);

        // }

      }
userDV.innerHTML = str;
};


///////////// Build Single Coin //////////
buildOneCoin = (coin, i) =>{
    const checked = SelectedArray.find(selected => selected.id === coin.id);
    str += `<div class="col-lg-4 col-md-4 col-sm-12">`
    str += ` <div class="card m-3">`;
    str +=  `<div class="card-body">`;

    str +=  `<h3 class="card-title">${coin.symbol}</h3>`;
    str +=`<div class="custom-control custom-switch" >
        <input type="checkbox" class="custom-control-input" onclick="CbClick(this, '${coin.id}')" id="${coin.id}" ${checked ? 'checked' : ''}>
        <label class="custom-control-label"  for="${coin.id}"></label>
        </div>`;
    str += `<p class="card-text">ID: ${coin.id}</p>`;
    str += `<p class="card-text">${coin.name}</p>`;
    // str += `<button  class="btn btn-primary" id="moreInfoButton${coin.id}" oncilck="moreInfoButton(${coin.id})">More info</button>`;
    // str += `<div id="infoDV"></div>`;

/////////////////////////////// Collapse ///////////////
    str += `<button class="btn btn-primary m-2" data-coin-id="${coin.id}"  type="button"  data-toggle="collapse"  data-target="#open${coin.id}" aria-expanded="false" aria-controls="collapseExample">
    More Info
</button>`
str += `<div class="collapse" id="open${coin.id}">
       <div class="card card-body" id="${coin.id}.info">
       </div></div>`
///////////////////////////


    str += `</div></div></div>`;

};



///////////////// Spiner //////////////
const loader = () =>{
    $(".loader").show();
    $(".loader").fadeOut(2000);
  }
////////////////////////////////////////////


const getAjaxAndSaveToLocalStorage = (coinId, callback) =>{
    $.ajax({
        type: "GET",
        url: `https://api.coingecko.com/api/v3/coins/${coinId}`,

        success: function (data) {
            coinsById = data;
            console.log(coinsById)
            addCoinDataToLocalStorage(coinsById)
            callback();
        },
        error: function (error) {
            $(".loader").fadeOut(2000);
            console.log(`Error: "  ${value}, did not found`);
        }
    })
}

///////////////// More Info //////////////



      $(document).on("click", '[data-coin-id]', function () {
        loader ();
          let coinId = $(this).data('coin-id')
          console.log(coinId)
          const localStorageObj = getLocalStorageAsObj();
          if (localStorageObj[coinId]) {
              if (Date.now() - localStorageObj[coinId].time < (1000 * 60 * 2)) {
                  console.log("Now :", Date.now() - localStorageObj[coinId].time)
                  console.log("Form LocalStorage");
                  showInfoOfCoinOnClick(coinId);

              } else {
                  console.log("Form Ajax")
                  getAjaxAndSaveToLocalStorage(coinId, () => {
                      showInfoOfCoinOnClick(coinId);
                      removeCoinDataFormLocalStorageById(coinId);
                  });
                 
              }
          } else {
            getAjaxAndSaveToLocalStorage(coinId, () => {
                showInfoOfCoinOnClick(coinId);
            });   
          }
      });


const showInfoOfCoinOnClick = (coinId) => {
    const localStorageObj = getLocalStorageAsObj();
    const coinData = localStorageObj[coinId];
    const moreInfoButton = document.getElementById(`${coinData.id}.info`);
    $(moreInfoButton).css("background-color", "rgba(255, 255, 255, 0.7)")

    if (coinData.usd) {
        moreInfoButton.innerHTML = `<div><img src=${coinData.image}/></div><br>
                    <div>&#36 ${coinData.usd}</div>
                    <div>&#8364 ${coinData.eur}</div>
                    <div>&#8362 ${coinData.ils}</div>`

    } else {
        moreInfoButton.innerHTML = `<div><img src=${coinData.image}/></div><br>
            <div>Nothing to show </div>`

    }
}
       



///////////////// Search for Coins //////////////
 searchCoinFunction = () =>{
    str = "";
    let newCoins = [];
    let newValue = coinId.value;
    loader();
    if (newValue != "") {
        newCoins = coins.filter((coin) => {
            return String(coin.symbol) == newValue;
        });
    } else {
        newCoins = coins;
    }

    if(newCoins.length === 0){
        userDV.innerHTML = `<div class='abouMe'>Coin not found</div>`
;
    }else{
        printAllCoins(newCoins);
    }
};




const addToSelected = coinId => {
    const coin = coins.find(c => c.id === coinId);
    SelectedArray.push(coin);
    localStorage.infoFofGraf = JSON.stringify(SelectedArray);
}
const removeFromSelected = coinId => {
    let coinIndex = SelectedArray.findIndex(item => {
        return item.id === coinId;
    });
    SelectedArray.splice(coinIndex, 1);
    localStorage.infoFofGraf = JSON.stringify(SelectedArray);
}



///////////////// Select Coins //////////////

const CbClick = (cb, coinId) => {
        if (cb.checked) {
            addToSelected(coinId)
        } else {
            removeFromSelected(coinId)
        }
        if (SelectedArray.length > 5) {
            modalWindow()
        }
        toShowCoinsInNav()
}
const onToggleCheckBoxInModal = (coinId) =>{
    const $el = $(`#${coinId}`);
    const checked = $el.prop('checked');
    $el.prop('checked', !checked);
    if(checked){
        removeFromSelected(coinId)
    }else{
        addToSelected(coinId)
    }
}


/////////////// Modal Window////////////
const modalWindow = () =>{
    $(".modal").css({"display": "block"})
    $("body").css({"overflow":"hidden"})
    $(".modal-body").empty().append(`<p>To add the "<b>${SelectedArray[5].symbol}</b>" coin, you must unselect one of the following: <br></p>`)

    for (let i = 0; i < SelectedArray.length-1; i++) {
  $(".modal-body").append(
    `<div id="modaldiv">
    <div class="card" id="modalcard" >
        
            <h6 id="modalcoinname" class="card-title">${SelectedArray[i].symbol}</h6>
            </div>
        
        </div>
        <div class="custom-control custom-switch" >
        <input type="checkbox" class="custom-control-input" checked onclick="onToggleCheckBoxInModal('${SelectedArray[i].id}')" id="${SelectedArray[i].id}.modal">
        <label class="custom-control-label"  for="${SelectedArray[i].id}.modal"></label>
        </div>
    </div>
</div>`
);

}}


////////////////

const toShowCoinsInNav = () =>{
let coinspandata = "";
for (let j = 0; j < SelectedArray.length; j++) {
    if (j == (SelectedArray.length - 1)) {
        coinspandata += SelectedArray[j].symbol;
    }
    else {
        coinspandata += SelectedArray[j].symbol + ", ";
    }
}
$("#selectedcoins").html(`<strong>${coinspandata.toUpperCase()}</strong>`);
}



///////////////// Close Modal //////////////

const modalCloseBtn = document.querySelectorAll("[data-dismiss]");

modalCloseBtn.forEach(closeBtn => {
    closeBtn.addEventListener('click', ()=>{
        if(SelectedArray.length > 5){
            const removedCoin = SelectedArray.pop();
            $(`#${removedCoin.id}`).prop('checked', false);
            localStorage.infoFofGraf = JSON.stringify(SelectedArray);            
        }
        toShowCoinsInNav();
        $(".modal").hide()
        $("body").css({"overflow":""})
    })
})


////////////////////// Save coinDataReturnedFromAJAX to LocalStorage///////////
const addCoinDataToLocalStorage = (coinDataReturnedFromAJAX) => {

        const localStorageCoinData = getLocalStorageAsObj();
        const coinLocalStorageObj = {
            image: coinDataReturnedFromAJAX.image.small,
            id: coinDataReturnedFromAJAX.id,
            usd: coinDataReturnedFromAJAX.market_data.current_price.usd,
            eur: coinDataReturnedFromAJAX.market_data.current_price.eur,
            ils: coinDataReturnedFromAJAX.market_data.current_price.ils,
            time: Date.now()
        }

        localStorageCoinData[coinDataReturnedFromAJAX.id] = coinLocalStorageObj;
        // console.log(localStorageCoinData)
        const localStorageKey = 'moreInfoFromLocalStorage';
        localStorage[localStorageKey] = JSON.stringify(localStorageCoinData);


}


const removeCoinDataFormLocalStorageById = (coinId) =>{
    const localStorageCoinData = getLocalStorageAsObj();
    delete localStorageCoinData[coinId] 
    const localStorageKey = 'moreInfoFromLocalStorage';
    localStorage[localStorageKey] = JSON.stringify(localStorageCoinData);
   // console.log(localStorageCoinData)
}



const getLocalStorageAsObj = () =>{
    let localStorageCoinData;
    if(localStorage.moreInfoFromLocalStorage){
            localStorageCoinData = JSON.parse(localStorage.moreInfoFromLocalStorage);
        } else {
             localStorageCoinData = {}
    
        } 
        return localStorageCoinData;
}
///////////////////////////////////

getAllCoinsFromServer(allCoinsUrl);

const aboutMe = () =>{
    loader()
    clearInterval(graphintervalId);
    $('#userDV').empty()
    userDV.innerHTML = `<div class='abouMe'>
    <div class="container mt-5">
        <div class="row">
    
                <div class="col-4 ">
                        <img id="myPic" src="me.jpg" />
                        
                    </div>
    
            <div class="col-8 about" id="aboutprojectdiv">
            </p>
            <h3 class=""><u>About me:</u></h3>
        <p>
            <b>Name: </b>Evgeny Starchenko<br>
            <b>Contact: </b> starchenkogin@gmail.com<br>  


                    <h3 class=""><u>About this project:</u></h3>
                    <p>This is my second project. </p> 
                    <p>This projected was created using: HTML, CSS3, JAVASCRIPT, JQUERY, AJAX, REST API, CANVAS JS & BOOTSTRAP.</p>
                    <br>

                        Links was used: 
                        https://www.coingecko.com/api/docs/v3#/ <br>
                        https://www.cryptocompare.com/api/#-api-data-price<br>
                        https://canvasjs.com/jquery-charts/<br>

                        <br>

            </div>
           
        </div>
    </div></div> `
}
