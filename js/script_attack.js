async function handleResponseBuoc09cscan(agentAddress, typeUseNode) {
  let _temp = `=== Step 0: Check ${typeUseNode}`;
  console.log(_temp);

  let response = await fetch(`${URL_9CSCAN}/accounts/${agentAddress}/transactions?action=${typeUseNode}&limit=6`);
  let idList = [];

  if (response.status === 200) {
    let data = await response.json();
    for (let transaction of data.transactions) {
      idList.push(transaction.id);
    }
  }

  for (let transactionId of idList) {
    try {
      response = await fetch(`${URL_9CSCAN}/transactions/${transactionId}/status`, {
        timeout: 5000
      });
      if (response.status === 200) {
        let data = await response.json();
        console.log(data);
        if (data.status && data.status === "SUCCESS") {
          break;
        }
      } else {
        console.log(`Error: ${response.status}`);
      }
    } catch (error) {
      console.log("Error: Request timed out");
    }
  }
}

async function tryAttackArenaLite() {
  try {
    $("#tryAttackArenaLite_button").prop("disabled", true);
    $("#runGifBarUseNode").attr("src", "../assets/run.gif");
    $("#TXOutput").val("Step 0...")
    $("#taskOutput").text(0)
    var agentAddress = document.getElementById('myAgentAddress').value.trim();
    var password = document.getElementById('myPassword').value;
    var myServer9cmd = document.getElementById('myServer9cmd').value.trim();
    var usernameAPI = $("#usernameAPI").val().trim();
    var passwordAPI = $("#passwordAPI").val().trim();
    var avatarAddress = document.querySelector('input[name="avatarSelection"]:checked').value;
    var avatarAddressEnemy = document.querySelector('input[name="avatarSelectionAttack"]:checked').value;

    if (agentAddress === "" || password === "" || myServer9cmd === "" || usernameAPI === "" || passwordAPI === "") {
      throw ("Missing data");
    }
    await handleResponseBuoc09cscan(agentAddress, CHECK_SUCCESS_ARENA_ATTACK);
    let url = `${URL_API_9CMD}/attackArena`;
    let bodyRaw = {
      agentAddress: agentAddress,
      avatarAddress: avatarAddress,
      avatarAddressEnemy: avatarAddressEnemy,
      serverPlanet: SERVER_PLANET_USE,
      locale: "en",
      isLimit: true
    };
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyRaw)
    });

    let data = await response.json();

    if (typeof data.error === "undefined") {
      throw (`${data.toString()}`);
    }
    if (data.error !== 0) {
      throw (`${data.message.toString()}`);
    }

    let plainValue = data.message;
    console.log(`Done step 0: ${plainValue}`);
    await tryUseNode(agentAddress, password, plainValue, myServer9cmd, usernameAPI, passwordAPI);
    $("#tryAttackArenaLite_button").prop("disabled", false);
    $("#runGifBarUseNode").attr("src", "../assets/run.png");
  } catch (error) {
    console.log(error);
    $("#TXOutput").val(error);
    $("#tryAttackArenaLite_button").prop("disabled", false);
    $("#runGifBarUseNode").attr("src", "../assets/run.png");
  }
}

function wait() {
  var TIMEOUT = parseInt($('#setTimeout').val()) * 1000 || 12000;
  console.log(`Chờ ${TIMEOUT} ms`)
  return new Promise((resolve) => setTimeout(resolve, TIMEOUT));
}

async function send_request_QUERY(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: body
    }),
  });
  return await response.json();
}

async function get_publicKey(myServer9cmd, agentAddress, password, usernameAPI, passwordAPI) {
  let url = `https://${myServer9cmd}/publicKey`;

  let body = {
    agentAddress: agentAddress,
    password: encodeURIComponent(password),
    locale: "en"
  };

  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Basic " + btoa(usernameAPI + ":" + passwordAPI)
  };

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  };

  const response = await fetch(url, requestOptions);

  return await response.json();
}

async function get_signature(myServer9cmd, agentAddress, password, unsignedTransaction, usernameAPI, passwordAPI) {
  let url = `https://${myServer9cmd}/signature`;

  let body = {
    agentAddress: agentAddress,
    password: encodeURIComponent(password),
    unsignedTransaction: unsignedTransaction,
    locale: "en"
  };
  const headers = {
    "Content-Type": "application/json",
    "Authorization": "Basic " + btoa(usernameAPI + ":" + passwordAPI)
  };

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });
  return await response.json();
}

