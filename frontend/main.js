const querySelector = document.getElementById("querySelector");
const startDateField = document.getElementById("startDateField");
const endDateField = document.getElementById("endDateField");
const searchButton = document.getElementById("searchButton");
const updateServerButton = document.getElementById("updateServerButton");
const loginArea = document.getElementById("loginArea");
const loginField = document.getElementById("inputLoginPassword");
const loginText = document.getElementById("loginText");
const searchSelector = document.getElementById("searchSelector");
const toolBar = document.getElementById("toolbar");
const loginTrustedSwitch = document.getElementById("loginTrustedSwitch");
const loginButton = document.getElementById("loginButton");

const urlDomain = 'http://localhost:3000';

let resultContent = [];
let queriesList = [];
let apiKey;
let apiKeyStored = false;

window.addEventListener("load", () => {
  startup();
});

function startup() {
  querySelector.addEventListener("change", requestResults);
  searchSelector.addEventListener("change", presetSearch);
  searchButton.addEventListener("click", refreshData);
  startDateField.addEventListener("keyup", refreshData, false);
  endDateField.addEventListener("keyup", refreshData, false);
  updateServerButton.addEventListener("click", updateServerAwin);
  loginField.addEventListener("keyup", submitApiKey, false);
  loginButton.addEventListener("click", submitApiKey);

  apiKey = localStorage.getItem("APIKEY");

  if (apiKey) {
    apiKeyStored = true;
    populateQueriesSelector();
  } else {
    showLogin(true);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function populatePresetSearches() {
  let todayStartDate = new Date(); // today 0h
  let todayStartDateStr = `${todayStartDate.getFullYear()}-${(
    todayStartDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${todayStartDate.getDate().toString().padStart(2, "0")}`;
  let thisWeekStartDate = new Date(
    todayStartDate - 1000 * 60 * 60 * 24 * todayStartDate.getDay()
  ); // start of current week (sunday)
  let thisWeekStartDateStr = `${thisWeekStartDate.getFullYear()}-${(
    thisWeekStartDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${thisWeekStartDate
      .getDate()
      .toString()
      .padStart(2, "0")}`;
  let thisMonthStartDate = new Date(todayStartDate.setDate(1)); // start of current month (day 1)
  let thisMonthStartDateStr = `${thisMonthStartDate.getFullYear()}-${(
    thisMonthStartDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${thisMonthStartDate
      .getDate()
      .toString()
      .padStart(2, "0")}`;

  queriesList = [
    "",
    todayStartDateStr,
    thisWeekStartDateStr,
    thisMonthStartDateStr,
  ];
  let option1 = document.createElement("option");
  let option2 = document.createElement("option");
  let option3 = document.createElement("option");
  let option4 = document.createElement("option");
  option1.value = 0;
  option1.innerHTML = "Período livre";
  option2.value = 1;
  option2.innerHTML = "Hoje";
  option3.value = 2;
  option3.innerHTML = "Esta semana";
  option4.value = 3;
  option4.innerHTML = "Este mês";
  searchSelector.appendChild(option1);
  searchSelector.appendChild(option2);
  searchSelector.appendChild(option3);
  searchSelector.appendChild(option4);

  searchSelector.selectedIndex = searchSelector.children.length - 1; // last option, this month
}

function showLogin(show) {
  if (show) {
    loginArea.className = loginArea.className.replace("d-none", "d-flex");
    toolBar.className = toolBar.className.replace("d-flex", "d-none");
    loginField.focus();
  } else {
    loginArea.className = loginArea.className.replace("d-flex", "d-none");
    toolBar.className = toolBar.className.replace("d-none", "d-flex");
  }
}

function submitApiKey(e) {
  if (
    (e && e.key && (e.key == "Enter" || e.keyCode == 13) && loginField.value) ||
    e.target.id == "loginButton"
  ) {
    apiKey = loginField.value;
    if (loginTrustedSwitch.checked) {
      localStorage.setItem("APIKEY", `${apiKey}`);
      apiKeyStored = true;
    } else {
    }
    populateQueriesSelector();
  }
}

function populateQueriesSelector() {
  if (!apiKey) {
    showLogin(true);
    return;
  }

  fetch(`${urlDomain}/queries?apiKey=${apiKey}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.length !== 0) {
        loginText.innerHTML = "Carregando página...";
        Object.keys(data).forEach((key) => {
          let newOption = document.createElement("option");
          newOption.value = key;
          newOption.innerHTML = data[key];
          querySelector.appendChild(newOption);
        });
        querySelector.selectedIndex = 0;
        showLogin(false);
        populatePresetSearches();
        setDefaultDate();
        querySelector.dispatchEvent(new Event("change"));
        console.log('running first update server')

        updateServerAwin(1000);

        return true;
      } else {
        loginText.innerHTML = "Senha inválida!";
        loginField.value = "";
        return false;
      }
    })
    .catch(function (err) {
      console.log("Something went wrong!", err);
    });
}

function removePassword() {
  localStorage.removeItem("APIKEY");
  apiKeyStored = false;
  window.location.reload();
}

function presetSearch() {
  if (searchSelector.selectedIndex != 0) {
    let today = new Date();
    endDateField.value = `${today.getFullYear()}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getDate().toString().padStart(2, "0")}`;
    startDateField.value = queriesList[searchSelector.value];
    requestResults();
  } else {
    startDateField.focus();
  }
}

function requestResults() {
  if (!apiKey) {
    showLogin(true);
    return;
  }

  searchButton.disabled = true;
  searchButton.classList.remove("opacity-75");
  searchButton.classList.add("opacity-50");

  if (querySelector.selectedIndex == 0) {
    updateServerButton.classList.remove('visually-hidden');
  } else {
    !updateServerButton.classList.contains('visually-hidden') ? updateServerButton.classList.add('visually-hidden') : null;
  }

  fetch(
    `${urlDomain}${querySelector.value}?apiKey=${apiKey}&startDate=${startDateField.value}&endDate=${endDateField.value}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      resultContent = data;

      if (querySelector.selectedIndex == 0) {
        createContentTableAwin();
      } else {
        let today = new Date();
        if (startDateField.value == (
          `${today.getFullYear()}-${(today.getMonth() + 1)
            .toString()
            .padStart(2, "0")
          }-${today.getDate().toString().padStart(2, "0")}`
        )) {
          createContentTableAmazonRealtime();
        } else {
          createContentTableAmazonEarnings();
        }
      }

      setTimeout(() => {
        searchButton.disabled = false;
        searchButton.classList.remove("opacity-50");
        searchButton.classList.add("opacity-75");
      }, 1000);
    })
    .catch(function (err) {
      console.log("Something went wrong!", err);
    });
}

