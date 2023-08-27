function scrollToTop() {
    $("html, body").animate(
        {
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

    // Loop through all table rows, and hide those who don't match the search query
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

    // Lấy giá trị của radio được chọn
    var selectedRadioValue = $('input[name="avatarSelection"]:checked').val();

    // Tạo đối tượng dữ liệu để gửi lệnh PUT
    var putData = {
        avatarAddress: selectedRadioValue,
        enemyAddress: itemId,
    };

    // Lấy số thứ tự của sinh viên từ ID của button
    var studentId = button.id.split("-")[1];

    // Gửi lệnh POST tới URL xác định
    // sendPostRequest("https://cors-proxy.fringe.zone/https://api.9capi.com/arenaSim/", putData, function (response, status) {
    sendPostRequest("https://api.9capi.com/arenaSim/", putData, function (response, status) {
        var resultButton = $("#button-" + studentId);
        if (status === "success") {
            resultButton.text(response.winPercentage + "%");
        } else {
            resultButton.text("Error");
        }
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
                $.getJSON("https://api.9cscan.com/account?avatar=" + avataraddress).done(function (apiData) {
                    var avatarAddress = avataraddress.toLowerCase();
                    var level; // New variable to store the level
                    // Tìm kiếm trong mảng JSON để tìm giá trị phù hợp với avatarAddress
                    var matchingAvatar = apiData.find(function (item) {
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
                            var armorEquipment = matchingAvatar.avatar.inventory.equipments.find(function (equipment) {
                                return equipment.itemSubType === "ARMOR";
                            });
                        }

                        if (armorEquipment) {
                            armorId = armorEquipment.id;
                        }

                        var imageUrl = "https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/" + armorId + ".png";
                        cell.innerHTML =
                            "<label for='radio-" +
                            avatarIndex +
                            "'><div class='image-container'>" +
                            "<div style='z-index: 1;position: absolute;padding-left: 25px;padding-bottom: 30px;font-size: 13px;font-family: monospace;color: lightyellow;'>" +
                            level +
                            "</div>" +
                            "<img class='lazyload image' src='assets/loading_small.gif' data-src='" +
                            imageUrl +
                            "'>" +
                            "<img style='padding-left: 26px;padding-bottom: 30px;'class='lazyload image' src='assets/loading_small.gif' data-src='https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/Character_Level_Bg.png'>" +
                            "<img class='lazyload image' src='assets/loading_small.gif' data-src='https://raw.githubusercontent.com/planetarium/NineChronicles/development/nekoyume/Assets/Resources/UI/Icons/Item/character_frame.png'></div>" +
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
    cells.forEach(function (cell) {
        observer.observe(cell);
    });
}

function refreshTableData() {
    // $.getJSON("https://cors-get-proxy.sirjosh.workers.dev/?url=https://api.9capi.com/arenaLeaderboard").done(function (data) {
    $.getJSON("https://api.9capi.com/arenaLeaderboard/").done(function (data) {
        // $.getJSON("http://jsonblob.com/api/1142073037486415872").done(function (data) {
        var student = "";
        var student1 = 1;
        var totalRows = data.length;
        // ITERATING THROUGH OBJECTS
        $.each(data, function (key, value) {
            student += "<tr>";
            student += "<td>" + "<label for='radio-" + student1 + "'>" + student1 + "</label></td>";
            student += "<td style='width: 80px;height: 80px;' id='imgCell-" + value.avataraddress + "' data-index='" + student1 + "'><img src='assets/loading_small.gif'></td>";
            student += "<td>" + "<label for='radio-" + student1 + "'>" + value.avatarname + "</label></td>";
            student += "<td>" + "<label for='radio-" + student1 + "'>" + value.rankid + "</label></td>";
            student += "<td>" + "<label for='radio-" + student1 + "'>" + value.cp + "</label></td>";
            student += "<td>" + "<label for='radio-" + student1 + "'>" + value.score + "</label></td>";
            student += "<td>" + "<label for='radio-" + student1 + "'>" + value.currenttickets + "</label></td>";
            student +=
                "<td><div class='radio-wrapper'><input id='radio-" +
                student1 +
                "' type='radio' name='avatarSelection' data-avataraddress='" +
                value.avataraddress +
                "' value='" +
                value.avataraddress +
                "'" +
                (student1 === 1 ? " checked" : "") +
                "/><label for='radio-" +
                student1 +
                "'></label></div></td>";
            student += "<td><div class='button-wrapper'><button class='button-11' id='button-" + student1 + "' onclick='handleButtonClick(this)' data-itemid='" + value.avataraddress + "'>0%</button></div></td>";
            student += "</tr>";
            student1 += 1;
        });
        // Xóa dữ liệu trong bảng myTable, trừ hàng tiêu đề có lớp 'sticky notHide'
        $("#myTable tr:not(.sticky, .notHide)").remove();

        // INSERTING ROWS INTO TABLE
        $("#myTable").append(student);

        // Call API to get the number and replace the column with the image
        replaceColumnWithImage();

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

        // Gán sự kiện click cho nút resetButton
        $("#resetButton").click(function () {
            // Tải lại dữ liệu từ getJSON
            refreshTableData();

            // Thêm CSS dark-mode cho nút resetButton
            $(this).addClass("dark-mode");

            // Tắt khả dụng của nút resetButton trong 5 giây
            $(this).prop("disabled", true);
            setTimeout(function () {
                $("#resetButton").prop("disabled", false);
                $("#resetButton").removeClass("dark-mode");
            }, 5000);

            // Reset input number
            $("#numberInput").val("1");
            $("#rangeInput").val("0");
            $("#rangeInput2").val("0");

            var resetDataInfoYou = `
      <td>-</td>
      <td><img src='assets/loading_small.gif'></td>
      <td colspan="10">-</td>
    `;
            var newRow = $("<tr class='notHide infoYou'></tr>").html(resetDataInfoYou);
            $("#infoTable tr.infoYou").replaceWith(newRow);
        });

        $(document).ready(function () {
            $('input[name="avatarSelection"]').change(function () {
                var selectedAvatarIndex = parseInt($(this).attr("id").split("-")[1]);

                $("#numberInput").val(selectedAvatarIndex);
                // RESET CSS CLASSES
                $("#myTable tr").removeClass("range1 range2");
                // ADD CSS CLASS
                $("#myTable tr:not(.notHide)")
                    .eq(selectedAvatarIndex - 1)
                    .addClass("row_pick");

                // Copy selected columns to infoTable
                var selectedRow = $(this).closest("tr");
                var selectedColumns = selectedRow.find("th:lt(3), td:lt(3)").clone();
                // Modify the third column
                selectedColumns.eq(2).attr("colspan", "10");
                var newRow = $("<tr class='notHide infoYou'></tr>").append(selectedColumns);
                $("#infoTable tr.infoYou").replaceWith(newRow);
            });
        });
    });
}

function refreshInfoTableData() {
    $.getJSON("https://jsonblob.com/api/1141252404015915008").done(function (data) {
        var dataArray = []; // Khởi tạo một mảng mới

        // Chuyển đổi đối tượng JSON thành một mảng
        dataArray.push(data);
        var student = "";
        var student1 = 1;
        // ITERATING THROUGH OBJECTS
        $.each(dataArray, function (key, value) {
            student += "<tr>";
            student += "<td>" + value.block + "</td>";
            student += "<td>" + value.avgBlock + " <b>s</b></td>";
            student += "<td>" + value.roundID + "/20</td>";
            student += "<td>" + value.blockEndRound + "</td>";
            student += "<td>" + value.timeBlock + "</td>";
            student += "<td>" + value.h + ":" + value.m + ":" + value.s + "</td>";
            student += "</tr>";
            student1 += 1;
        });
        // Xóa dữ liệu trong bảng infoTable, trừ hàng tiêu đề có lớp 'sticky notHide'
        $("#infoTable tr:not(.sticky, .notHide, infoYou)").remove();

        // INSERTING ROWS INTO TABLE
        $("#infoTable").append(student);

        // Lập lịch chạy lại hàm sau 5 giây
        setTimeout(refreshInfoTableData, 5000);
    });
}
