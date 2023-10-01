import fetch from "node-fetch";
import inquirer from "inquirer";

const BASE_URL = "http://45.77.168.105:5020/api";

const getService = async () => {
  try {
    const request = await fetch(BASE_URL + "/services");
    const response = await request.json();
    const services = response?.services || [];
    if (services.length == 0) return null;
    const serviceName = services.map((service) => service.service_name);
    return serviceName;
  } catch (err) {
    return null;
  }
};

const run = async () => {
  const serviceList = await getService();

  if (!serviceList) {
    console.log("Gagal mendapatkan list service");
    return;
  }

  const urlTiktok = await inquirer.prompt({
    type: "input",
    name: "url",
    message: "Masukkan URL: ",
  });

  const typeResponse = await inquirer.prompt({
    type: "list",
    name: "type",
    message: "Pilih jenis (Views, Shares, Favorites): ",
    choices: serviceList,
  });

  const postData = {
    url: urlTiktok.url,
    type: typeResponse.type,
  };

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  };

  fetch(BASE_URL + "/link/insert", requestOptions)
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        console.log("Berhasil menginput Url : " + urlTiktok.url);

        if (data.status === "We are already processing this link") {
          console.log("Data Sedang Di Proses Mohon Tunggu ! ");
        }
      } else {
        console.log("Gagal Menginput Silahkan Coba Lagi.");
      }
    })
    .catch((error) => {
      console.error("Terjadi kesalahan:", error);
    });
};

run();
