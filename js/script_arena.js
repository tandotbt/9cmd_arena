const dataArenaError = [{
  "rankid": 0,
  "score": 0,
  "avatarname": "Error load data",
  "avataraddress": "0xabcd",
  "cp": 0,
  "roundid": 0,
  "currenttickets": 0,
  "win": 0,
  "lose": 0,
  "purchasedTicketCount": 0,
  "purchasedTicketNCG": 0,
  "stake": 0,
  "purchasedTicketCountOld": 0,
  "messageImg": null,
  "messageButton": null
}, {
  "rankid": 0,
  "score": 0,
  "avatarname": "Error load data",
  "avataraddress": "0xabcd",
  "cp": 0,
  "roundid": 0,
  "currenttickets": 0,
  "win": 0,
  "lose": 0,
  "purchasedTicketCount": 0,
  "purchasedTicketNCG": 0,
  "stake": 0,
  "purchasedTicketCountOld": 0,
  "messageImg": null,
  "messageButton": null
}]


function scrollToTop() {
  $("html, body").animate({
    scrollTop: 0,
  },
    "300"
  );
}

function rangeSlide(value) {
  document.getElementById("rangeValue").innerHTML = value;
}

function rangeSlide2(value) {
  document.getElementById("rangeValue2").innerHTML = value;
}

function copy(button) {
  var rowId = button.getAttribute("data-rowid");
  var copyText = document.getElementById("Input" + rowId);
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(copyText.value);

  var tooltip = document.getElementById("Tooltip" + rowId);
  tooltip.innerHTML = "Copied: " + copyText.value;
}

function out(button) {
  var rowId = button.getAttribute("data-rowid");
  var tooltip = document.getElementById("Tooltip" + rowId);
  tooltip.innerHTML = "Copy to clipboard";
}

function copyText() {
  var inputElement = document.getElementById("selectedItems");
  inputElement.select();
  document.execCommand("copy");
}

function uncheckAll() {
  $('#myTable input[type="checkbox"]').prop("checked", false);
  handleCheckboxChange();
}

function sortColumn(colIdx) {
  const $cells = $(`tr > td:nth-child(${colIdx + 1})`, "#myTable");
  $("#myTable").append(
    sortSecondByFirst(
      $cells.get().map((cell) => {
        const $input = $("input[type=checkbox]", cell);
        const value = $input.length ? $input.prop("checked") : $(cell).text();
        return [value, $(cell).parent()];
      })
    )
  );
}

function sortSecondByFirst(pairs) {
  const sorted = [...pairs].sort(([a], [b]) => compare(a, b)).map(([, a]) => a);
  if (pairs.every(([, a], i) => a === sorted[i])) {
    sorted.reverse(); // Was already sorted
  }
  return sorted;
}