function setDefaultDate() {
  let endDate = new Date();
  let endDateStr = `${endDate.getFullYear()}-${(endDate.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${endDate.getDate().toString().padStart(2, "0")}`;
  endDateField.value = endDateStr;
  startDateField.value = queriesList[searchSelector.value];
}

function refreshData(e) {
  if (e.currentTarget.id == "searchButton") {
    searchSelector.selectedIndex = 0;
    requestResults();
  } else {
    if (e && e.key && e.key !== "Enter" && e.keyCode !== 13) {
      return;
    } else {
      if (e.currentTarget.id == "startDateField") {
        endDateField.focus();
      } else if (e.currentTarget.id == "endDateField") {
        searchSelector.selectedIndex = 0;
        requestResults();
      }
    }
  }
}

async function updateServerAwin(sleepTime) {
  if (!apiKey) {
    showLogin(true);
    return;
  }

  updateServerButton.disabled = true;
  searchButton.disabled = true;
  searchButton.classList.remove("opacity-75");
  searchButton.classList.add("opacity-50");
  if (sleepTime && sleepTime > 0) {
    await sleep(sleepTime);
  }
  updateServerButton.innerHTML = "Atualizando...";
  fetch(`${urlDomain}/awin/update?apiKey=${apiKey}`)
    .then(function (response) {
      updateServerButton.innerHTML = "Atualizado!";
      console.log('requesting results')
      requestResults();

      setTimeout(() => {
        updateServerButton.innerHTML = "Atualizar Servidor";
        updateServerButton.disabled = false;
      }, 5000);
    })
    .catch(function (err) {
      console.log("Something went wrong!", err);
    });
}