async function tryUseNode(agentAddress, password, plainValue, myServer9cmd, usernameAPI, passwordAPI) {
  try {
    function handle_response_QUERY_transaction(data, error_message) {
      if (data === null) {
        console.log(`Không nhận được giá trị ${error_message}`);
        throw (`Lỗi 2 khi nhận ${error_message}`);
      }

      const errors = data.errors;
      if (errors) {
        const error_message = errors[0].message;
        console.log("Xảy ra lỗi:", error_message);
        throw (`Lỗi 1 khi nhận ${error_message}`);
      }

      return data.data.transaction[error_message];
    }

    function handle_response_QUERY_stageTransaction(data, error_message) {
      if (data === null) {
        console.log(`Không nhận được giá trị ${error_message}`);
        throw (`Lỗi 2 khi nhận ${error_message}`);
      }

      const errors = data.errors;
      if (errors) {
        const error_message = errors[0].message;
        console.log("Xảy ra lỗi:", error_message);
        throw (`Lỗi 1 khi nhận ${error_message}`);
      }

      return data.data.stageTransaction;
    }
    $("#TXOutput").val("Step 1...")
    $("#taskOutput").text(1)
    let _temp = "=== Step 1: Get nextTxNonce";
    console.log(_temp);
    body = `
      query {
        transaction {
          nextTxNonce(address: "${agentAddress}")
        }
      }
    `;
    await wait();
    let response = await send_request_QUERY(URL_NODE_USE, body);
    let nextTxNonce = handle_response_QUERY_transaction(response, "nextTxNonce");
    console.log(`Done nextTxNonce: ${nextTxNonce}`);

    $("#TXOutput").val("Step 2...")
    $("#taskOutput").text(2)
    _temp = "=== Step 2: Get publicKey";
    console.log(_temp);
    let publicKeyData = await get_publicKey(myServer9cmd, agentAddress, password, usernameAPI, passwordAPI);
    let publicKey = typeof publicKeyData.message !== "undefined" && publicKeyData.message !== null ? publicKeyData.message : publicKeyData;
    if (publicKeyData.error !== 0) {
      throw publicKey;
    }
    console.log(`Done publicKey: ${publicKey}`);

    $("#TXOutput").val("Step 3...")
    $("#taskOutput").text(3)
    _temp = "=== Step 3: Get unsignedTransaction";
    console.log(_temp);
    body = `
      query {
        transaction {
          unsignedTransaction(
            publicKey: "${publicKey}",
            plainValue: "${plainValue}",
            nonce: ${parseInt(nextTxNonce)}
          )
        }
      }
    `;
    await wait();
    response = await send_request_QUERY(URL_NODE_USE, body);
    let unsignedTransaction = handle_response_QUERY_transaction(response, "unsignedTransaction");
    console.log(`Done unsignedTransaction: ${unsignedTransaction}`);
    $("#TXOutput").val("Step 4...")
    $("#taskOutput").text(4)
    _temp = "=== Step 4: Get signature";
    console.log(_temp);
    let signatureData = await get_signature(myServer9cmd, agentAddress, password, unsignedTransaction, usernameAPI, passwordAPI);
    let signature = typeof signatureData.message !== "undefined" && signatureData.message !== null ? signatureData.message : signatureData;
    if (signatureData.error !== 0) {
      throw signature;
    }
    console.log(`Done signature: ${signature}`);
    $("#TXOutput").val("Step 5...")
    $("#taskOutput").text(5)
    _temp = "=== Step 5: Get signTransaction";
    console.log(_temp);
    body = `
      query {
        transaction {
          signTransaction(
            unsignedTransaction: "${unsignedTransaction}",
            signature: "${signature}"
          )
        }
      }
    `;
    await wait();
    response = await send_request_QUERY(URL_NODE_USE, body);
    let signTransaction = handle_response_QUERY_transaction(response, "signTransaction");
    console.log(`Done signTransaction: ${signTransaction}`);

    $("#TXOutput").val("Step 6...")
    $("#taskOutput").text(6)
    _temp = "=== Step 6: Get payload";
    console.log(_temp);
    body = `
      mutation {
        stageTransaction(
          payload: "${signTransaction}"
        )
      }
    `;
    await wait();
    response = await send_request_QUERY(URL_NODE_USE, body);
    let payload = handle_response_QUERY_stageTransaction(response, "payload");
    console.log(`Done payload: ${URL_9CSCAN_WEB}/tx/${payload}`);
    $("#TXOutput").val(`${URL_9CSCAN_WEB}/tx/${payload}`)
    $("#taskOutput").text(7)
  } catch (error) {
    throw error;
  }
}

function openTx() {
  let txOutput = document.getElementById("TXOutput").value;

  if (txOutput.startsWith("https")) {
    window.open(txOutput);
  }
}
