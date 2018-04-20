// 点击事件
function() {
  var dearCode = $("#optDealer").find("option:selected").val()
  var $show = $(".clear .AM-btn-red").attr("data-show");
  //console.log($show);
  if (dearCode != "") {

    mapCommon.firstInfo(dearCode);
    $(".deal-map-detail").addClass("active");
  } else {
    mapCommon.DeletePoint();
    $(".deal-map-detail").removeClass("active");

  }
  mapCommon.loadInfo();
  mapCommon.AddMarker();

}


/* 省、市、特约店交互操作ajax */
function areaInitFunction(provinceSelect, provinceText, citySelect, cityText, dealerSelect, dealerText, dealerAddressText) {
	if($.isEmptyObject(provinceSelect)) {
		return;
	}
	//省级下拉事件
	provinceSelect.on("change", function() {
		//重新设置市和特约店

		provinceText.html("请选择省份");

		if(!$.isEmptyObject(citySelect)) {
			citySelect.html("");
		}
		if(!$.isEmptyObject(cityText)) {
			cityText.html("请选择城市");
		}

		if(!$.isEmptyObject(dealerSelect)) {
			dealerSelect.html("");
		}
		if(!$.isEmptyObject(dealerText)) {
			dealerText.html("请选择特约店");
		}

		if(!$.isEmptyObject(dealerAddressText)) {
			dealerAddressText.html("");
		}

		//省下拉事件后
		var selectedProvince = provinceSelect.find("option:selected");
		if(selectedProvince != null && selectedProvince.val() != null && selectedProvince.val() != "") {
			provinceText.html(selectedProvince.text());

			//异步加载市信息
			$.ajax({
				type: "post",
				url: "?d=ws&type=city&id=" + selectedProvince.val(),
				dataType: "html",
				success: function(result) {
					if(!$.isEmptyObject(citySelect)) {
						citySelect.html(result);
					}
				}
			});
		}
	});

	if($.isEmptyObject(citySelect)) {
		return;
	}

	//市下拉事件
	citySelect.on("change", function() {
		cityText.html("请选择城市");

		if(!$.isEmptyObject(dealerSelect)) {
			dealerSelect.html("");
		}
		if(!$.isEmptyObject(dealerText)) {
			dealerText.html("请选择特约店");
		}

		if(!$.isEmptyObject(dealerAddressText)) {
			dealerAddressText.html("");
		}

		//市下拉事件之后
		var selectedCity = citySelect.find("option:selected");
		if(selectedCity != null && selectedCity.val() != null && selectedCity.val() != "") {
			cityText.html(selectedCity.text());

			//异步加载特约店信息
			$.ajax({
				type: "post",
				url: "?d=ws&type=dealer&id=" + selectedCity.val(),
				dataType: "html",
				success: function(result) {
					if(!$.isEmptyObject(dealerSelect)) {
						dealerSelect.html(result);
					}
				}
			});
		}
	});

	if($.isEmptyObject(dealerSelect)) {
		return;
	}
	//特约店下拉事件
	dealerSelect.on("change", function() {
		dealerText.html("");

		if(!$.isEmptyObject(dealerAddressText)) {
			dealerAddressText.html("");
		}

		var selectedDealer = dealerSelect.find("option:selected");
		if(selectedDealer != null && selectedDealer.val() != null && selectedDealer.val() != "") {
			if(dealerAddressText != null) dealerAddressText.html(selectedDealer.attr("data-address"));
			dealerText.html(selectedDealer.text());
		}
	});
}

/* 下拉选择时显示切换 */
function selectChangeDisplay(selectObj, displayObj) {
	if(isMobile.Status() == "desktop") {
		//绑定html下拉div
		duplicateSelectOptionToDiv(selectObj);
	} else {
		selectObj.on("change", function() {
			var selectText = selectObj.find("option:selected").text();
			if(!$.isEmptyObject(displayObj) && !$.isEmptyObject(selectText)) {
				displayObj.html(selectText);
			}
		});
	}
}

