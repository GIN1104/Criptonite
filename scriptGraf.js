let displayGraf = () => {
    
	const graphData = getDataFromGraphLocalStorage();
	const formattedData = formatData(graphData);
    let options = {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Cryptonite",
        },
        axisX: {
            valueFormatString: "HH:mm:ss",
        },
        axisY: {
            title: "USD",
            suffix: "K",
            minimum: 0,
        },
        toolTip: {
            shared: true,
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "bottom",
            horizontalAlign: "middle",
            dockInsidePlotArea: true,
            itemclick: toogleDataSeries,
        },
        data: formattedData || []
    };
    // console.log(options);

	if($("#userDV").CanvasJSChart()){
		$("#userDV").CanvasJSChart().options = options;
		$("#userDV").CanvasJSChart().render();
	}else{
		$("#userDV").css({ height: "500px", width: "98%" });
		$("#userDV").CanvasJSChart(options);
	}

    function toogleDataSeries(e) {
        if (
            typeof e.dataSeries.visible === "undefined" ||
            e.dataSeries.visible
        ) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
};

const getDataFromGraphLocalStorage = () => {
    let localStorageGraphData;
    if (localStorage.graphData) {
        localStorageGraphData = JSON.parse(localStorage.graphData);
    } else {
        localStorageGraphData = {};
    }
    return localStorageGraphData;
};
const setDataToGraphLocalStorage = (graphData) => {
    localStorage.graphData = JSON.stringify(graphData);
};

const getDataFromApi = async (symbolsForApi) => {
    const res = await fetch(
        `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbolsForApi.join(
            ","
        )}&tsyms=USD`
    );
    const jsonRes = await res.json();
    return jsonRes;
};
const colors = ['#f44336','#009688', '#9c27b0', '#673ab7', '#ffc107'];
const formatData = (graphData) => {
	const usingColors = [...colors];
    const formattedData = [];
    for (const symbol in graphData) {
        formattedData.push({
            type: "line",
            showInLegend: true,
            name: symbol,
            markerType: "square",
            xValueFormatString: "HH:mm:ss",
            color: usingColors.pop(),
            yValueFormatString: "#,##0K",
            dataPoints: graphData[symbol].map(point => ({...point, x: new Date(point.x)})),
        });
    }
    return formattedData;
};

let graphintervalId;
const startInterval = (symbolsForApi) => {
    clearInterval(graphintervalId);
    graphintervalId = setInterval(() => {
        getDataFromApi(symbolsForApi).then((apiData) => {
            const graphData = getDataFromGraphLocalStorage();
            for (const symbol in apiData) {
                if (graphData[symbol]) {
                    if (graphData[symbol].length > 20) {
                        graphData[symbol].shift();
                    }
                    graphData[symbol].push({
                        x: new Date(),
                        y: apiData[symbol].USD,
                    });
                } else {
                    graphData[symbol] = [
                        { x: new Date(), y: apiData[symbol].USD },
                    ];
                }
            }
            setDataToGraphLocalStorage(graphData);
			displayGraf();
        });
    }, 2000);
};

const showGraf = async () => {
    loader()
    const selectedCoins = JSON.parse(localStorage.infoFofGraf || "[]");
    if (selectedCoins.length === 0) {
        userDV.innerHTML = `<div class='abouMe'>Please select one coin at least</div>`
        return;
    }
    const symbolsForApi = selectedCoins.map((coin) =>
        coin.symbol.slice(0, 3).toUpperCase()
	);
	displayGraf();
    startInterval(symbolsForApi);
};