function searchItemFun() {
  // Declare variables
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("searchItem");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Kiểm tra nếu chuỗi tìm kiếm có ít hơn 3 ký tự
  if (filter.length < 3) {
    // Ẩn tất cả các hàng
    for (i = 0; i < tr.length; i++) {
      tr[i].style.display = "none";
    }
    // Hiển thị 10 hàng mặc định
    for (i = 0; i < initialRows; i++) {
      tr[i].style.display = "";
    }
  } else {
    // Loop through all table rows, and hide those that don't match the search query
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[2];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}

function handleButtonClick(button) {
  var buttons = document.querySelectorAll(".button-11");
  var radioInputs = document.querySelectorAll("input[type='radio']");

  // Vòng lặp qua từng button và tắt khả năng nhấp lại bằng cách thêm thuộc tính "disabled"
  buttons.forEach(function (button) {
    button.disabled = true;
    button.classList.add("dark-mode");
  });

  // Vòng lặp qua từng input radio và tắt khả năng chọn bằng cách thêm thuộc tính "disabled"
  radioInputs.forEach(function (radioInput) {
    radioInput.disabled = true;
  });

  // Sau 6 giây, cho phép nhấp lại các button và input radio, và xóa thuộc tính "disabled"
  setTimeout(function () {
    buttons.forEach(function (button) {
      button.disabled = false;
      button.classList.remove("dark-mode");
    });

    radioInputs.forEach(function (radioInput) {
      radioInput.disabled = false;
    });
  }, 6000);

  var selectedItems = [];
  var selectedItemCount = 0;

  // Lấy giá trị itemId từ button được nhấp
  var itemId = $(button).data("itemid");
  var enemyCP = $(button).data("cp");
  // Lấy giá trị của radio được chọn
  var selectedRadioValue = $('input[name="avatarSelection"]:checked').val();
  var selectedRadioValue2 = $('input[name="avatarSelection"]:checked').data("cp");


  // Lấy số thứ tự của sinh viên từ ID của button
  var studentId = button.id.split("-")[1];
  var sessionDataArena = getDataFromLocalStorage("sessionDataArena", selectedRadioValue + "/" + selectedRadioValue2);

  // Dùng 9capi sim
  var putData = {
    avatarAddress: selectedRadioValue,
    enemyAddress: itemId,
  };
  sendPostRequest(url_9capi_sim, putData, function (response, status) {
    var resultButton = $("#button-" + studentId);
    if (status === "success") {
      resultButton.text(response.winPercentage + "%");

      if (sessionDataArena === null) {
        sessionDataArena = {};
      }

      sessionDataArena[itemId] = response.winPercentage + "/" + enemyCP;
    } else {
      resultButton.text("-1%");

      if (sessionDataArena === null) {
        sessionDataArena = {};
      }

      sessionDataArena[itemId] = "-1/0";
    }

    addDataForLocalStorage("sessionDataArena", selectedRadioValue + "/" + selectedRadioValue2, sessionDataArena);
  });
}

function sendPostRequest(url, data, callback) {
  $.ajax({
    url: url,
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    success: function (response, status) {
      callback(response, status);
    },
    error: function (xhr, status, error) {
      console.log("Error:", error);
    },
  });
}

function checkAndGetAvatarDCC(char) {
  dataAvatarDCC = getDataFromLocalStorage("sessionDataArena", "dataAvatarDCC")
  char = char.toLowerCase(); // Chuyển đổi char về chữ in thường
  for (const key in dataAvatarDCC) {
    if (key.toLowerCase() === char) {
      return dataAvatarDCC[key];
    }
  }
  return null;
}

function saveImageToCache(imageUrl, cacheKey) {
  // Tạo một XMLHttpRequest để tải ảnh
  var xhr = new XMLHttpRequest();
  xhr.open('GET', imageUrl, true);
  xhr.responseType = 'blob';

  xhr.onload = function () {
    if (xhr.status === 200) {
      var blob = xhr.response;

      // Tạo một FileReader để đọc dữ liệu từ blob thành base64
      var reader = new FileReader();
      reader.onloadend = function () {
        var imageData = reader.result;

        addDataForSessionStorage("myCache", cacheKey, imageData);
      };
      reader.readAsDataURL(blob);
    }
  };

  xhr.send();

}


function replaceColumnWithImage() {
  // Tạo một IntersectionObserver
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      // Kiểm tra xem ô có trong khung nhìn hay không
      if (entry.isIntersecting) {
        var cell = entry.target;
        var avataraddress = cell.getAttribute("id").replace("imgCell-", "");
        // Lấy giá trị số thứ tự student1
        var avatarIndex = cell.getAttribute("data-index");
        var avatarAddress = avataraddress.toLowerCase();
        var imgDCC = checkAndGetAvatarDCC(avatarAddress);
        var portraitId = cell.getAttribute("data-portraitId");
        var myMessage = cell.getAttribute("data-message");
        $.getJSON(URL_9CSCAN + "/account?avatar=" + avataraddress).done(function (apiData) {
          var level; // New variable to store the level
          var NCGBalance;
          // Tìm kiếm trong mảng JSON để tìm giá trị phù hợp với avatarAddress
          var matchingAvatar = apiData.find(function (item) {
            return item.avatarAddress.toLowerCase() === avatarAddress;
          });

          if (matchingAvatar) {
            level = matchingAvatar.avatar.level; // Assign the level value
            NCGBalance = matchingAvatar.goldBalance;
            $("#showNCGBalance-" + avatarIndex).text(NCGBalance);
            var armorId = 10200000; // ID mặc định
            // Kiểm tra xem mảng equipments có tồn tại hay không
            if (!matchingAvatar.avatar.inventory || matchingAvatar.avatar.inventory.equipments.length === 0) {
              var armorEquipment = false;
            } else {
              // Tìm trong mảng equipments để tìm giá trị id của "itemSubType": "ARMOR"
              var armorEquipment = matchingAvatar.avatar.inventory.equipments.find(function (equipment) {
                return equipment.itemSubType === "ARMOR";
              });
            }

            if (armorEquipment) {
              armorId = armorEquipment.id;
            }
            // Kiểm tra cache trong localStorage
            var cachedImage, cachedFrameUrl, cachedBadgeLevelUrl;
            if (imgDCC !== null) {
              cachedImage = getDataFromSessionStorage("myCache", imgDCC);
              cachedFrameUrl = getDataFromSessionStorage("myCache", "character_frame_dcc");
            } else if (portraitId !== 0) {
              cachedImage = getDataFromSessionStorage("myCache", portraitId);
              cachedFrameUrl = getDataFromSessionStorage("myCache", "character_frame");
            } else {
              cachedImage = getDataFromSessionStorage("myCache", armorId);
              cachedFrameUrl = getDataFromSessionStorage("myCache", "character_frame");
            }
            cachedBadgeLevelUrl = getDataFromSessionStorage("myCache", "badgeLevel");

            if (cachedImage) {
              imageUrl = cachedImage;
            } else {
              if (imgDCC !== null) {
                imageUrl = "https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/PFP/" + imgDCC + ".png";
                saveImageToCache(imageUrl, imgDCC);
              } else if (portraitId !== 0) {
                imageUrl = "https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/" + portraitId + ".png";
                saveImageToCache(imageUrl, portraitId);
              } else {
                imageUrl = "https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/" + armorId + ".png";
                saveImageToCache(imageUrl, armorId);
              }
            }

            if (cachedFrameUrl) {
              frameUrl = cachedFrameUrl;
            } else {
              if (imgDCC !== null) {
                frameUrl = "https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/character_frame_dcc.png";
                saveImageToCache(frameUrl, "character_frame_dcc");
              } else {
                frameUrl = "https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/character_frame.png";
                saveImageToCache(frameUrl, "character_frame");
              }
            }

            if (cachedBadgeLevelUrl) {
              badgeLevelUrl = cachedBadgeLevelUrl;
            } else {
              badgeLevelUrl = "https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/Character_Level_Bg.png";
              saveImageToCache(badgeLevelUrl, "badgeLevel")
            }

            if (myMessage !== "none") {
              var myMess = "<span class='tooltiptext' style='z-index: 9999;margin-bottom: 35px;'>" + decodeURIComponent(myMessage) + "</span>"
            } else {
              var myMess = ""
            }
            cell.innerHTML =
              "<label class='clickMeCSS' for='radio-" +
              avatarIndex +
              "'><div class='image-container tooltip'>" +
              "<div style='z-index: 1;position: absolute;padding-left: 26px;padding-bottom: 35px;font-size: 13px;font-family: monospace;color: lightyellow;white-space: nowrap;'>" +
              level +
              "</div>" +
              "<img class='image notChoiceMeCSS' src='" +
              imageUrl +
              "'>" +
              "<img style='padding-left: 26px;padding-bottom: 35px;'class='image notChoiceMeCSS' src='" + badgeLevelUrl + "'>" +
              "<img class='image notChoiceMeCSS' src='" + frameUrl + "'>" + myMess + "</div>" +
              "<label>";
          }
        });

        // Dừng quan sát ô hiện tại sau khi đã áp dụng hàm replaceColumnWithImage()
        observer.unobserve(cell);
      }
    });
  });

  // Lấy tất cả các ô trong cột 2
  //var cells = document.querySelectorAll("#myTable td:nth-child(2)");
  var rows = document.querySelectorAll("#myTable tr:not([style*='display: none;'])");
  var cells = [];

  rows.forEach(function (row) {
    var cell = row.querySelector("td:nth-child(2)");
    if (cell) {
      cells.push(cell);
    }
  });
  // Quan sát mỗi ô
  cells.forEach(function (cell) {
    observer.observe(cell);
  });
}