//#region bootstrap-table creation

//#region awin

function createContentTableAwin() {
  let tableHeight = "";
  if (resultContent.length > 10) {
    tableHeight = window.innerHeight * 0.95;
  }

  $("#content-table").bootstrapTable("destroy");
  $("#content-table").bootstrapTable({
    locale: "pt-BR",
    toolbar: "#toolbar",
    pagination: true,
    pageList: "[10, 100, 1000, all]",
    pageSize: 100,
    formatClearSearch: function () {
      return "Remove a senha salva e volta para a tela inicial";
    },
    formatSearch: function () {
      return "Pesquisar";
    },
    formatColumns: function () {
      return "Colunas";
    },
    formatAllRows: function () {
      return "Todos";
    },
    formatShowingRows: function (pageFrom, pageTo, totalRows) {
      return `Mostrando ${pageFrom} a ${pageTo} de ${totalRows} registros`;
    },
    formatRecordsPerPage: function (pageNumber) {
      return `${pageNumber} registros por página`;
    },
    formatNoMatches: function (pageNumber) {
      return `Nenhum resultado`;
    },
    searchAccentNeutralise: true,
    searchHighlight: true,
    showFooter: true,
    headerStyle: "headerStyleAwin",
    footerStyle: "headerStyleAwin",
    showColumns: true,
    clickToSelect: true,
    filterControl: true,
    reorderableColumns: true,
    showSearchClearButton: true,
    height: tableHeight,
    classes: "table table-hover table-bordered table-striped",
    columns: [
      {
        field: "id",
        title: "ID",
        width: 10,
        align: "center",
        sortable: "true",
        footerFormatter: "totalFormatter",
        filterControl: "input",
        visible: false,
      },
      {
        field: "advertiserName",
        title: "Loja",
        width: 200,
        sortable: "true",
        filterControl: "select",
      },
      {
        field: "saleAmount",
        title: "Venda",
        width: 10,
        align: "right",
        sortable: "true",
        formatter: "amountFormatter",
        footerFormatter: "amountFooterFormatter",
        filterControl: "input",
      },
      {
        field: "commissionAmount",
        title: "Comissão",
        width: 10,
        align: "right",
        sortable: "true",
        formatter: "amountFormatter",
        footerFormatter: "amountFooterFormatter",
        filterControl: "input",
      },
      {
        field: "clickRefs",
        title: "Ref Clique",
        width: 200,
        align: "center",
        sortable: "true",
        filterControl: "select",
      },
      {
        field: "publisherUrl",
        title: "Url",
        width: 300,
        sortable: "true",
        filterControl: "input",
      },
      {
        field: "transactionDate",
        title: "Data",
        width: 200,
        align: "center",
        sortable: "true",
        sorter: "dateSorter",
        filterControl: "input",
      },
      {
        field: "commissionStatus",
        title: "Status",
        width: 10,
        align: "center",
        sortable: "true",
        formatter: "statusFormatter",
        filterControl: "select",
      },
    ],
    data: resultContent,
  });

  // set logout button
  $("button[name=clearSearch]").children()[0].remove();
  $("button[name=clearSearch]").append(
    '<i class="fa font-weight-bold font-monospace">SAIR</i>'
  );
  $("button[name=clearSearch]").removeClass('btn-secondary');
  $("button[name=clearSearch]").addClass('btn-outline-secondary');
  if (!$("button[name=clearSearch]").hasClass("opacity-75")) {
    $("button[name=clearSearch]").addClass("opacity-75");
  }
  if (apiKeyStored) {
    $("button[name=clearSearch]").removeClass("visually-hidden");
    $("button[name=clearSearch]").addClass("visible");
  } else {
    $("button[name=clearSearch]").removeClass("visible");
    $("button[name=clearSearch]").addClass("visually-hidden");
  }
  $("button[name=clearSearch]").on("click", removePassword);

  $("input[type=checkbox]").on("click", () => {
    fixFooter();
  });
  fixFooter();
}

