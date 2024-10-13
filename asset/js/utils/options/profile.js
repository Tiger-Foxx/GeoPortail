function submitForm(json) {
    json.URL = document.getElementById("url-setting").value
    json.Port = document.getElementById("port-setting").value
    json.Latitude = document.getElementById("latitude-setting").value
    json.Longitude = document.getElementById("longitude-setting").value
    return json
}

const button = document.getElementById("subButton")

button.addEventListener("click", (err) => {
    if (true) {
        fetch("../../../../profile.json")
            .then((res) => {
                if (!res.ok) {
                    throw new Error
                        (`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                console.log(data)
                data = submitForm(data)
                data = JSON.stringify(data)
                console.log(data)
                localStorage.setItem("profile", data)
                console.log(JSON.parse(localStorage.getItem("profile")))
            })
            .catch((error) =>
                console.error("Unable to fetch data:", error));
    }
})