function replaceColumnWith_PhanTramWin() {
  // Tạo một IntersectionObserver
  // Sử dụng % win đã lưu nếu có
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      // Kiểm tra xem ô có trong khung nhìn hay không
      if (entry.isIntersecting) {
        var cell = entry.target;
        // Lấy giá trị số thứ tự student1
        avatarIndex = cell.getAttribute("data-index");
        var selectedRadioValue = $('input[name="avatarSelection"]:checked').val();
        var selectedRadioValue2 = $('input[name="avatarSelection"]:checked').data("cp");
        var sessionDataArena = getDataFromLocalStorage("sessionDataArena", selectedRadioValue + "/" + selectedRadioValue2);
        var button = $("#button-" + avatarIndex);
        button.text("-1%")
        var itemId = button.data("itemid");
        var selectedAvatarEmenyIndex = parseInt($('input[name="avatarSelectionAttack"]:checked').attr("id").split("-")[1]);
        // if (selectedAvatarEmenyIndex == avatarIndex) {
        //   var phanTramWin = $("#button-" + avatarIndex).text();
        //   $("#tryAttackArenaLite_button span").text(phanTramWin);
        // }
        if (sessionDataArena && Object.keys(sessionDataArena).length !== 0) {

          var studentId = avatarIndex;
          var enemyCP = button.data("cp");

          for (var key in sessionDataArena) {
            if (key.toLowerCase() === itemId.toLowerCase()) {
              var [winRateOld, enemyCPOld] = sessionDataArena[key].split("/");

              if (parseInt(enemyCPOld) === parseInt(enemyCP)) {
                button.text(winRateOld + "%");
                break;
              }
            }
          }
        }
        // Dừng quan sát ô hiện tại sau khi đã áp dụng hàm replaceColumnWithImage()
        //observer.unobserve(cell);
      }
    });
  }, {
    root: null,
    rootMargin: "0px",
    threshold: 0.25
  });

  // Lấy tất cả các ô trong cột 2
  //var cells = document.querySelectorAll("#myTable td:nth-child(2)");
  var rows = document.querySelectorAll("#myTable tr:not([style*='display: none;'])");
  var cells = [];

  rows.forEach(function (row) {
    var cell = row.querySelector("td:nth-child(2)");
    if (cell) {
      cells.push(cell);
    }
  });
  // Quan sát mỗi ô
  cells.forEach(function (cell) {
    observer.observe(cell);
  });
}
var timerRefreshTableData;

function refreshTableData_infoEmeny() {


  resetData = `
	<td>-</td>
	<td>-</td>
	<td colspan="10">-</td>
	`;
  var newRow = $("<tr class='notHide infoEnemy'></tr>").html(resetData);
  $("#infoTable tr.infoEnemy").replaceWith(newRow);
}