function headerStyleAwin(column) {
  return {
    id: {
      css: { background: "azure", "font-size": "large" },
    },
    advertiserName: {
      css: { background: "azure", "font-size": "large" },
    },
    commissionAmount: {
      css: { background: "azure", "font-size": "large" },
    },
    saleAmount: {
      css: { background: "azure", "font-size": "large" },
    },
    clickRefs: {
      css: { background: "azure", "font-size": "large" },
    },
    publisherUrl: {
      css: { background: "azure", "font-size": "large" },
    },
    transactionDate: {
      css: { background: "azure", "font-size": "large" },
    },
    commissionStatus: {
      css: { background: "azure", "font-size": "large" },
    },
  }[column.field];
}

//#endregion

//#region amazon

function createContentTableAmazonEarnings() {
  let tableHeight = "";
  if (resultContent.length > 10) {
    tableHeight = window.innerHeight * 0.95;
  }

  $("#content-table").bootstrapTable("destroy");
  $("#content-table").bootstrapTable({
    locale: "pt-BR",
    toolbar: "#toolbar",
    pagination: true,
    pageList: "[10, 100, 1000, all]",
    pageSize: 100,
    formatClearSearch: function () {
      return "Remove a senha salva e volta para a tela inicial";
    },
    formatSearch: function () {
      return "Pesquisar";
    },
    formatColumns: function () {
      return "Colunas";
    },
    formatAllRows: function () {
      return "Todos";
    },
    formatShowingRows: function (pageFrom, pageTo, totalRows) {
      return `Mostrando ${pageFrom} a ${pageTo} de ${totalRows} registros`;
    },
    formatRecordsPerPage: function (pageNumber) {
      return `${pageNumber} registros por página`;
    },
    formatNoMatches: function (pageNumber) {
      return `Nenhum resultado`;
    },
    searchAccentNeutralise: true,
    searchHighlight: true,
    showFooter: true,
    headerStyle: "headerStyleAmazonEarnings",
    footerStyle: "headerStyleAmazonEarnings",
    showColumns: true,
    clickToSelect: true,
    filterControl: true,
    reorderableColumns: true,
    showSearchClearButton: true,
    height: tableHeight,
    classes: "table table-hover table-bordered table-striped",
    columns: [
      {
        field: "product_title",
        title: "Produto",
        width: 400,
        align: "left",
        sortable: "true",
        footerFormatter: "totalFormatter",
        filterControl: "input",
        visible: true,
      },
      {
        field: "tag_value",
        title: "Tag ID",
        width: 20,
        align: "left",
        sortable: "true",
        filterControl: "select",
        visible: true,
      },
      {
        field: "shipped_items",
        title: "Enviados",
        width: 20,
        align: "center",
        sortable: "true",
        footerFormatter: "amountFooterFormatterInteger",
        filterControl: "input",
        visible: true,
      },
      {
        field: "revenue",
        title: "Receita",
        width: 20,
        align: "right",
        sortable: "true",
        formatter: "amountFormatter",
        footerFormatter: "amountFooterFormatter",
        filterControl: "input",
        visible: true,
      },
      {
        field: "commission_earnings",
        title: "Comissão",
        width: 20,
        align: "right",
        sortable: "true",
        formatter: "amountFormatter",
        footerFormatter: "amountFooterFormatter",
        filterControl: "input",
        visible: true,
      },
      {
        field: "fee_rate",
        title: "Taxa",
        width: 20,
        align: "right",
        sortable: "true",
        formatter: "amountFormatter",
        filterControl: "input",
        visible: true,
      },
    ],
    data: resultContent,
  });

  // set logout button
  $("button[name=clearSearch]").children()[0].remove();
  $("button[name=clearSearch]").append(
    '<i class="fa font-weight-bold font-monospace">SAIR</i>'
  );
  $("button[name=clearSearch]").removeClass('btn-secondary');
  $("button[name=clearSearch]").addClass('btn-outline-secondary');
  if (!$("button[name=clearSearch]").hasClass("opacity-75")) {
    $("button[name=clearSearch]").addClass("opacity-75");
  }
  if (apiKeyStored) {
    $("button[name=clearSearch]").removeClass("visually-hidden");
    $("button[name=clearSearch]").addClass("visible");
  } else {
    $("button[name=clearSearch]").removeClass("visible");
    $("button[name=clearSearch]").addClass("visually-hidden");
  }
  $("button[name=clearSearch]").on("click", removePassword);

  $("input[type=checkbox]").on("click", () => {
    fixFooter();
  });
  fixFooter();
}

