const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const inquirer = require('inquirer');


const run = async () => {

    const urlTiktok = await inquirer.prompt({
        type: 'input',
        name: 'url',
        message: 'Masukkan URL: ',
    });

    const typeResponse = await inquirer.prompt({
        type: 'list',
        name: 'type',
        message: 'Pilih jenis (Views, Shares, Favorites): ',
        choices: ['Views', 'Shares', 'Favorites', 'Comments Hearts'],
    });

    const postData = {
        url: urlTiktok.url,
        type: typeResponse.type,
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    };

    const url = 'http://45.77.168.105:5020/api/link/insert';

    fetch(url, requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Berhasil menginput Url : ' + urlTiktok.url)

                if (data.status === 'We are already processing this link') {
                    console.log('Data Sedang Di Proses Mohon Tunggu ! ')
                }
            } else {
                console.log('Gagal Menginput Silahkan Coba Lagi.')
            }
        })
        .catch(error => {
            console.error('Terjadi kesalahan:', error);
        });

}

run()