function refreshTableData(isPreRound = false) {
  // Thêm CSS dark-mode cho nút resetButton
  $("#resetButton").addClass("dark-mode");

  // Tắt khả dụng của nút resetButton trong 5 giây
  $("#resetButton").prop("disabled", true);
  setTimeout(function () {
    $("#resetButton").prop("disabled", false);
    $("#resetButton").removeClass("dark-mode");
  }, 5000);

  // Reset input number
  $("#numberInput").val("1");
  $("#rangeInput").val("0");
  $("#rangeInput2").val("0");
  $("#searchItem").val("")
  var resetData = `
  <td>-</td>
  <td><img src='../assets/loading_small.gif'></td>
  <td colspan="10">-</td>
  `;
  var newRow = $("<tr class='notHide infoYou'></tr>").html(resetData);
  $("#infoTable tr.infoYou").replaceWith(newRow);
  refreshTableData_infoEmeny();
  var resetData = `
	<tr>
	<td>-</td>
	<td><img src="../assets/loading_small.gif" /></td>
	<td>-------------------------</td>
	<!-- <td>-</td> -->
	<td>--------</td>
	<td>-----</td>
	<td>-</td>
	<td>---/---</td>
	<td>------</td>
	<td>-</td>
	<td>---</td>
	<td>-</td>
	</tr>
`;
  $("#myTable tr:not(.sticky, .notHide)").remove();
  $("#myTable").append(resetData);
  // Đặt số lượng hiển thị của More+ về mặc định
  var currentVisibleRows = initialRows;
  // Xóa gợi ý
  $('#suggestList').empty();
  //Lấy dữ liệu DCC
  $.getJSON("https://api.dccnft.com/v1/9c/avatars/all")
    .done(function (apiDCCData) {
      addDataForLocalStorage("sessionDataArena", "dataAvatarDCC", apiDCCData.avatars)
      console.log("Sử dụng ảnh DCC");
    })
    .fail(function (jqXHR, textStatus, error) {
      // Xử lý khi yêu cầu thất bại
      addDataForLocalStorage("sessionDataArena", "dataAvatarDCC", {})
      console.log("Sử dụng ảnh thường");
      console.log("Lỗi khi lấy dữ liệu từ API DCC:", error);
    });

  function hop_nhat_data_phu(apiData1) {
    fetch(url_jsonblod_data_arena_2)
      .then(response2 => response2.json())
      .then(apiData2 => {
        if (Array.isArray(apiData2) && apiData2.length > 0) {
          // Hợp nhất dữ liệu từ hai API
          const mergedData = apiData1.map(data1 => {
            const matchingData2 = apiData2.find(data2 => data2?.avataraddress?.toLowerCase() === data1.avataraddress.toLowerCase());
            return {
              ...data1,
              win: matchingData2?.win || 0,
              lose: matchingData2?.lose || 0,
              currenttickets: matchingData2?.currenttickets || 0,
              purchasedTicketCount: matchingData2?.purchasedTicketCount || 0,
              purchasedTicketNCG: matchingData2?.purchasedTicketNCG || 0,
              nextPTNCG: matchingData2?.nextPTNCG || 0,
              stake: matchingData2?.stake || 0,
              purchasedTicketCountOld: matchingData2?.purchasedTicketCountOld || 0,
              cp: matchingData2?.cp || 0,
              portraitId: matchingData2?.portraitId || ""
            };
          });
          creatTableArena(mergedData);
        } else {
          console.log('API 2 không trả về một mảng hợp lệ');
          creatTableArena(apiData1);
        }
      });
  }

  function get_data_arena_from_9capi() {
    $.getJSON(url_9capi_leadboard)
      .done(function (apiData1Total) {
        // Chỉ xếp 3000 đối tượng đầu tiên
        const apiData1 = apiData1Total.slice(0, 3000);
        if (Array.isArray(apiData1) && apiData1.length === 0 && apiData1.length < 10) {
          // Dữ liệu trả về là một mảng rỗng
          console.log("Lỗi khi lấy dữ liệu từ 9capi:", apiData1Total);
          creatTableArena(dataArenaError);
        } else {
          // Xử lý dữ liệu từ API ban đầu
          console.log("Sử dụng từ 9capi");
          // Chỉ lưu 3000 đối tượng đầu tiên
          const first3000Data = apiData1.slice(0, 3000);

          // Bản lưu dự phòng
          fetch(url_jsonblod_leadboard_2, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(first3000Data)

          });
          // Chỉ xếp SHOW_BXH_MAX đối tượng đầu tiên
          var SHOW_BXH_MAX = parseInt($('#setRankDisplay').val()) || 3000;
          var data = apiData1.slice(0, SHOW_BXH_MAX);
          hop_nhat_data_phu(data);
        }
      })
      .fail(function (jqXHR, textStatus, error) {
        // Xử lý khi yêu cầu thất bại
        console.log("Lỗi khi lấy dữ liệu từ 9capi:", error);
        creatTableArena(dataArenaError);
      });
  }
  function get_data_arena_pre_round(url) {
    $.getJSON(url)
      .done(function (apiData1Total) {
        // Chỉ xếp 3000 đối tượng đầu tiên
        const apiData1 = apiData1Total.slice(0, 3000);
        if (Array.isArray(apiData1) && apiData1.length === 0 && apiData1.length < 10) {
          // Dữ liệu trả về là một mảng rỗng
          console.log("Lỗi khi lấy dữ liệu mùa trước:", apiData1Total);
          creatTableArena(dataArenaError);
        } else {
          // Xử lý dữ liệu từ API ban đầu
          console.log("Sử dụng data mùa trước");
          // Chỉ lưu 3000 đối tượng đầu tiên
          const first3000Data = apiData1.slice(0, 3000);

          // Chỉ xếp SHOW_BXH_MAX đối tượng đầu tiên
          var SHOW_BXH_MAX = parseInt($('#setRankDisplay').val()) || 3000;
          var data = apiData1.slice(0, SHOW_BXH_MAX);
          creatTableArena(data)
        }
      })
      .fail(function (jqXHR, textStatus, error) {
        // Xử lý khi yêu cầu thất bại
        console.log("Lỗi khi lấy dữ liệu từ mùa trước:", error);
        creatTableArena(dataArenaError);
      });
  }
  var post_data_json = {
    query: 'query{arena{rank_100:leaderboard(ranking:1,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_200:leaderboard(ranking:101,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_300:leaderboard(ranking:201,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_400:leaderboard(ranking:301,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_500:leaderboard(ranking:401,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_600:leaderboard(ranking:501,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_700:leaderboard(ranking:601,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_800:leaderboard(ranking:701,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_900:leaderboard(ranking:801,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_1000:leaderboard(ranking:901,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_1100:leaderboard(ranking:1001,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_1200:leaderboard(ranking:1101,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_1300:leaderboard(ranking:1201,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_1400:leaderboard(ranking:1301,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_1500:leaderboard(ranking:1401,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_1600:leaderboard(ranking:1501,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_1700:leaderboard(ranking:1601,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_1800:leaderboard(ranking:1701,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_1900:leaderboard(ranking:1801,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_2000:leaderboard(ranking:1901,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_2100:leaderboard(ranking:2001,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_2200:leaderboard(ranking:2101,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_2300:leaderboard(ranking:2201,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_2400:leaderboard(ranking:2301,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_2500:leaderboard(ranking:2401,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_2600:leaderboard(ranking:2501,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_2700:leaderboard(ranking:2601,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_2800:leaderboard(ranking:2701,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_2900:leaderboard(ranking:2801,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}rank_3000:leaderboard(ranking:2901,length:100){rank,address,simpleAvatar{agentAddress,name},arenaScore{score}}}}',
  };
  if (isPreRound) {
    $.ajax({
      url: url_jsonblod_all_pre_round,
      type: "GET",
      dataType: "json",
      success: function (data) {
        const linkObj = data.link;
        const keyList = Object.keys(linkObj).filter(key => {
          const value = linkObj[key];
          return value.split("_").length === 4;
        });

        const maxKey = keyList.reduce((prev, current) => {
          const prevNums = prev.split("_").map(str => parseInt(str));
          const currentNums = current.split("_").map(str => parseInt(str));
          if (prevNums[0] < currentNums[0]) return current;
          if (prevNums[0] === currentNums[0] && prevNums[1] < currentNums[1]) return current;
          if (prevNums[0] === currentNums[0] && prevNums[1] === currentNums[1] && prevNums[2] < currentNums[2]) return current;
          return prev;
        });
        const url = `https://jsonblob.com/api/${linkObj[maxKey].split("_")[0]}`;
        console.log(`Lấy từ mùa cũ: ${maxKey} - ${url} - ${linkObj[maxKey]}`);
        get_data_arena_pre_round(url);
      },
      error: function (xhr, status, error) {
        console.log("Lỗi khi lấy dữ liệu từ mùa cũ: ", error);
        creatTableArena(dataArenaError)
      },
    });
  } else {
    var TIMEOUT = parseInt($('#setTimeout').val()) * 1000 || 30000
    $.ajax({
      url: URL_MIMIR_GRAPHQL,
      type: "POST",
      data: JSON.stringify(post_data_json),
      contentType: "application/json",
      timeout: TIMEOUT,
      success: function (response, status) {
        if (response && response.data && response.data.arena) { } else if (response && response.errors && response.errors[0].message) {
          console.log("Lỗi khi lấy dữ liệu từ api của game:", response.errors[0].message);
          get_data_arena_from_9capi();
        } else {
          console.log("Lỗi khi lấy dữ liệu từ api của game: Không xác định");
          get_data_arena_from_9capi();
        }
        let arenaList = [];
        for (let key in response.data.arena) {
          arenaList = arenaList.concat(response.data.arena[key]);
        }
        var processedData = arenaList
          .slice(0, 3000) // Giới hạn số lượng phần tử đầu tiên
          .map(function (participant) {
            // var nameWithHash = participant.nameWithHash;
            // var startIndex = nameWithHash.indexOf('<size=80%>'); // Tìm vị trí bắt đầu của từ '<size=80%>'
            // var avatarName = nameWithHash.substring(0, startIndex).trim(); // Chỉ giữ lại phần trước của tên và loại bỏ khoảng trắng thừa          
            return {
              rankid: participant.rank,
              score: participant.arenaScore.score,
              avatarname: participant.simpleAvatar.name,
              avataraddress: participant.address,
              // cp: 1,
              // portraitId: 10200000
            };
          });
        console.log("Sử dụng từ api game");
        // Chỉ lưu 3000 đối tượng đầu tiên
        const first3000Data = processedData.slice(0, 3000);

        // Bản lưu dự phòng
        fetch(url_jsonblod_leadboard_2, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(first3000Data)

        });
        // Chỉ xếp SHOW_BXH_MAX đối tượng đầu tiên
        var SHOW_BXH_MAX = parseInt($('#setRankDisplay').val()) || 3000;
        var data = processedData.slice(0, SHOW_BXH_MAX);
        hop_nhat_data_phu(data);
      },
      error: function (xhr, status, error) {
        console.log("Lỗi khi lấy dữ liệu từ api của game:", error);
        if (isPreRound) creatTableArena(dataArenaError)
        else get_data_arena_from_9capi();
      },
    });
  }
  timeAutoResetTable = $("#timeAutoResetTable").val();
  $("#resetButton span").text(timeAutoResetTable);
  timerRefreshTableData = setTimeout(refreshTableData, timeAutoResetTable * 1000);
}