function createContentTableAmazonRealtime() {
  let tableHeight = "";
  if (resultContent.length > 10) {
    tableHeight = window.innerHeight * 0.95;
  }

  $("#content-table").bootstrapTable("destroy");
  $("#content-table").bootstrapTable({
    locale: "pt-BR",
    toolbar: "#toolbar",
    pagination: true,
    pageList: "[10, 100, 1000, all]",
    pageSize: 100,
    formatClearSearch: function () {
      return "Remove a senha salva e volta para a tela inicial";
    },
    formatSearch: function () {
      return "Pesquisar";
    },
    formatColumns: function () {
      return "Colunas";
    },
    formatAllRows: function () {
      return "Todos";
    },
    formatShowingRows: function (pageFrom, pageTo, totalRows) {
      return `Mostrando ${pageFrom} a ${pageTo} de ${totalRows} registros`;
    },
    formatRecordsPerPage: function (pageNumber) {
      return `${pageNumber} registros por página`;
    },
    formatNoMatches: function (pageNumber) {
      return `Nenhum resultado`;
    },
    searchAccentNeutralise: true,
    searchHighlight: true,
    showFooter: true,
    headerStyle: "headerStyleAmazonRealtime",
    footerStyle: "headerStyleAmazonRealtime",
    showColumns: true,
    clickToSelect: true,
    filterControl: true,
    reorderableColumns: true,
    showSearchClearButton: true,
    height: tableHeight,
    classes: "table table-hover table-bordered table-striped",
    columns: [
      {
        field: "product_title",
        title: "Produto",
        width: 400,
        align: "left",
        sortable: "true",
        footerFormatter: "totalFormatter",
        filterControl: "input",
        visible: true,
      },
      {
        field: "tracking_id",
        title: "Tag ID",
        width: 20,
        align: "left",
        sortable: "true",
        filterControl: "select",
        visible: true,
      },
      {
        field: "ordered_items",
        title: "Pedidos",
        width: 20,
        align: "center",
        sortable: "true",
        footerFormatter: "amountFooterFormatterInteger",
        filterControl: "input",
        visible: true,
      },
      {
        field: "price",
        title: "Preço",
        width: 20,
        align: "right",
        sortable: "true",
        formatter: "amountFormatter",
        footerFormatter: "amountFooterFormatter",
        filterControl: "input",
        visible: true,
      },
    ],
    data: resultContent,
  });

  // set logout button
  $("button[name=clearSearch]").children()[0].remove();
  $("button[name=clearSearch]").append(
    '<i class="fa font-weight-bold font-monospace">SAIR</i>'
  );
  $("button[name=clearSearch]").removeClass('btn-secondary');
  $("button[name=clearSearch]").addClass('btn-outline-secondary');
  if (!$("button[name=clearSearch]").hasClass("opacity-75")) {
    $("button[name=clearSearch]").addClass("opacity-75");
  }
  if (apiKeyStored) {
    $("button[name=clearSearch]").removeClass("visually-hidden");
    $("button[name=clearSearch]").addClass("visible");
  } else {
    $("button[name=clearSearch]").removeClass("visible");
    $("button[name=clearSearch]").addClass("visually-hidden");
  }
  $("button[name=clearSearch]").on("click", removePassword);

  $("input[type=checkbox]").on("click", () => {
    fixFooter();
  });
  fixFooter();
}

