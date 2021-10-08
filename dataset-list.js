const loadDatasets = () => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://localhost:3000/api/v1/12345/author");
    xhttp.responseType = "json"
    xhttp.send();


    const datasets = JSON.parse(xhttp.responseText);

    const x = `
        <div class="col-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${datasets.givenName}</h5>
                    <hr>
                </div>
            </div>
        </div>
    `

    document.getElementById('datasets').innerHTML = document.getElementById('datasets').innerHTML + x;
    }
}

loadDatasets();