/* 获取固话的号码 */
function getLinePhoneNumber(landlineArea, landlineNum, landlineSubNum) {
	var num = "";

	if(landlineArea.val().trim() != "" && landlineArea.val() != landlineArea.attr("data-tags")) {
		num += landlineArea.val().trim();
		areaNum = landlineArea.val().trim();
	}

	if(landlineNum.val().trim() != "" && landlineNum.val() != landlineNum.attr("data-tags")) {
		if(num != "") {
			num += "-" + landlineNum.val().trim();
		} else {
			num += landlineNum.val().trim();
		}
	}

	if(landlineSubNum.val().trim() != "" && landlineSubNum.val() != landlineSubNum.attr("data-tags")) {
		if(num != "") {
			num += "-" + landlineSubNum.val().trim();
		} else {
			num += landlineSubNum.val().trim();
		}
	}
	return num;
}

/* 获取移动电话号码 */
function getMobilePhoneNumber(mobilePhone) {
	if(mobilePhone.val().trim() != "" && mobilePhone.val() != mobilePhone.attr("data-tags")) {
		return mobilePhone.val();
	}
	return "";
}

/* 获取文本框数据录入值（剔除data-tags后的值) */
function getInputBoxValue(txtInput) {
	if(txtInput != null && txtInput.val() != null && txtInput.val().trim() != "" && txtInput.val() != txtInput.attr("data-tags")) {
		return txtInput.val();
	}
	return "";
}

