const querySelector = document.getElementById("querySelector");
const startDateField = document.getElementById("startDateField");
const endDateField = document.getElementById("endDateField");
const searchButton = document.getElementById("searchButton");
const updateServerButton = document.getElementById("updateServerButton");
const loginArea = document.getElementById("loginArea");
const loginField = document.getElementById("inputLoginPassword");
const loginText = document.getElementById("loginText");
const searchSelector = document.getElementById("searchSelector");

const urlDomain = "http://localhost:3000";

let resultContent = [];
let queriesList = [];
let apiKey;

window.addEventListener("load", () => {
  startup();
});

function startup() {
  querySelector.addEventListener("change", requestResults);
  searchSelector.addEventListener("change", presetSearch);
  searchButton.addEventListener("click", refreshData);
  startDateField.addEventListener("keyup", refreshData, false);
  endDateField.addEventListener("keyup", refreshData, false);
  updateServerButton.addEventListener("click", updateServer);
  loginField.addEventListener("keyup", submitApiKey, false);

  apiKey = sessionStorage.getItem("APIKEY");

  if (apiKey) {
    showLogin(false);
  } else {
    showLogin(true);
  }
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
    loginField.focus();
  } else {
    loginArea.className = loginArea.className.replace("d-flex", "d-none");
  }
}

function submitApiKey(e) {
  if (e && e.key && (e.key == "Enter" || e.keyCode == 13) && loginField.value) {
    apiKey = loginField.value;
    localStorage.setItem("APIKEY", `${apiKey}`);
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
        updateServer();
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

  fetch(
    `${urlDomain}${querySelector.value}?apiKey=${apiKey}&startDate=${startDateField.value}&endDate=${endDateField.value}`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      resultContent = data;
      createContentTable();

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
  // searchSelector.selectedIndex = searchSelector.children.length - 1;
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

function updateServer() {
  if (!apiKey) {
    showLogin(true);
    return;
  }

  updateServerButton.disabled = true;
  searchButton.disabled = true;
  searchButton.classList.remove("opacity-75");
  searchButton.classList.add("opacity-50");
  updateServerButton.innerHTML = "Atualizando...";
  fetch(`${urlDomain}/update?apiKey=${apiKey}`)
    .then(function (response) {
      updateServerButton.innerHTML = "Atualizado!";
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

//#region transactions report

function createContentTable() {
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
    headerStyle: "headerStyle",
    footerStyle: "headerStyle",
    showColumns: true,
    clickToSelect: true,
    filterControl: true,
    reorderableColumns: true,
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
        field: "platformName",
        title: "Plataforma",
        width: 10,
        align: "center",
        sortable: "true",
        filterControl: "select",
      },
      {
        field: "advertiserName",
        title: "Loja",
        width: 200,
        sortable: "true",
        filterControl: "select",
      },
      {
        field: "commissionAmount",
        title: "Comissão",
        width: 10,
        align: "center",
        sortable: "true",
        formatter: "amountFormatter",
        footerFormatter: "amountFooterFormatter",
        filterControl: "input",
      },
      {
        field: "saleAmount",
        title: "Venda",
        width: 10,
        align: "center",
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

  // #region simple hack to fix bootstrap-table footer positioning issue when generating table
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
  // #endregion
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
  return parseFloat(data).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
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

function headerStyle(column) {
  return {
    id: {
      css: { background: "azure", "font-size": "large" },
    },
    platformName: {
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

//#endregion