function refreshTableDataAgain(isPreRound) {
  // Hủy định thời gian chờ hiện tại (nếu có)
  clearTimeout(timerRefreshTableData);

  // Gọi lại hàm fetchDataAvatar()
  refreshTableData(isPreRound);
}
var initialRows = 10; // Số hàng hiển thị ban đầu
var rowsToAdd = 50; // Số hàng thêm khi nhấp vào nút "Xem thêm"
var currentVisibleRows = initialRows; // Số hàng hiện tại đang được hiển thị

function creatTableArena(dataTotal) {
  // Chỉ xếp SHOW_BXH_MAX đối tượng đầu tiên
  var SHOW_BXH_MAX = parseInt($('#setRankDisplay').val()) || 3000;
  var data = dataTotal.slice(0, SHOW_BXH_MAX);
  addDataForSessionStorage("temp", "dataArena", data);
  // data.sort(function(a, b) {
  // return b.score - a.score;
  // });
  console.log(data);
  var student = "";
  // var student1 = 1;
  var totalRows = data.length;
  // var newRankid = 1;
  // var prevScore = -1;

  // ITERATING THROUGH OBJECTS
  $.each(data, function (index, value) {
    // if (index > 0 && value.score !== prevScore) {
    // newRankid = index + 1;
    // }

    // value.newRankid = newRankid;

    // prevScore = value.score;
    student1 = index + 1;
    student += "<tr>";
    student += "<td>" + "<label class='clickMeCSS' for='attackRadio-" + student1 + "'>#" + value.rankid + "<br><span class='mute-text' style='white-space: nowrap;'>no." + student1 + "</span><br><img class='notChoiceMeCSS' style='width: 1.6vw;' src='../assets/Arena_bg_21.png'/></label></td>";
    student += "<td style='width: 80px;height: 80px;' id='imgCell-" + value.avataraddress + "' data-index='" + student1 + "' data-portraitId='" + (typeof value.portraitId !== "undefined" && value.portraitId !== null ? value.portraitId : 0) + "' data-message='" + (typeof value.messageImg !== "undefined" && value.messageImg !== null ? value.messageImg : "none") + "'><img src='../assets/loading_small.gif'></td>";
    var avatarCode = value.avataraddress.substring(2, 6);
    student += "<td>" + "<div class='clickMeCSS showIconBeuty' " + `onclick='funcSelectByName("${value.avatarname} #${avatarCode}")'` + " style='font-weight: bold;' for='radio-" + student1 + "'><span class='showIconBeuty'>" + value.avatarname + "</span><span class='mute-text showIconBeuty'> #" + avatarCode + "</span></div></td>";
    // student += "<td>" + "<div for='radio-" + student1 + "'>" + value.rankid + "</div></td>";
    student += "<td>" + "<div style='white-space: nowrap;' for='radio-" + student1 + "'>" + value.cp + "</div></td>";
    student += "<td>" + "<div style='white-space: nowrap;' for='radio-" + student1 + "'>" + value.score + "</div></td>";
    student += "<td>" + "<div class='showIconBeuty' for='radio-" + student1 + "'><span class='mute-text showIconBeuty'>" + (typeof value.stake !== "undefined" && value.stake !== null ? value.stake : "-") + "<img class='notChoiceMeCSS' style='width: 1.6vw;' src='../assets/icon_Goods_0_mod.png'/></span><br><div class='showIconBeuty'>" + "<span id='showNCGBalance-" + student1 + "'>---</span>" + " <img class='notChoiceMeCSS' style='width: 1.6vw;' src='../assets/icon_Goods_0.png'/></div></div></td>";
    student += "<td>" + "<div style='white-space: nowrap;' for='radio-" + student1 + "'>" + (typeof value.win !== "undefined" && value.win !== null ? value.win : "-") + "/" + (typeof value.lose !== "undefined" && value.lose !== null ? value.lose : "-") + "</div></td>";
    student += "<td>" + "<div class='showIconBeuty' for='radio-" + student1 + "'><span class='showIconBeuty'>" + (typeof value.currenttickets !== "undefined" && value.currenttickets !== null ? value.currenttickets : "-") + "<img class='notChoiceMeCSS' style='width: 1.6vw;' src='../assets/icon_Goods_3.png'/></span> <span class='showIconBeuty'>" + (typeof value.purchasedTicketCount !== "undefined" && value.purchasedTicketCount !== null && typeof value.purchasedTicketCountOld !== "undefined" && value.purchasedTicketCountOld !== null ? (value.purchasedTicketCount - value.purchasedTicketCountOld) : "-") + "<img class='notChoiceMeCSS' style='width: 1.6vw;' src='../assets/icon_Goods_3_mod.png'/></span> <span class='showIconBeuty'>" + (typeof value.nextPTNCG !== "undefined" && value.nextPTNCG !== null ? value.nextPTNCG.toFixed(1) : "-") + "<img class='notChoiceMeCSS' style='width: 1.6vw;' src='../assets/icon_Goods_0.png'/></span><br><span class='mute-text' style='white-space: nowrap;'>" + (typeof value.purchasedTicketCount !== "undefined" && value.purchasedTicketCount !== null ? value.purchasedTicketCount : "-") + " • " + (typeof value.purchasedTicketNCG !== "undefined" && value.purchasedTicketNCG !== null ? value.purchasedTicketNCG.toFixed(1) : "-") + " ncg</span></div></td>";
    student += "<td><div class='radio-wrapper'><input id='radio-" + student1 + "' type='radio' name='avatarSelection' data-cp='" + value.cp + "' data-score='" + value.score + "' value='" + value.avataraddress + "'" + (student1 === 1 ? " checked" : "") + "/><label for='radio-" + student1 + "'></label></div></td>";
    student += "<td><div class='button-wrapper tooltip'><button class='button-11' id='button-" + student1 + "' onclick='handleButtonClick(this)' data-itemid='" + value.avataraddress + "' data-cp='" + value.cp + "'>-1%</button>" + (typeof value.messageButton !== "undefined" && value.messageButton !== null && value.messageButton !== "none" ? "<span class='tooltiptext' style='z-index: 9999;margin-bottom: -15px;'>" + decodeURIComponent(value.messageButton) + "</span>" : "") + "</div></td>";
    student += "<td><div class='radio-wrapper'><input id='attackRadio-" + student1 + "' type='radio' name='avatarSelectionAttack' data-cp='" + value.cp + "' data-score='" + value.score + "' value='" + value.avataraddress + "'" + (student1 === 1 ? " checked" : "") + "/><label for='attackRadio-" + student1 + "'></label></div></td>";
    student += "</tr>";

  });
  // Xóa dữ liệu trong bảng myTable, trừ hàng tiêu đề có lớp 'sticky notHide'
  $("#myTable tr:not(.sticky, .notHide)").remove();

  // INSERTING ROWS INTO TABLE
  $("#myTable").append(student);

  // Call API to get the number and replace the column with the image
  replaceColumnWithImage();
  replaceColumnWith_PhanTramWin();


  // Ẩn các hàng không được hiển thị ban đầu
  $("#myTable tr:not(.notHide)").slice(initialRows).hide();

  // Sự kiện click cho nút "Xem thêm"
  $(document).on("click", "#showMoreButton", function () {
    // Tăng số hàng hiển thị
    currentVisibleRows += rowsToAdd;

    // Hiển thị thêm số hàng
    $("#myTable tr:not(.notHide)").slice(initialRows - 1, currentVisibleRows).show();

    // Kiểm tra nếu đã hiển thị hết tất cả hàng
    if (currentVisibleRows >= $("#myTable tr:not(.notHide)").length) {
      $(this).hide();
    }
  });

  // INPUT NUMBER CHANGE EVENT
  $("#numberInput").on("input", function () {
    var number = parseInt($(this).val());

    // FILTERING ROWS
    $("#myTable tr").not(".notHide").hide(); // Loại bỏ hàng tiêu đề
    $("#myTable tr:not(.notHide)")
      .eq(number - 1)
      .show(); // Hiển thị hàng được chỉ định
    // RESET CSS CLASSES
    $("#myTable tr").removeClass("range1 range2 row_pick");
    // ADD CSS CLASS
    $("#myTable tr:not(.notHide)")
      .eq(number - 1)
      .addClass("row_pick");
  });

  // RANGE INPUT CHANGE EVENT
  $("#rangeInput").on("input", function () {
    var range = parseInt($(this).val());
    var number = parseInt($("#numberInput").val());

    // TÍNH TOÁN SỐ HÀNG HIỂN THỊ
    var startRow = Math.max(number - range, 1); // Số hàng bắt đầu
    var endRow = Math.min(number, totalRows); // Số hàng kết thúc (đối với range1)

    // RESET CSS CLASSES
    $("#myTable tr").removeClass("range1");

    // FILTERING ROWS
    $("#myTable tr").not(".notHide, .range2").hide(); // Loại bỏ hàng tiêu đề
    $("#myTable tr:not(.notHide)")
      .slice(startRow - 1, endRow)
      .show(); // Hiển thị hàng từ startRow đến endRow

    // ADD CSS CLASS
    $("#myTable tr:not(.notHide)")
      .slice(startRow - 1, number)
      .addClass("range1");
  });

  // RANGE INPUT 2 CHANGE EVENT
  $("#rangeInput2").on("input", function () {
    var range2 = parseInt($(this).val());
    var number = parseInt($("#numberInput").val());

    // TÍNH TOÁN SỐ HÀNG HIỂN THỊ
    var endRow2 = Math.min(number + range2, totalRows); // Số hàng kết thúc (đối với range2)

    // RESET CSS CLASSES
    $("#myTable tr").removeClass("range2");

    // FILTERING ROWS
    $("#myTable tr").not(".notHide, .range1").hide(); // Loại bỏ hàng tiêu đề
    $("#myTable tr:not(.notHide)")
      .slice(number - 1, endRow2)
      .show(); // Hiển thị hàng từ number đến endRow2

    // ADD CSS CLASS
    $("#myTable tr:not(.notHide)").slice(number, endRow2).addClass("range2");
  });

  $(document).ready(function () {
    $('input[name="avatarSelection"]').change(function () {
      var selectedAvatarIndex = parseInt($(this).attr("id").split("-")[1]);
      $("#infoTable tr.infoEnemy").removeClass("range1 blink");
      $("#numberInput").val(selectedAvatarIndex);
      $("#searchItem").val("");
      searchItemFun();
      // RESET CSS CLASSES
      $("#myTable tr").removeClass("range1 range2");
      // ADD CSS CLASS
      $("#myTable tr:not(.notHide)")
        .eq(selectedAvatarIndex - 1)
        .addClass("row_pick");

      // Copy selected columns to infoTable
      var selectedRow = $(this).closest("tr");
      var selectedColumns = selectedRow.find("th:lt(3), td:lt(5)").clone();
      // Modify the third column
      selectedColumns.eq(2).attr("colspan", "2");
      var newRow = $("<tr class='notHide infoYou'></tr>").append(selectedColumns);
      $("#infoTable tr.infoYou").replaceWith(newRow);
      var scoreA = $(this).data("score");
      var scoreB = $('input[name="avatarSelectionAttack"]:checked').data("score");
      // Kiểm tra điểm đối thủ có trong range score +200 đến -100 so với điểm của mình
      if ((scoreA - scoreB <= 100) && (scoreB - scoreA <= 200)) {
        $("#infoTable tr.infoEnemy").addClass("range1")
      } else {
        $("#infoTable tr.infoEnemy").addClass("blink")
      }

      var selectedRadioValue = $('input[name="avatarSelection"]:checked').val();
      suggestList_func(selectedRadioValue);
      // Không cần nữa
      // // Lấy agentAddress
      // $.getJSON(URL_9CSCAN + "/account?avatar=" + selectedRadioValue).done(function (apiData) {
      //   if (apiData[0].address) {
      //     $("#myAgentAddress").val(apiData[0].address);
      //     $("#myAgentAddress").prop("disabled", true);
      //   } else {
      //     $("#myAgentAddress").val("");
      //     $("#myAgentAddress").prop("disabled", false);
      //   }
      // }).fail(function () {
      //   $("#myAgentAddress").val("");
      //   $("#myAgentAddress").prop("disabled", false);
      // });

      var selectedRadioValue2 = $('input[name="avatarSelection"]:checked').data("cp");
      var sessionDataArena = getDataFromLocalStorage("sessionDataArena", selectedRadioValue + "/" + selectedRadioValue2);
      for (var i = 1; i <= 10; i++) {
        if (sessionDataArena && Object.keys(sessionDataArena).length !== 0) {
          var studentId = avatarIndex;
          for (var key in sessionDataArena) {

            var enemyCP = $("#button-" + i).data("cp");
            if (key.toLowerCase() === $("#button-" + i).data("itemid").toLowerCase()) {
              var [winRateOld, enemyCPOld] = sessionDataArena[key].split("/");
              if (parseInt(enemyCPOld) === parseInt(enemyCP)) {
                $("#button-" + i).text(winRateOld + "%");
              }
            }
          }
        } else $("#button-" + i).text("-1%");
      }

    });

    $('input[name="avatarSelectionAttack"]').change(function () {
      $("#searchItem").val("");
      searchItemFun();
      var selectedAvatarEmenyIndex = parseInt($('input[name="avatarSelectionAttack"]:checked').attr("id").split("-")[1]);

      var phanTramWin = $("#button-" + selectedAvatarEmenyIndex).text();
      $("#tryAttackArenaLite_button span").text(phanTramWin);
      var selectedRow = $(this).closest("tr");
      var selectedColumns = selectedRow.find("th:lt(3), td:lt(5)").clone();
      // Modify the third column
      selectedColumns.eq(2).attr("colspan", "2");
      var newRow = $("<tr class='notHide infoEnemy'></tr>").append(selectedColumns);
      $("#infoTable tr.infoEnemy").replaceWith(newRow);
      var scoreA = $('input[name="avatarSelection"]:checked').data("score");
      var scoreB = $(this).data("score");
      // Kiểm tra điểm đối thủ có trong range score +200 đến -100 so với điểm của mình
      if ((scoreA - scoreB <= 100) && (scoreB - scoreA <= 200)) {
        $("#infoTable tr.infoEnemy").addClass("range1")
      } else {
        $("#infoTable tr.infoEnemy").addClass("blink")
      }
    });

  });
}

