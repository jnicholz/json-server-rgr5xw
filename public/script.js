
var courseSel = "";
var courses = {};
var stat;
var stdID = null;
var logIDList = [];
function createUUID() {
  return "xxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function getCourses() {
  console.log("get Courses triggered");
  response = await axios("/api/v1/courses");
  for (datum in response.data) {
    $(
      "#course"
    ).innerHTML += `<option value=${response.data[datum].id}>${response.data[datum].display}</option>`;
  }
  courses = response.data;
}

function toggleFormBody(data) {
  let form = $("#restOfBody");
  if (data != 0) {
    show(form);
    courseSel = courses[data - 1].id;
    if (stdID != null) {
      removeList();
      getNotes(stdID);
    }
  } else {
    hide(form);
    courseSel = "";
  }
}

function removeList() {
  $("#logsList").innerHTML = "";
  logIDList = [];
}

async function checkID(data) {
  if (!isNaN(data)) {
    if (100000000 > data && data > 9999999) {
      $("#uvuIdDisplay").innerText = `Student Logs for ${data}`;
      stdID = data;
      getNotes(data);
    }
  }
}
async function getNotes(id) {
  console.log("get notes triggered");
  let response = await axios({
    method: "get",
    url: `https://json-server-jchvgz--3000.local.webcontainer.io/api/v1/logs?courseId=${courseSel}&uvuId=${id}`,
  });
  let data = response.data;
  for (datum in data) {
    let skip = false;
    for (ids in logIDList) {
      if (logIDList[ids] === data[datum].id) {
        skip = true;
        break;
      }
    }
    if (!skip) {
      $(
        "#logsList"
      ).innerHTML += `<li onclick="toggleNote( '#${data[datum].id}')" class ="my-2 rounded bg-purple-100">
                  <small class="self-end"> 
                    ${data[datum].date}
                  </small>
                <p style="display:block" id="${data[datum].id}">
                  ${data[datum].text}
                </p></li>`;
      logIDList.push(data[datum].id);
    }
  }
  $("#submitButton").removeAttribute("disabled");
}
function toggleNote(data) {
  disp = $(data).style.display;
  if (disp == "block") {
    hide($(data));
  } else {
    show($(data));
  }
}
async function sendIt() {
  let rn = new Date();
  let idToUse = createUUID();
  let text = $("#logInput").value;

  try {
    let response = await axios({
      method: "post",
      url: `https://json-server-jchvgz--3000.local.webcontainer.io/api/v1/logs?courseId=${courseSel}&uvuId=${stdID}&id=${idToUse}&courseId=${courseSel}&date=${rn.toLocaleString()}&text=${text}`,
      data: {
        courseId: courseSel,
        uvuId: stdID,
        date: rn.toLocaleString(),
        text: $("#logInput").value,
        id: idToUse,
      },
    });
    console.log(response);
    getNotes(stdID);
  } catch (err) {
    console.log(err);
  }
}