function headerStyleAmazonEarnings(column) {
  return {
    product_title: {
      css: { background: "azure", "font-size": "large" },
    },
    tag_value: {
      css: { background: "azure", "font-size": "large" },
    },
    revenue: {
      css: { background: "azure", "font-size": "large" },
    },
    commission_earnings: {
      css: { background: "azure", "font-size": "large" },
    },
    fee_rate: {
      css: { background: "azure", "font-size": "large" },
    },
    shipped_items: {
      css: { background: "azure", "font-size": "large" },
    },
  }[column.field];
}

function headerStyleAmazonRealtime(column) {
  return {
    product_title: {
      css: { background: "azure", "font-size": "large" },
    },
    tracking_id: {
      css: { background: "azure", "font-size": "large" },
    },
    price: {
      css: { background: "azure", "font-size": "large" },
    },
    ordered_items: {
      css: { background: "azure", "font-size": "large" },
    },
  }[column.field];
}

//#endregion

//#region all

// simple hack to fix bootstrap-table footer positioning issue when generating table
function fixFooter() {
  setTimeout(() => {
    let buttons = document.getElementsByClassName("dropdown-menu");
    let dropButton;
    for (var i = 0; i < buttons.length; i++) {
      if (buttons[i].classList.contains("dropdown-menu")) {
        dropButton = buttons[i];
      }
    }
    let dropButtonOptions = dropButton.children;
    for (var i = 0; i < dropButtonOptions.length; i++) {
      if (dropButtonOptions[i].classList.contains("active")) {
        dropButtonOptions[i].click();
      }
    }
  }, 100);
}

function dateSorter(a, b) {
  if (
    new Date(
      `${a.substring(6, 10)}-${a.substring(3, 5)}-${a.substring(
        0,
        2
      )} ${a.substring(11, 19)}`
    ) >
    new Date(
      `${b.substring(6, 10)}-${b.substring(3, 5)}-${b.substring(
        0,
        2
      )} ${b.substring(11, 19)}`
    )
  )
    return 1;
  if (
    new Date(
      `${a.substring(6, 10)}-${a.substring(3, 5)}-${a.substring(
        0,
        2
      )} ${a.substring(11, 19)}`
    ) <
    new Date(
      `${b.substring(6, 10)}-${b.substring(3, 5)}-${b.substring(
        0,
        2
      )} ${b.substring(11, 19)}`
    )
  )
    return -1;
  return 0;
}

function amountFormatter(data) {
  if (isNaN(data)) {
    return '-';
  } else {
    return parseFloat(data).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

function totalFormatter(data) {
  return data.length.toLocaleString("pt-BR");
}

function amountFooterFormatter(data) {
  var field = this.field;
  return data
    .map(function (row) {
      return +row[field];
    })
    .reduce(function (sum, i) {
      return sum + i;
    }, 0)
    .toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
}

function amountFooterFormatterInteger(data) {
  var field = this.field;
  return data
    .map(function (row) {
      return +row[field];
    })
    .reduce(function (sum, i) {
      return sum + i;
    }, 0)
    .toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
}

function statusFormatter(data) {
  switch (data) {
    case "pending":
      return "Pendente";
    case "declined":
      return "Recusada";
    case "approved":
      return "Aprovada";
  }
}

//#endregion

//#endregion
