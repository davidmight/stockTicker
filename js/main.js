$(document).ready(function(){
	
	var BASE_URL = 'http://query.yahooapis.com/v1/public/yql';
	var companiesFollowed = [];
	//http://query.yahooapis.com/v1/public/yql?q=select * from geo.places where text="sunnyvale, ca"
	//select * from yahoo.finance.quotes where symbol in ("yhoo")
	
	$("#monitor").click(function(){
		var companySymbol = $("#symbol").val().toLowerCase();
		$("#symbol").val('');
		getStockInfo(companySymbol);
	});
	
	function getStockInfo(companySymbol){
		
		$.yql("select * from yahoo.finance.quotes where symbol='" + companySymbol + "' and StockExchange='NasdaqNM'",function(content){
			var stock = content.query.results.quote;
			//console.log(stock);
			if(stock.StockExchange != null){
				companiesFollowed.push(companySymbol);
				addStockItem(companySymbol, stock);
			}else{
				console.log("Company not available");
			}
		});
		
	};
	
	$('.deleteButton').live('click', function () {
		$(this).parent().remove();
		//removeSymbol($(this).parent.attr('id'));
		//companiesFollowed[$(this.parent.attr('id')).remove()];
	});
	function removeSymbol(symbol){
		companiesFollowed = jQuery.grep(companiesFollowed, function(value) {
			return value != symbol;
		});
	}
	
	function addStockItem(companySymbol, data){
		var stockItem = '<div class="stockItem" id="' + companySymbol + '">';
		stockItem += '<div class="deleteButton"></div>';
		stockItem += '<h3 class="stockTitle">' + data.Name + ' (' + data.symbol + ')</h3>';
		stockItem += '<div class="stockTimeHolder"><span class="stockLabel">Last Traded: </span><span class="stockTime">' + data.LastTradeTime + ' : ' + data.LastTradeDate + '</span></div>';
		stockItem += '<ul><li class="stockPriceHolder"><span class="stockLabel">Price: </span><span class="stockPrice">' + data.AskRealtime + '</span></li>';
		stockItem += '<li class="stockChangeHolder"><span class="stockLabel">Change: </span><span class="stockChange">' + data.Change + '</span></li>';
		stockItem += '<li class="stockHighHolder"><span class="stockLabel">Day High: </span><span class="stockHigh">' + data.DaysHigh + '</span></li>';
		stockItem += '<li class="stockLowHolder"><span class="stockLabel">Day Low: </span><span class="stockLow">' + data.DaysLow + '</span></li></ul>';
		stockItem += '</div>';
		
		updateStockInfo(companySymbol);
		$('#portfolio').append(stockItem);
	}
	
	function updateStockInfo(companySymbol){
		setTimeout(function (){
			if(jQuery.inArray(companySymbol, companiesFollowed != -1)){
				updateStock(companySymbol);
			}
		}, 3000);
	}
	
	function updateStock(companySymbol){
		$.yql("select * from yahoo.finance.quotes where symbol='" + companySymbol + "' and StockExchange='NasdaqNM'",function(content){
			var stock = content.query.results.quote;
			if(stock.StockExchange != null){
				var updateItem = $('#portfolio #'+companySymbol)
				//something you want delayed
				$(this).find('.stockTime').replaceWith(stock.LastTradeTime + ' : ' + stock.LastTradeDate);
				$(this).find('.stockPrice').replaceWith(stock.AskRealtime);
				$(this).find('.stockChange').replaceWith(stock.Change);
				$(this).find('.stockHigh').replaceWith(stock.DaysHigh);
				$(this).find('.stockLow').replaceWith(stock.DaysLow);
				updateStockInfo(companySymbol);
				console.log("update");
			}else{
				console.log("Company not available");
			}
		});
	}
	
});