function refreshInfoTableData() {
  $.getJSON(url_jsonblod_time_block).done(function (data) {
    var dataArray = []; // Khởi tạo một mảng mới

    // Chuyển đổi đối tượng JSON thành một mảng
    dataArray.push(data);
    var student = "";
    var student1 = 1;
    // ITERATING THROUGH OBJECTS
    $.each(dataArray, function (key, value) {
      student += "<tr style='white-space: nowrap;'>";
      student += "<td style='white-space: nowrap;'>" + value.block + "</td>";
      student += "<td>" + value.avgBlock + " <b>s</b></td>";
      student += "<td>" + value.roundID + "/" + value.totalRound + "</td>";
      student += "<td>" + value.blockEndRound + "</td>";
      student += "<td class='" + (value.timeBlock < BLOCK_WARNING ? "blink" : "") + "'>" + value.timeBlock + "</td>";
      student += "<td style='white-space: nowrap;'>" + value.h.toString().padStart(2, "0") + ":" + value.m.toString().padStart(2, "0") + ":" + value.s.toString().padStart(2, "0") + "</td>";
      student += "</tr>";
      student1 += 1;
    });
    // Xóa dữ liệu trong bảng infoTable, trừ hàng tiêu đề có lớp 'sticky notHide'
    $("#infoTable tr:not(.sticky, .notHide)").remove();
    // INSERTING ROWS INTO TABLE
    $("#infoTable").append(student);

    // Lập lịch chạy lại hàm sau 10 giây
    setTimeout(refreshInfoTableData, 10000);
  });
}