/* 加载省、市、特约店扩展的JS */
function loadProvinceCityDealerExpress(province, provinceText, city, cityText,
	dealer, dealerText, dealerAddress,
	provinceLoadedHander, cityLoadedHander, dealerLoadedHander,
	locatedHander) {

	var $provinceLocateMapLocateID = "";
	var $cityLocateMapLocateID = "";
	var $dealerLocateMapLocateID = "";

	//加载省的HTMl
	var loadProvinceHtml = function(data) {
		if(province != null) {
			province.html(data);

			//省加载的事件
			if(provinceLoadedHander != null) {
				provinceLoadedHander();
			}

			//复制省份下拉信息
			duplicateSelectOptionToDiv(province);

			//171213 modify 跳转到预约试驾默认选中特约店
			if(getQueryString("dealerID") != null) {
				province.val(getQueryString("PROVINCE_ID"));
				provinceText.html(province.find("option:selected").text());
				loadCityEvent();
				city.val(getQueryString("cityID"));
				cityText.html(city.find("option:selected").text());
				loadDealerEvent();
				dealer.val(getQueryString("dealerID"));
				dealerText.html(dealer.find("option:selected").text());
				dealerAddress.html(dealer.find("option:selected").data("address"));
			}
			//
			if(autoLocationPostion != null) {
				autoLocationPostion();
				autoLocationPostion = null;
			}
		}
	};

	//加载市的HTML
	var loadCityHtml = function(data) {
		if(city != null) {
			city.html(data);

			//城市加载后事件
			if(cityLoadedHander != null) {
				cityLoadedHander();
			}

			//设置城市默认选中
			if($cityLocateMapLocateID != null && $cityLocateMapLocateID != "") {
				city[0].value = $cityLocateMapLocateID;
				$cityLocateMapLocateID = "";
				city.trigger("change");
			}

			//复制城市下拉信息
			duplicateSelectOptionToDiv(city);
		}

		//调用地图定位结束事件
		if(locatedHander != null) {
			locatedHander();
		}
	};

	//加载特约店
	var loadDealerHtml = function(data) {
		if(dealer != null) {
			dealer.html(data);

			//特约店事件触发
			if(dealerLoadedHander != null) {
				dealerLoadedHander();
			}

			//设置特约店默认选中
			if($dealerLocateMapLocateID != null && $dealerLocateMapLocateID != "") {
				dealer[0].value = $dealerLocateMapLocateID;
				$dealerLocateMapLocateID = "";
				dealer.trigger("change");
			}

			//复制特约店下拉信息
			duplicateSelectOptionToDiv(dealer);
		}
	};

	//加载市的事件
	var loadCityEvent = function() {
		if(city != null && province != null) {
			var provinceId = province.find("option:selected").val();
			//$.get("/Ajax/CommonHandler.ashx", { "method": "CityHtml", "b": "true", "id": provinceId }, loadCityHtml);
			//new method start
			var returnCHTML = "<option value=\"\" data-code=\"\" data-areacode=\"\">请选择城市</option>";
			var requestCity = $.grep(global_city_data, function(item, index) {
				return item.PROVINCE_ID == provinceId;
			});
			$.grep(requestCity, function(item, index) {
				returnCHTML += "<option value='" + item.CITY_ID + "' data-code='" + item.CITY_ID + "'>" + item.CITY_NAME + "</option>";
			});
			loadCityHtml(returnCHTML);
			//new method end
			city.change(citySelectChange);
		}
	};

	//加载特约店事件
	var loadDealerEvent = function() {
		if(dealer != null && city != null) {
			var cityId = city.find("option:selected").val();
			//$.get("/Ajax/CommonHandler.ashx", { "method": "DealerHtml", "b": "true", "id": cityId }, loadDealerHtml);
			//new method start
			var returnDHTML = "<option value=\"\" data-code=\"\" data-areacode=\"\">请选择特约店</option>";
			var requestDealer = $.grep(global_dealers_data, function(item, index) {
				return item.CITY_ID == cityId;
			});
			$.grep(requestDealer, function(item, index) {
				returnDHTML += "<option value=\"" + item.DEALER_ID + "\" data-code=\"" + item.DEALER_ID + "\" data-address=\"" + item.ADDRESS + "\">" + item.DEALER_NAME + "</option>";
			});
			loadDealerHtml(returnDHTML);
			//new method end
			dealer.change(dealerSelectChange);
		}
	};

	//省下拉选择事件
	var provinceSelectChange = function() {
		if(city != null) city.html("");
		if(dealer != null) dealer.html("");

		if(cityText != null) cityText.html("请选择城市");
		if(dealerText != null) dealerText.html("请选择特约店");
		if(dealerAddress != null) dealerAddress.html("");
		var provinceName = province.find("option:selected").text();
		var provinceID = province.find("option:selected").val();
		if(provinceText != null) provinceText.html(provinceName);
		if(provinceID == null || provinceID == "") {
			if(provinceText != null) provinceText.html("请选择省份");
		}

		//加载城市
		loadCityEvent();
		$("#optDealer").html('<option value="" data-code="" data-areacode="">请选择特约店</option>');

		//阻止其它响应
		return false;
	};

	//市下拉选择事件
	var citySelectChange = function() {
		if(dealer != null) dealer.html("");

		if(dealerText != null) dealerText.html("请选择特约店");
		if(dealerAddress != null) dealerAddress.html("");
		var cityName = city.find("option:selected").text();
		var cityID = city.find("option:selected").val();
		if(cityText != null) cityText.html(cityName);
		if(cityID == null || cityID == "") {
			if(cityText != null) cityText.html("请选择城市");
		}

		loadDealerEvent();
		//阻止其它响应
		return false;
	};

	//特约店下拉事件
	var dealerSelectChange = function() {
		var dealerName = dealer.find("option:selected").text();
		var dealerID = dealer.find("option:selected").val();
		var dealerAddr = dealer.find("option:selected").data("address");
		if(dealerText != null) dealerText.html(dealerName);
		if(dealerAddress != null) dealerAddress.html(dealerAddr);
		if(dealerID == null || dealerID == "") {
			if(dealerText != null) dealerText.html("请选择特约店");
			if(dealerAddress != null) dealerAddress.html("");
		}
	};

	//加载省信息
	if(province != null) {
		//$.get("/Ajax/CommonHandler.ashx", { "method": "ProvinceHtml", "b": "true" }, loadProvinceHtml);
		//new method start
		var returnPHTML = "<option value=\"\" data-code=\"\" data-areacode=\"\">请选择省份</option>";
		var requestProvince = $.grep(global_province_data, function(item, index) {
			returnPHTML += "<option value='" + item.PROVINCE_ID + "' data-code='" + item.PROVINCE_ID + "' data-areacode='" + item.ZONE_ID + "'>" + item.PROVINCE_NAME + "</option>";
			//return item.PROVINCE_NAME == "广东";
		});
		loadProvinceHtml(returnPHTML);
		//new method end
		province.change(provinceSelectChange);

	}

	//获取坐标成功
	var successFunction = function(position) {
		if(position != null && position.status == 0) {
			var long = position.content.point.x;
			var lat = position.content.point.y;
			var provinceName = position.content.address_detail.province;
			var cityName = position.content.address_detail.city;
			$.getJSON("/Ajax/CommonHandler.ashx", {
				"method": "SearchProvinceCityDealerPosition",
				"lon": long,
				"lat": lat,
				"province": provinceName,
				"city": cityName
			}, loadProvinceCity);
		}
	};

	//根据反馈信息加载json对象
	var loadProvinceCity = function(data) {
		if(data != null && data != "") {
			$provinceLocateMapLocateID = data.Province;
			$cityLocateMapLocateID = data.City;
			$dealerLocateMapLocateID = data.Dealer;

			if(province != null) {
				province[0].value = $provinceLocateMapLocateID;
				$provinceLocateMapLocateID = "";
				province.trigger("change");
			}
		}
	};

	//自动定位操作
	var autoLocationPostion = function() {
		$.ajax({
			url: "http://api.map.baidu.com/location/ip?ak=F4bf2caf2978f6dc7d65e17ec69dfb28&coor=bd09ll",
			type: "GET",
			dataType: "JSONP",
			success: successFunction
		});
	};
}

