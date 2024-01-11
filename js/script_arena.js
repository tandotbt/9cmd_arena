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
  buttons.forEach(function(button) {
    button.disabled = true;
    button.classList.add("dark-mode");
  });

  // Vòng lặp qua từng input radio và tắt khả năng chọn bằng cách thêm thuộc tính "disabled"
  radioInputs.forEach(function(radioInput) {
    radioInput.disabled = true;
  });

  // Sau 6 giây, cho phép nhấp lại các button và input radio, và xóa thuộc tính "disabled"
  setTimeout(function() {
    buttons.forEach(function(button) {
      button.disabled = false;
      button.classList.remove("dark-mode");
    });

    radioInputs.forEach(function(radioInput) {
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

  // Tạo đối tượng dữ liệu để gửi lệnh PUT
  var putData = {
    avatarAddress: selectedRadioValue,
    enemyAddress: itemId,
  };

  // Lấy số thứ tự của sinh viên từ ID của button
  var studentId = button.id.split("-")[1];
  var sessionDataArena = getDataFromLocalStorage("sessionDataArena", selectedRadioValue + "/" + selectedRadioValue2);

  // Gửi lệnh POST tới URL xác định
  sendPostRequest(url_9capi_sim, putData, function(response, status) {
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
    success: function(response, status) {
      callback(response, status);
    },
    error: function(xhr, status, error) {
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

function replaceColumnWithImage() {
  // Tạo một IntersectionObserver
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
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
        $.getJSON(URL_9CSCAN + "/account?avatar=" + avataraddress).done(function(apiData) {
          var level; // New variable to store the level
          // Tìm kiếm trong mảng JSON để tìm giá trị phù hợp với avatarAddress
          var matchingAvatar = apiData.find(function(item) {
            return item.avatarAddress.toLowerCase() === avatarAddress;
          });

          if (matchingAvatar) {
            level = matchingAvatar.avatar.level; // Assign the level value
            var armorId = 10200000; // ID mặc định
            // Kiểm tra xem mảng equipments có tồn tại hay không
            if (!matchingAvatar.avatar.inventory || matchingAvatar.avatar.inventory.equipments.length === 0) {
              var armorEquipment = false;
            } else {
              // Tìm trong mảng equipments để tìm giá trị id của "itemSubType": "ARMOR"
              var armorEquipment = matchingAvatar.avatar.inventory.equipments.find(function(equipment) {
                return equipment.itemSubType === "ARMOR";
              });
            }

            if (armorEquipment) {
              armorId = armorEquipment.id;
            }
            if (imgDCC !== null) {
              var imageUrl = "https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/PFP/" + imgDCC + ".png";
              var frameUrl = "https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/character_frame_dcc.png"
            } else if (portraitId !== 0) {
              var imageUrl = "https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/" + portraitId + ".png";
              var frameUrl = "https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/character_frame.png"
            } else {
              var imageUrl = "https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/" + armorId + ".png";
              var frameUrl = "https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/character_frame.png"
            }
            if (myMessage !== "none") {
              var myMess = "<span class='tooltiptext' style='z-index: 9999;margin-bottom: 35px;'>" + decodeURIComponent(myMessage) + "</span>"
            } else {
              var myMess = ""
            }
            cell.innerHTML =
              "<label for='radio-" +
              avatarIndex +
              "'><div class='image-container tooltip'>" +
              "<div style='z-index: 1;position: absolute;padding-left: 26px;padding-bottom: 35px;font-size: 13px;font-family: monospace;color: lightyellow;white-space: nowrap;'>" +
              level +
              "</div>" +
              "<img class='lazyload image' src='../assets/loading_small.gif' data-src='" +
              imageUrl +
              "'>" +
              "<img style='padding-left: 26px;padding-bottom: 35px;'class='lazyload image' src='../assets/loading_small.gif' data-src='https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/Character_Level_Bg.png'>" +
              "<img class='lazyload image' src='../assets/loading_small.gif' data-src='" + frameUrl + "'>" + myMess + "</div>" +
              "<label>";
          }
        });

        // Dừng quan sát ô hiện tại sau khi đã áp dụng hàm replaceColumnWithImage()
        observer.unobserve(cell);
      }
    });
  });

  // Lấy tất cả các ô trong cột 2
  var cells = document.querySelectorAll("#myTable td:nth-child(2)");

  // Quan sát mỗi ô
  cells.forEach(function(cell) {
    observer.observe(cell);
  });
}
var timerRefreshTableData;

function refreshTableData_infoEmeny() {


  resetDataInfoYou = `
	<td>-</td>
	<td>-</td>
	<td colspan="10">-</td>
	`;
  var newRow = $("<tr class='notHide infoEnemy'></tr>").html(resetDataInfoYou);
  $("#infoTable tr.infoEnemy").replaceWith(newRow);
}

function refreshTableData() {
  // Thêm CSS dark-mode cho nút resetButton
  $("#resetButton").addClass("dark-mode");

  // Tắt khả dụng của nút resetButton trong 5 giây
  $("#resetButton").prop("disabled", true);
  setTimeout(function() {
    $("#resetButton").prop("disabled", false);
    $("#resetButton").removeClass("dark-mode");
  }, 5000);

  // Reset input number
  $("#numberInput").val("1");
  $("#rangeInput").val("0");
  $("#rangeInput2").val("0");

  var resetDataInfoYou = `
<td>-</td>
<td><img src='../assets/loading_small.gif'></td>
<td colspan="10">-</td>
`;
  var newRow = $("<tr class='notHide infoYou'></tr>").html(resetDataInfoYou);
  $("#infoTable tr.infoYou").replaceWith(newRow);
  refreshTableData_infoEmeny();
  var currentVisibleRows = initialRows;
  //Lấy dữ liệu DCC
  $.getJSON("https://api.dccnft.com/v1/9c/avatars/all")
    .done(function(apiDCCData) {
      addDataForLocalStorage("sessionDataArena", "dataAvatarDCC", apiDCCData.avatars)
      console.log("Sử dụng ảnh DCC");
    })
    .fail(function(jqXHR, textStatus, error) {
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
            const matchingData2 = apiData2.find(data2 => data2.avataraddress.toLowerCase() === data1.avataraddress.toLowerCase());
            return {
              ...data1,
              ...matchingData2
            };
          });
          // Chỉ lưu 3000 đối tượng đầu tiên
          const first3000Data = mergedData.slice(0, 3000);

          // Bản lưu dự phòng
          fetch(url_jsonblod_leadboard_2, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(first3000Data)

          });
          creatTableArena(mergedData);
        } else {
          console.log('API 2 không trả về một mảng hợp lệ');
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
          creatTableArena(apiData1);
        }
      });
  }

  function get_data_arena_from_9capi() {
    $.getJSON(url_9capi_leadboard)
      .done(function(apiData1Total) {
        // Chỉ xếp 3000 đối tượng đầu tiên
        const apiData1 = apiData1Total.slice(0, 3000);
        if (Array.isArray(apiData1) && apiData1.length === 0 && apiData1.length < 10) {
          // Dữ liệu trả về là một mảng rỗng
          console.log("Lỗi khi lấy dữ liệu từ 9capi:", apiData1Total);
          creatTableArena(dataArenaError);
        } else {
          // Xử lý dữ liệu từ API ban đầu
          console.log("Sử dụng từ 9capi");
          hop_nhat_data_phu(apiData1);
        }
      })
      .fail(function(jqXHR, textStatus, error) {
        // Xử lý khi yêu cầu thất bại
        console.log("Lỗi khi lấy dữ liệu từ 9capi:", error);
        creatTableArena(dataArenaError);
      });
  }
  var post_data_json = {
    query: 'query{stateQuery{arenaParticipants(avatarAddress:"0x0000000000000000000000000000000000000000",filterBounds: false){avatarAddr,score,rank,winScore,loseScore,cp,portraitId,level,nameWithHash}}}',
  };

  $.ajax({
    url: URL_NODE_USE,
    type: "POST",
    data: JSON.stringify(post_data_json),
    contentType: "application/json",
    success: function(response, status) {

      if (response && response.data && response.data.stateQuery) {} else if (response && response.errors && response.errors[0].message) {
        console.log("Lỗi khi lấy dữ liệu từ api của game:", response.errors[0].message);
        get_data_arena_from_9capi();
      } else {
        console.log("Lỗi khi lấy dữ liệu từ api của game: Không xác định");
        get_data_arena_from_9capi();
      }

      var processedData = response.data.stateQuery.arenaParticipants
        .slice(0, 3000) // Giới hạn số lượng phần tử đầu tiên
        .map(function(participant) {
          var nameWithHash = participant.nameWithHash;
          var startIndex = nameWithHash.indexOf('<size=80%>'); // Tìm vị trí bắt đầu của từ '<size=80%>'
          var avatarName = nameWithHash.substring(0, startIndex).trim(); // Chỉ giữ lại phần trước của tên và loại bỏ khoảng trắng thừa
          return {
            rankid: participant.rank,
            score: participant.score,
            avatarname: avatarName,
            avataraddress: participant.avatarAddr,
            cp: participant.cp,
            portraitId: participant.portraitId
          };
        });
      console.log("Sử dụng từ api game");
      hop_nhat_data_phu(processedData);
    },
    error: function(xhr, status, error) {
      console.log("Lỗi khi lấy dữ liệu từ api của game:", error);
      get_data_arena_from_9capi();
    },
  });

  timeAutoResetTable = $("#timeAutoResetTable").val();
  $("#resetButton span").text(timeAutoResetTable);
  timerRefreshTableData = setTimeout(refreshTableData, timeAutoResetTable * 1000);
}