function addDataForSessionStorage(parentKey, childKey, data) {
  // Kiểm tra xem sessionStorage có tồn tại hay không
  if (typeof sessionStorage !== "undefined") {
    // Lấy dữ liệu từ sessionStorage (nếu có)
    var sessionStorageData = sessionStorage.getItem(parentKey);

    // Kiểm tra và chuyển đổi dữ liệu từ JSON thành đối tượng JavaScript
    var parsedData = sessionStorageData ? JSON.parse(sessionStorageData) : {};

    // Thêm dữ liệu mới vào đối tượng JavaScript
    parsedData[childKey] = data;

    // Chuyển đổi đối tượng JavaScript thành JSON
    var updatedData = JSON.stringify(parsedData);

    // Lưu dữ liệu vào sessionStorage
    sessionStorage.setItem(parentKey, updatedData);
  } else {
    console.log("Trình duyệt của bạn không hỗ trợ sessionStorage.");
  }
}

function getDataFromSessionStorage(parentKey, childKey) {
  // Kiểm tra xem sessionStorage có tồn tại hay không
  if (typeof sessionStorage !== "undefined") {
    // Lấy dữ liệu từ sessionStorage (nếu có)
    var sessionStorageData = sessionStorage.getItem(parentKey);

    // Kiểm tra và chuyển đổi dữ liệu từ JSON thành đối tượng JavaScript
    var parsedData = sessionStorageData ? JSON.parse(sessionStorageData) : {};

    // Trả về dữ liệu theo childKey (nếu tồn tại)
    if (parsedData.hasOwnProperty(childKey) && parsedData[childKey] !== "") {
      return parsedData[childKey];
    } else {
      return null; // Trả về null nếu childKey không tồn tại trong dữ liệu
    }
  } else {
    console.log("Trình duyệt của bạn không hỗ trợ sessionStorage.");
    return null; // Trình duyệt không hỗ trợ sessionStorage, trả về null
  }
}

function delDataFromSessionStorage(parentKey, childKey) {
  var parentData = sessionStorage.getItem(parentKey);
  if (parentData) {
    var parsedData = JSON.parse(parentData);

    if (parsedData.hasOwnProperty(childKey)) {
      delete parsedData[childKey];
      sessionStorage.setItem(parentKey, JSON.stringify(parsedData));
      console.log("Đã xóa dữ liệu con '" + childKey + "' trong dữ liệu cha '" + parentKey + "'.");
    } else {
      console.log("Dữ liệu con '" + childKey + "' không tồn tại trong dữ liệu cha '" + parentKey + "'.");
    }
  } else {
    console.log("Dữ liệu cha '" + parentKey + "' không tồn tại trong sessionStorage.");
  }
}

function addDataForLocalStorage(parentKey, childKey, data) {
  // Kiểm tra xem Local Storage có tồn tại hay không
  if (typeof Storage !== "undefined") {
    // Lấy dữ liệu từ Local Storage (nếu có)
    var localStorageData = localStorage.getItem(parentKey);

    // Kiểm tra và chuyển đổi dữ liệu từ JSON thành đối tượng JavaScript
    var parsedData = localStorageData ? JSON.parse(localStorageData) : {};

    // Thêm dữ liệu mới vào đối tượng JavaScript
    parsedData[childKey] = data;

    // Chuyển đổi đối tượng JavaScript thành JSON
    var updatedData = JSON.stringify(parsedData);

    // Lưu dữ liệu vào Local Storage
    localStorage.setItem(parentKey, updatedData);
  } else {
    console.log("Trình duyệt của bạn không hỗ trợ Local Storage.");
  }
}