/* 分享 */
var jiathis_config = {
	url: "",
	title: "",
	summary: ""
};
//var jiathis_config = {
//    shareImg: {
//        "showType": "MARK",
//        "bgColor": "",
//        "txtColor": "",
//        "text": "",
//        "services": "",
//        "position": "",
//        "imgwidth": "",
//        "imgheight": ""
//    }
//}
/* 分享按钮 */
function GetShare(obj) {
	var parentObj = $(obj).parents('.popupBox').find('.slides .flex-active-slide');
	//parentObj.parents("ul").find("img").removeClass("JIATHIS_IMG_OK");
	//parentObj.find("img").addClass("JIATHIS_IMG_OK");
	jiathis_config.url = window.location.href;
	jiathis_config.title = '广汽本田HONDA';
	jiathis_config.summary = '';
}

/* 自动复制下拉列表数据到div层中 */
function duplicateSelectOptionToDiv(selecOption) {
	//增加手机版验证功能
	if(isMobile && isMobile.Status()) {
		if(isMobile.Status() != "desktop") {
			//手机版不操作
			return;
		}
	}

	var parentSelect = selecOption.parent();
	if(!parentSelect.find(".selectList").length > 0) {
		parentSelect.append("<div class=\"selectList\"></div>");
	}
	var divSelectList = parentSelect.children(".selectList");
	divSelectList.html("");
	selecOption.children().each(function() {
		divSelectList.append("<p value=\"" + $(this).val() + "\">" + $(this).text() + "</p>");
	});
	//隐藏原有下拉
	selecOption.hide();

	var divSelectDownClick = function() {
		if($(window).scrollTop() - ($(this).offset().top - $(window).height()) < 220) {
			divSelectList.css({
				'bottom': $(this).height(),
				'top': 'auto'
			})
		} else {
			divSelectList.css({
				'bottom': 'auto',
				'top': $(this).height()
			})
		}

		if(divSelectList.children().size() >= 5) {
			divSelectList.height(100).css("overflow-y", "scroll");
		}

		divSelectList.slideDown(220);

		divSelectList.delegate("p", "click", function() {
			$(this).unbind("click");
			parentSelect.find(".selectVal").addClass("selectValBlur").html($(this).text());
			divSelectList.slideUp(220, function() {
				parentSelect.find(".selectVal").addClass("selectValBlur").removeClass("selectBoxBlur");
			});

			//设置下拉菜单的值并触发事件
			selecOption[0].value = $(this).attr("value");
			selecOption.trigger("change");
		});

		$(document).click(function(event) {
			if(!$.contains(parentSelect[0], event.target)) {
				parentSelect.find(".selectList").hide();
				parentSelect.find(".selectVal").addClass("selectValBlur").removeClass("selectBoxBlur");
			}
		});
	};

	//给div下拉增加点击事件
	parentSelect.find(".selectNav").unbind("click");
	parentSelect.find(".selectVal").unbind("click");
	parentSelect.find(".selectNav").bind("click", divSelectDownClick);
	parentSelect.find(".selectVal").bind("click", divSelectDownClick);
}
/* 获取查询的URL参数 */
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if(r != null) return unescape(r[2]);
	return null;
}