function refreshTableDataAgain() {
  // Hủy định thời gian chờ hiện tại (nếu có)
  clearTimeout(timerRefreshTableData);

  // Gọi lại hàm fetchDataAvatar()
  refreshTableData();
}
var initialRows = 10; // Số hàng hiển thị ban đầu
var rowsToAdd = 50; // Số hàng thêm khi nhấp vào nút "Xem thêm"
var currentVisibleRows = initialRows; // Số hàng hiện tại đang được hiển thị
function creatTableArena(dataTotal) {
  // Chỉ xếp 3000 đối tượng đầu tiên
  var data = dataTotal.slice(0, 3000);
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
  $.each(data, function(index, value) {
    // if (index > 0 && value.score !== prevScore) {
    // newRankid = index + 1;
    // }

    // value.newRankid = newRankid;

    // prevScore = value.score;
    student1 = index + 1;
    student += "<tr>";
    student += "<td>" + "<label for='attackRadio-" + student1 + "'>" + student1 + "<br><span class='mute-text' style='white-space: nowrap;'>#" + value.rankid + "</span><br><img style='width: 1.6vw;' src='../assets/Arena_bg_21.png'/></label></td>";
    student += "<td style='width: 80px;height: 80px;' id='imgCell-" + value.avataraddress + "' data-index='" + student1 + "' data-portraitId='" + (typeof value.portraitId !== "undefined" && value.portraitId !== null ? value.portraitId : 0) + "' data-message='" + (typeof value.messageImg !== "undefined" && value.messageImg !== null ? value.messageImg : "none") + "'><img src='../assets/loading_small.gif'></td>";
    var avatarCode = value.avataraddress.substring(2, 6);
    student += "<td>" + "<label style='font-weight: bold;' for='radio-" + student1 + "'>" + value.avatarname + " <span class='mute-text'>#" + avatarCode + "</span></label></td>";
    // student += "<td>" + "<label for='radio-" + student1 + "'>" + value.rankid + "</label></td>";
    student += "<td>" + "<label style='white-space: nowrap;' for='radio-" + student1 + "'>" + value.cp + "</label></td>";
    student += "<td>" + "<label style='white-space: nowrap;' for='radio-" + student1 + "'>" + value.score + "</label></td>";
    student += "<td>" + "<label style='display: flex;justify-content: center;align-items: center;flex-wrap: wrap;' for='radio-" + student1 + "'>" + (typeof value.stake !== "undefined" && value.stake !== null ? value.stake + "<img style='width: 1.6vw;' src='../assets/icon_Goods_0.png'/>" : "-") + "</label></td>";
    student += "<td>" + "<label style='white-space: nowrap;' for='radio-" + student1 + "'>" + (typeof value.win !== "undefined" && value.win !== null ? value.win : "-") + "/" + (typeof value.lose !== "undefined" && value.lose !== null ? value.lose : "-") + "</label></td>";
    student += "<td>" + "<label style='display: flex;justify-content: center;align-items: center;flex-wrap: wrap;' for='radio-" + student1 + "'>" + (typeof value.currenttickets !== "undefined" && value.currenttickets !== null ? value.currenttickets + "<img style='width: 1.6vw;' src='../assets/icon_Goods_3.png'/>" : "-") + " • " + (typeof value.purchasedTicketCount !== "undefined" && value.purchasedTicketCount !== null && typeof value.purchasedTicketCountOld !== "undefined" && value.purchasedTicketCountOld !== null ? (value.purchasedTicketCount - value.purchasedTicketCountOld) + "<img style='width: 1.6vw;' src='../assets/icon_Goods_3_mod.png'/>" : "-") + " <br><span class='mute-text' style='white-space: nowrap;'>" + (typeof value.purchasedTicketCount !== "undefined" && value.purchasedTicketCount !== null ? value.purchasedTicketCount : "-") + " • " + (typeof value.purchasedTicketNCG !== "undefined" && value.purchasedTicketNCG !== null ? value.purchasedTicketNCG.toFixed(1) : "-") + " ncg</span></label></td>";
    student += "<td><div class='radio-wrapper'><input id='radio-" + student1 + "' type='radio' name='avatarSelection' data-cp='" + value.cp + "' value='" + value.avataraddress + "'" + (student1 === 1 ? " checked" : "") + "/><label for='radio-" + student1 + "'></label></div></td>";
    student += "<td><div class='button-wrapper tooltip'><button class='button-11' id='button-" + student1 + "' onclick='handleButtonClick(this)' data-itemid='" + value.avataraddress + "' data-cp='" + value.cp + "'>-1%</button>" + (typeof value.messageButton !== "undefined" && value.messageButton !== null && value.messageButton !== "none" ? "<span class='tooltiptext' style='z-index: 9999;margin-bottom: -15px;'>" + decodeURIComponent(value.messageButton) + "</span>" : "") + "</div></td>";
    student += "<td><div class='radio-wrapper'><input id='attackRadio-" + student1 + "' type='radio' name='avatarSelectionAttack' data-cp='" + value.cp + "' value='" + value.avataraddress + "'" + (student1 === 1 ? " checked" : "") + "/><label for='attackRadio-" + student1 + "'></label></div></td>";
    student += "</tr>";

  });
  // Xóa dữ liệu trong bảng myTable, trừ hàng tiêu đề có lớp 'sticky notHide'
  $("#myTable tr:not(.sticky, .notHide)").remove();

  // INSERTING ROWS INTO TABLE
  $("#myTable").append(student);

  // Call API to get the number and replace the column with the image
  replaceColumnWithImage();



  // Ẩn các hàng không được hiển thị ban đầu
  $("#myTable tr:not(.notHide)").slice(initialRows).hide();

  // Sự kiện click cho nút "Xem thêm"
  $(document).on("click", "#showMoreButton", function() {
    // Tăng số hàng hiển thị
    currentVisibleRows += rowsToAdd;

    // Hiển thị thêm số hàng
    $("#myTable tr:not(.notHide)").slice(initialRows, currentVisibleRows).show();

    // Kiểm tra nếu đã hiển thị hết tất cả hàng
    if (currentVisibleRows >= $("#myTable tr:not(.notHide)").length) {
      $(this).hide();
    }
  });

  // INPUT NUMBER CHANGE EVENT
  $("#numberInput").on("input", function() {
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
  $("#rangeInput").on("input", function() {
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
  $("#rangeInput2").on("input", function() {
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

  $(document).ready(function() {
    $('input[name="avatarSelection"]').change(function() {
      var selectedAvatarIndex = parseInt($(this).attr("id").split("-")[1]);
      $("#infoTable tr.infoEnemy").removeClass("range1 range2");
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
      var enemyAvatarIndex = parseInt($('input[name="avatarSelectionAttack"]:checked').attr("id").split("-")[1]);
      if (enemyAvatarIndex >= selectedAvatarIndex) {
        $("#infoTable tr.infoEnemy").addClass("range2")
      } else {
        $("#infoTable tr.infoEnemy").addClass("range1")
      }

      // Sử dụng % win đã lưu nếu có
      var selectedRadioValue = $('input[name="avatarSelection"]:checked').val();
      suggestList_func(selectedRadioValue);
      var selectedRadioValue2 = $('input[name="avatarSelection"]:checked').data("cp");
      var sessionDataArena = getDataFromLocalStorage("sessionDataArena", selectedRadioValue + "/" + selectedRadioValue2);

      if (sessionDataArena !== null && Object.keys(sessionDataArena).length !== 0) {
        $(".button-11").each(async function() {
          var itemId = $(this).data("itemid");
          var studentId = $(this).attr("id").split("-")[1];
          var enemyCP = $(this).data("cp");
          // Duyệt qua từng khóa trong sessionDataArena
          for (var key in sessionDataArena) {
            if (key.toLowerCase() === itemId.toLowerCase()) {
              var winRateOld = sessionDataArena[key].split("/")[0];
              var enemyCPOld = sessionDataArena[key].split("/")[1];
              if (parseInt(enemyCPOld) === parseInt(enemyCP)) {
                try {
                  // Sử dụng Promise để bao bọc hành động bất đồng bộ
                  await new Promise((resolve) => {
                    setTimeout(resolve, 0); // Giữ nguyên luồng chính để tránh gây tắc nghẽn
                  });

                  // Nếu itemId trùng khóa trong sessionDataArena, thực hiện hành động tương ứng
                  $("#button-" + studentId).text(winRateOld + "%");
                  break; // Kết thúc vòng lặp sau khi tìm thấy khóa trùng
                } catch (error) {
                  // Xử lý lỗi nếu có
                  console.error(error);
                }
              }
            }
          }
        });
      }
      // Lấy agentAddress
      $.getJSON(URL_9CSCAN + "/account?avatar=" + selectedRadioValue).done(function(apiData) {
        if (apiData[0].address) {
          $("#myAgentAddress").val(apiData[0].address);
          $("#myAgentAddress").prop("disabled", true);
        } else {
          $("#myAgentAddress").val("");
          $("#myAgentAddress").prop("disabled", false);
        }
      }).fail(function() {
        $("#myAgentAddress").val("");
        $("#myAgentAddress").prop("disabled", false);
      });
    });

    $('input[name="avatarSelectionAttack"]').change(function() {
      var selectedAvatarIndex = parseInt($('input[name="avatarSelection"]:checked').attr("id").split("-")[1]);
      var myAvatarIndex = parseInt($(this).attr("id").split("-")[1]);
      var selectedRow = $(this).closest("tr");
      var selectedColumns = selectedRow.find("th:lt(3), td:lt(5)").clone();
      // Modify the third column
      selectedColumns.eq(2).attr("colspan", "2");
      var newRow = $("<tr class='notHide infoEnemy'></tr>").append(selectedColumns);
      $("#infoTable tr.infoEnemy").replaceWith(newRow);
      if (myAvatarIndex >= selectedAvatarIndex) {
        $("#infoTable tr.infoEnemy").addClass("range2")
      } else {
        $("#infoTable tr.infoEnemy").addClass("range1")
      }
    });

  });
}


function refreshInfoTableData() {
  $.getJSON(url_jsonblod_time_block).done(function(data) {
    var dataArray = []; // Khởi tạo một mảng mới

    // Chuyển đổi đối tượng JSON thành một mảng
    dataArray.push(data);
    var student = "";
    var student1 = 1;
    // ITERATING THROUGH OBJECTS
    $.each(dataArray, function(key, value) {
      student += "<tr style='white-space: nowrap;'>";
      student += "<td style='white-space: nowrap;'>" + value.block + "</td>";
      student += "<td>" + value.avgBlock + " <b>s</b></td>";
      student += "<td>" + value.roundID + "/" + value.totalRound + "</td>";
      student += "<td>" + value.blockEndRound + "</td>";
      student += "<td>" + value.timeBlock + "</td>";
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
  $.getJSON(url_jsonblod_message, function(data) {
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
      success: function() {
        console.log("Dữ liệu đã được cập nhật thành công");
      },
      error: function() {
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
  // Dữ liệu ban đầu
  var dataArena = getDataFromSessionStorage("temp", "dataArena");
  var myScore;
  var myCp;

  // Tìm score và cp của my avatar
  for (var i = 0; i < dataArena.length; i++) {
    if (dataArena[i].avataraddress === myAvatarAddress) {
      myScore = dataArena[i].score;
      myCp = dataArena[i].cp;
      break;
    }
  }

  // Chọn ra khoảng dữ liệu từ khoảng score + 200 đến score - 100
  var selectedData = dataArena.filter(function(item) {
    return item.score <= (myScore + 200) && item.score >= (myScore - 100) && item.avataraddress !== myAvatarAddress;
  });
  // Sắp xếp dữ liệu theo cp tăng dần
  selectedData.sort(function(a, b) {
    return a.cp - b.cp;
  });

  var suggestOptions = "";

  var j = 1;
  for (var i = 0; i < selectedData.length; i++) {
    if (j == 4) {
      break;
    }
    var scoreDifference = selectedData[i].score - myScore;
    if (scoreDifference >= 1) {
      // Từ khoảng +200 đến +1 score, chọn ra 3 nhân vật có cp thấp nhất là +20
      var type = "★★★"
      var attackCount = tinh_so_lan_attack(myScore, selectedData[i].score);
      suggestOptions += "<option value='" + selectedData[i].avatarname + " #" + selectedData[i].avataraddress.substring(2, 6) + "'>" + j + ") " + type + ", rank: #" + selectedData[i].rankid + ", cp: " + selectedData[i].cp + ", score: " + selectedData[i].score + ", canAttack: " + attackCount + "</option>";
      j++;
    }
  }
  j = 1;
  for (i = 0; i < selectedData.length; i++) {
    if (j == 4) {
      break;
    }
    var scoreDifference = selectedData[i].score - myScore;
    if ((scoreDifference <= 0) && ((scoreDifference >= -99))) {
      // Từ khoảng +0 đến -99 score, chọn ra 3 nhân vật có cp thấp nhất là +18
      var type = "★★"
      var attackCount = tinh_so_lan_attack(myScore, selectedData[i].score);
      suggestOptions += "<option value='" + selectedData[i].avatarname + " #" + selectedData[i].avataraddress.substring(2, 6) + "'>" + j + ") " + type + ", rank: #" + selectedData[i].rankid + ", cp: " + selectedData[i].cp + ", score: " + selectedData[i].score + ", canAttack: " + attackCount + "</option>";
      j++;
    }
  }
  j = 1;
  for (i = 0; i < selectedData.length; i++) {
    if (j == 4) {
      break;
    }
    var scoreDifference = selectedData[i].score - myScore;
    if (scoreDifference == -100) {
      // Từ khoảng +-100 score, chọn ra 3 nhân vật có cp thấp nhất là +16
      var type = "★"
      var attackCount = tinh_so_lan_attack(myScore, selectedData[i].score);
      suggestOptions += "<option value='" + selectedData[i].avatarname + " #" + selectedData[i].avataraddress.substring(2, 6) + "'>" + j + ") " + type + ", rank: #" + selectedData[i].rankid + ", cp: " + selectedData[i].cp + ", score: " + selectedData[i].score + ", canAttack: " + attackCount + "</option>";
      j++;
    }
  }

  // Chèn các phần tử vào danh sách
  $("#suggestList").html(suggestOptions);
}