function getDataFromLocalStorage(parentKey, childKey) {
  // Kiểm tra xem Local Storage có tồn tại hay không
  if (typeof Storage !== "undefined") {
    // Lấy dữ liệu từ Local Storage (nếu có)
    var localStorageData = localStorage.getItem(parentKey);

    // Kiểm tra và chuyển đổi dữ liệu từ JSON thành đối tượng JavaScript
    var parsedData = localStorageData ? JSON.parse(localStorageData) : {};

    // Trả về dữ liệu theo childKey (nếu tồn tại)
    if (parsedData.hasOwnProperty(childKey) && parsedData[childKey] !== "") {
      return parsedData[childKey];
    } else {
      return null; // Trả về null nếu childKey không tồn tại trong dữ liệu
    }
  } else {
    console.log("Trình duyệt của bạn không hỗ trợ Local Storage.");
    return null; // Trình duyệt không hỗ trợ Local Storage, trả về null
  }
}

function delDataFromLocalStorage(parentKey, childKey) {
  var parentData = localStorage.getItem(parentKey);
  if (parentData) {
    var parsedData = JSON.parse(parentData);

    if (parsedData.hasOwnProperty(childKey)) {
      delete parsedData[childKey];
      localStorage.setItem(parentKey, JSON.stringify(parsedData));
      console.log("Đã xóa dữ liệu con '" + childKey + "' trong dữ liệu cha '" + parentKey + "'.");
    } else {
      console.log("Dữ liệu con '" + childKey + "' không tồn tại trong dữ liệu cha '" + parentKey + "'.");
    }
  } else {
    console.log("Dữ liệu cha '" + parentKey + "' không tồn tại trong localStorage.");
  }
}

function sentMessage() {
  var selectedRadioValue = $('input[name="avatarSelection"]:checked').val();
  var messageImg = $("#messageImg").val();
  var messageButton = $("#messageButton").val();

  // Tạo URL và lấy dữ liệu JSON
  $.getJSON(url_jsonblod_message, function (data) {
    // Chuyển đổi selectedRadioValue thành chữ in thường
    selectedRadioValue = selectedRadioValue.toLowerCase();

    // Kiểm tra xem selectedRadioValue có trong data hay không
    if (selectedRadioValue in data) {
      var selectedData = data[selectedRadioValue];
    } else {
      data[selectedRadioValue] = {};
      var selectedData = data[selectedRadioValue];
    }

    // Tạo hoặc cập nhật key con messageImg
    selectedData.messageImg = encodeURIComponent(messageImg) || "none";

    // Tạo hoặc cập nhật key con messageButton
    selectedData.messageButton = encodeURIComponent(messageButton) || "none";

    // Lấy thời gian hiện tại theo đơn vị giây
    var currentTimeSeconds = Math.floor(Date.now() / 1000);

    // Gán giá trị thời gian vào key con time
    selectedData.time = currentTimeSeconds;
    // Put lại dữ liệu lên URL
    $.ajax({
      url: url,
      type: "PUT",
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function () {
        console.log("Dữ liệu đã được cập nhật thành công");
      },
      error: function () {
        console.log("Đã xảy ra lỗi khi cập nhật dữ liệu");
      }
    });
  })
}

function tinh_so_lan_attack(scoreA, scoreB) {
  var attackCount = 1;

  while (scoreA - scoreB < 100) {
    if (scoreA - scoreB < 0) {
      scoreA += 20;
      scoreB -= 1;
    } else if (scoreA - scoreB >= 0 && scoreA - scoreB <= 99) {
      scoreA += 18;
      scoreB -= 1;
    } else if (scoreA - scoreB == 100) {
      scoreA += 16;
      scoreB -= 1;
    }

    attackCount++;
  }
  return attackCount
}

function suggestList_func(myAvatarAddress) {
  var dataArena = getDataFromSessionStorage("temp", "dataArena");
  var myData = dataArena.find(item => item.avataraddress === myAvatarAddress);
  if (!myData) return;

  var selectedData = dataArena.filter(item =>
    item.avataraddress !== myAvatarAddress &&
    item.score <= (myData.score + 200) &&
    item.score >= (myData.score - 100)
  ).sort((a, b) => a.cp - b.cp);

  var suggestOptionsType3 = "";
  var suggestOptionsType2 = "";
  var suggestOptionsType1 = "";
  var j = 1;
  var type3Count = 0;
  var type2Count = 0;
  var type1Count = 0;

  selectedData.forEach(item => {
    var scoreDifference = item.score - myData.score;
    var type = "";
    var attackCount = 0;

    if (scoreDifference >= 1 && j <= 9 && type3Count < 3) {
      type = "★★★";
      attackCount = tinh_so_lan_attack(myData.score, item.score);
      suggestOptionsType3 += `<option value='${item.avatarname} #${item.avataraddress.substring(2, 6)}'>${j}) ${type}, rank: #${item.rankid}, cp: ${item.cp}, score: ${item.score}, canAttack: ${attackCount}</option>`;
      j++;
      type3Count++;
    } else if (scoreDifference <= 0 && scoreDifference >= -99 && j <= 9 && type2Count < 3) {
      type = "★★";
      attackCount = tinh_so_lan_attack(myData.score, item.score);
      suggestOptionsType2 += `<option value='${item.avatarname} #${item.avataraddress.substring(2, 6)}'>${j}) ${type}, rank: #${item.rankid}, cp: ${item.cp}, score: ${item.score}, canAttack: ${attackCount}</option>`;
      j++;
      type2Count++;
    } else if (scoreDifference === -100 && j <= 9 && type1Count < 3) {
      type = "★";
      attackCount = tinh_so_lan_attack(myData.score, item.score);
      suggestOptionsType1 += `<option value='${item.avatarname} #${item.avataraddress.substring(2, 6)}'>${j}) ${type}, rank: #${item.rankid}, cp: ${item.cp}, score: ${item.score}, canAttack: ${attackCount}</option>`;
      j++;
      type1Count++;
    }
  });

  var suggestOptions = suggestOptionsType3 + suggestOptionsType2 + suggestOptionsType1;
  $("#suggestList").html(suggestOptions);
}

function funcSelectByName(nameAndTag) {
  $("#searchItem").val(nameAndTag);
  searchItemFun();
}