/* 品牌下拉选择切换 */
function brandOptionChangeJumpUrl(selectOpt) {
	window.location = "/about/brandling/" + $(selectOpt).find("option:selected").val()
}

/* 百度地图定位 */
function locationPostionByBaidu(locationFunc) {
	if(locationFunc) {
		$.ajax({
			url: "http://api.map.baidu.com/location/ip?ak=F4bf2caf2978f6dc7d65e17ec69dfb28&coor=bd09ll",
			type: "GET",
			dataType: "JSONP",
			success: locationFunc
		});
	}
}

/* 隐藏购车工具区弹出地图 */
function popuHidenMapInCarTools() {
	$.showPopup('.popMaps');

	//初始化首页的时间
	var parentTime = $("input[name='time']:checked");
	if(parentTime != null) {
		var checkedValue = parentTime.val();
		var popupCheckTimeCheck = $("input[name='testTime'][value='" + checkedValue + "']");
		if(popupCheckTimeCheck != null) {
			popupCheckTimeCheck.attr("checked", "checked");
		}
	}
	//初始化计划购车时间
	var parentPlanTime = $("input[name='plan']:checked");
	if(parentPlanTime != null) {
		var checkedPlanValue = parentPlanTime.val();
		var popupBuyTimeCheck = $("input[name='buyTime'][value='" + checkedValue + "']");
		if(popupBuyTimeCheck != null) {
			popupBuyTimeCheck.attr("checked", "checked");
		}
	}
	//计划购车时间
	var parentConnectTime = $("#connectTime option:selected");
	if(parentConnectTime != null) {
		var popupConnectOpt = $("#optConnectTimeMap");
		if(popupConnectOpt != null) {
			popupConnectOpt.children().each(function() {
				$(this).removeAttr("selected");
			});
			popupConnectOpt.find("option[value='" + parentConnectTime.val() + "']").attr("selected", true);
			popupConnectOpt.trigger("change");
			var popupConnectOptText = $("#txtConnectTimeMap");
			if(popupConnectOptText != null) {
				popupConnectOptText.text(popupConnectOpt.find("option:selected").text());
			}
		}
	}

	if(isMobile && isMobile.Status() == "desktop") {
		$("#map").width(510);
		$("#map").height(489);
	} else {
		//$("#map").width($(window).width() - 65);
		$("#map").width($(".carsDealerFilter.clearFix").width() + 20);
		$("#map").height(289);
	}
}